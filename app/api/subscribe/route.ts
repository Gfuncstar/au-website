/**
 * POST /api/subscribe
 *
 * Server-side endpoint that receives opt-in form submissions from the
 * AU site and creates the subscriber in Kartra. The form fields and
 * the Kartra automation sequences continue to live in Kartra — this
 * route is just the bridge so the user never sees a Kartra page.
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
 */

import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/kartra";
import { getKartraMapping } from "@/lib/kartra-mappings";
import { getCourse } from "@/lib/courses";

// Run on the Node runtime (not edge) — the Kartra wrapper relies on
// `process.env` which is more reliable here.
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

  // Build the lists/tags to apply. Kartra wants NAMES (verified
  // empirically). Both fields are optional in the wrapper; we
  // always pass the list, plus the tag if one is mapped.
  const listNames = [mapping.optInListName];
  const tagNames = mapping.optInTagName ? [mapping.optInTagName] : undefined;

  let result;
  try {
    result = await addLead({
      email,
      firstName,
      listNames,
      tagNames,
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
