/**
 * POST /api/members/enrol-free — authenticated equivalent of the public
 * OptInForm.
 *
 * Lets an existing signed-in member start a free taster from inside the
 * dashboard without going back out to a public sales page. Critically,
 * applies the SAME Kartra list + tag the public form does, so the
 * Kartra nurture automation fires identically. Without this route, an
 * existing member who clicks a free-course tile would bypass Kartra and
 * never receive the upsell sequence.
 *
 * Body (application/json):
 *   { courseSlug: string }    — must be a free course (price === undefined)
 *
 * Response:
 *   200 { ok: true, redirectTo: "/members/courses/<slug>" }
 *   400 { ok: false, error }   — missing/invalid course or paid course
 *   401 { ok: false, error: "not_signed_in" }
 *   500 { ok: false, error }   — Supabase or admin not configured
 *
 * Authorization: requires a Supabase session cookie. Paid courses are
 * intentionally rejected — those flow through Kartra checkout + IPN.
 */

import { NextResponse, type NextRequest } from "next/server";
import { addLead } from "@/lib/kartra";
import { getKartraMapping } from "@/lib/kartra-mappings";
import { getCourse } from "@/lib/courses";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = { courseSlug?: unknown };

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const courseSlug =
    typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
  if (!courseSlug) {
    return NextResponse.json(
      { ok: false, error: "courseSlug is required." },
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

  // Self-enrolment is for free courses only. Paid access flows through
  // Kartra checkout, not this endpoint.
  if (course.price !== undefined) {
    return NextResponse.json(
      {
        ok: false,
        error: "Paid courses are accessed via checkout, not self-enrolment.",
      },
      { status: 400 },
    );
  }

  // Authenticate the requester.
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "auth_not_configured" },
      { status: 500 },
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "not_signed_in" },
      { status: 401 },
    );
  }

  // Prefer the cached profile email/name; fall back to the auth user.
  const { data: member } = await supabase
    .from("members")
    .select("email, first_name")
    .eq("id", user.id)
    .maybeSingle();

  const email = member?.email ?? user.email;
  const firstName = member?.first_name ?? undefined;

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "no_email_on_account" },
      { status: 500 },
    );
  }

  /* ============================================================
     KARTRA — opt-in to list + tag (mirror of the public form). The
     Kartra automation fires the SAME nurture sequence the public
     opt-in does. No magic-link custom field needed here — the user
     is already signed in.
     ============================================================ */

  const mapping = getKartraMapping(courseSlug);
  if (mapping?.optInListName) {
    const listNames = [mapping.optInListName];
    const tagNames = mapping.optInTagName ? [mapping.optInTagName] : undefined;
    try {
      const result = await addLead({
        email,
        firstName,
        listNames,
        tagNames,
      });
      if (!result.ok) {
        // eslint-disable-next-line no-console
        console.error(
          "[/api/members/enrol-free] Kartra addLead error:",
          result.error,
        );
        // Don't fail the whole request — site access is more important
        // than the Kartra tag. We log and continue. Bernadette can
        // re-tag manually if needed.
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[/api/members/enrol-free] addLead threw:", err);
    }
  }

  /* ============================================================
     SUPABASE — write the memberships row so the entitlement gate
     lets them into /members/courses/<slug>. Uses the admin client
     because the `memberships` RLS policy is read-only for members
     (writes are service-role only).
     ============================================================ */

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "admin_not_configured" },
      { status: 500 },
    );
  }

  const { error: upsertErr } = await admin.from("memberships").upsert(
    {
      member_id: user.id,
      course_slug: courseSlug,
      level_name: "Free taster",
      active: true,
      granted_at: new Date().toISOString(),
    },
    { onConflict: "member_id,course_slug" },
  );

  if (upsertErr) {
    // eslint-disable-next-line no-console
    console.error(
      "[/api/members/enrol-free] memberships upsert failed:",
      upsertErr.message,
    );
    return NextResponse.json(
      { ok: false, error: "enrolment_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, redirectTo: `/members/courses/${courseSlug}` },
    { status: 200 },
  );
}
