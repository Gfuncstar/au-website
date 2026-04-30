/**
 * POST /api/subscribe
 *
 * Public free-taster opt-in endpoint. Receives email + first name from
 * the OptInForm, then:
 *
 *   1. Auto-enrols the lead in Supabase (creates auth user if needed,
 *      writes a `memberships` row for the free course, generates a
 *      magic-link with `redirectTo` = the course's lesson surface).
 *   2. Pushes the same lead into Kartra with the right list + tag, plus
 *      the magic-link URL as a custom field so Kartra's welcome-email
 *      template can reference it via `{magic_link_url}`.
 *
 * One submit → one Kartra-sent email → one click → signed-in member
 * dropped straight into the course. No "create a password" step, no
 * second email round-trip.
 *
 * Body (application/json):
 *   {
 *     email: string         (required)
 *     firstName?: string
 *     courseSlug: string    (required) — must match a slug in lib/courses.ts
 *     honeypot?: string     (must be empty — anti-spam trap)
 *   }
 *
 * Response: 200 { ok: true } on success; 4xx { ok: false, error } on
 * validation failure; 5xx { ok: false, error } on Kartra-side error.
 *
 * Failure model: Kartra is the load-bearing dependency for nurture-
 * sequence delivery. If Kartra fails, the whole call fails so the user
 * retries. If the Supabase auto-enrol step fails (e.g. Supabase
 * unreachable) we still complete the Kartra opt-in — the welcome
 * email will land without a magic-link, the user will fall through to
 * /login with email pre-filled.
 */

import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/kartra";
import { getKartraMapping } from "@/lib/kartra-mappings";
import { getCourse } from "@/lib/courses";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Run on the Node runtime (not edge) — the Kartra wrapper relies on
// `process.env` which is more reliable here, and the Supabase admin
// client uses Node-native crypto.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeBody = {
  email?: unknown;
  firstName?: unknown;
  courseSlug?: unknown;
  honeypot?: unknown;
};

export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Honeypot anti-spam — if a bot fills any "honeypot" field we silently
  // succeed (don't reveal the trap) but never call Kartra.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Validation
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : undefined;
  const courseSlug =
    typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 },
    );
  }
  if (!courseSlug) {
    return NextResponse.json(
      { ok: false, error: "courseSlug is required." },
      { status: 400 },
    );
  }
  if (firstName && firstName.length > 60) {
    return NextResponse.json(
      { ok: false, error: "firstName must be under 60 characters." },
      { status: 400 },
    );
  }

  const course = getCourse(courseSlug);
  if (!course) {
    return NextResponse.json(
      { ok: false, error: `Unknown course slug: ${courseSlug}` },
      { status: 400 },
    );
  }

  const mapping = getKartraMapping(courseSlug);
  if (!mapping?.optInListName) {
    return NextResponse.json(
      {
        ok: false,
        error: `Course "${courseSlug}" has no opt-in list configured. See lib/kartra-mappings.ts.`,
      },
      { status: 500 },
    );
  }

  /* ============================================================
     AUTO-ENROL — create/find Supabase auth user, write memberships
     row, generate magic-link. Best-effort: if any step fails we
     log and continue with the Kartra-only path so the lead is
     never stranded.
     ============================================================ */

  const normalizedEmail = email.toLowerCase();
  const admin = createSupabaseAdminClient();
  let magicLinkUrl: string | undefined;

  if (admin) {
    try {
      // 1) Find or create the auth user. We look up by email in `members`
      //    first (cheap, indexed) before falling back to createUser.
      const { data: existingMember } = await admin
        .from("members")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      let userId: string | undefined = existingMember?.id;

      if (!userId) {
        const { data: createData, error: createErr } =
          await admin.auth.admin.createUser({
            email: normalizedEmail,
            email_confirm: true,
            user_metadata: firstName ? { first_name: firstName } : undefined,
          });
        if (createErr) {
          // Common case: user already exists in auth.users but no `members`
          // row (the trigger fires on insert, so it should exist — log
          // and continue without auto-enrol).
          // eslint-disable-next-line no-console
          console.warn(
            "[/api/subscribe] admin.createUser non-fatal error:",
            createErr.message,
          );
        } else {
          userId = createData.user?.id;
        }
      }

      // 2) Upsert the `memberships` row for this free course so the
      //    entitlement gate at /members/courses/<slug> lets them in.
      if (userId) {
        const levelName =
          course.price === undefined ? "Free taster" : "Full access";
        const { error: membershipErr } = await admin
          .from("memberships")
          .upsert(
            {
              member_id: userId,
              course_slug: courseSlug,
              level_name: levelName,
              active: true,
              granted_at: new Date().toISOString(),
            },
            { onConflict: "member_id,course_slug" },
          );
        if (membershipErr) {
          // eslint-disable-next-line no-console
          console.error(
            "[/api/subscribe] memberships upsert failed:",
            membershipErr.message,
          );
        }
      }

      // 3) Generate the magic-link. `redirectTo` is the post-click
      //    landing URL; Supabase sends them through /api/auth/callback
      //    first to exchange the code for a session, then forwards.
      //
      //    Site origin: prefer NEXT_PUBLIC_SITE_URL, otherwise derive
      //    from the request (covers preview deploys and localhost
      //    automatically).
      const siteOrigin =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
        new URL(req.url).origin;
      const redirectTo = `${siteOrigin}/members/courses/${courseSlug}`;

      const { data: linkData, error: linkErr } =
        await admin.auth.admin.generateLink({
          type: "magiclink",
          email: normalizedEmail,
          options: { redirectTo },
        });
      if (linkErr) {
        // eslint-disable-next-line no-console
        console.warn(
          "[/api/subscribe] generateLink non-fatal error:",
          linkErr.message,
        );
      } else {
        const actionLink = linkData?.properties?.action_link;
        if (typeof actionLink === "string" && actionLink.length > 0) {
          magicLinkUrl = actionLink;
        }
      }
    } catch (err) {
      // Never let an auto-enrol failure block the Kartra-side opt-in.
      // eslint-disable-next-line no-console
      console.error("[/api/subscribe] auto-enrol threw:", err);
    }
  }

  /* ============================================================
     KARTRA — opt-in to list + tag, attach magic-link as custom
     field. Kartra is the source of truth for nurture sequences;
     this call is the load-bearing one.
     ============================================================ */

  const listNames = [mapping.optInListName];
  const tagNames = mapping.optInTagName ? [mapping.optInTagName] : undefined;
  const customFields = magicLinkUrl ? { magic_link_url: magicLinkUrl } : undefined;

  let result;
  try {
    result = await addLead({
      email,
      firstName,
      listNames,
      tagNames,
      customFields,
    });
  } catch (err) {
    // Most likely cause: missing env vars (KARTRA_APP_ID etc.).
    // Don't expose the underlying error to the client.
    // eslint-disable-next-line no-console
    console.error("[/api/subscribe] addLead threw:", err);
    return NextResponse.json(
      { ok: false, error: "Subscription service unavailable. Please try again." },
      { status: 503 },
    );
  }

  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error("[/api/subscribe] Kartra error:", result.error);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't add you to the list right now. Please try again or email hello@aunlock.co.uk.",
      },
      { status: result.httpStatus ?? 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
