/**
 * POST /api/auth/update-password — sets a new password on the
 * currently signed-in user.
 *
 * Used by /reset-password and /set-password. Both pages land here
 * with a recovery session that the callback route established by
 * exchanging the email-link code. We just call updateUser; if the
 * recovery session has expired or the user navigated here cold,
 * Supabase returns an auth error and we bounce them to /forgot-password.
 *
 * Optional fields the /set-password flow sends (and the
 * /reset-password flow does NOT send): `acceptedTerms: true` plus
 * `termsVersion: <date string>`. When both are present we stamp
 * public.members.terms_accepted_at = now() and .terms_version = the
 * provided string, capturing the legal-evidence trail for the
 * member's tick of the I-agree-to-Terms checkbox.
 *
 * Returns:
 *   200 { ok: true }
 *   400 { ok: false, error: "invalid_password|invalid_json|password_too_short" }
 *   401 { ok: false, error: "no_session" }
 *   500 { ok: false, error: "auth_not_configured|<supabase msg>" }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 10;

export async function POST(request: NextRequest) {
  let payload: {
    password?: unknown;
    acceptedTerms?: unknown;
    termsVersion?: unknown;
  } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const password = typeof payload.password === "string" ? payload.password : "";
  if (!password) {
    return NextResponse.json(
      { ok: false, error: "invalid_password" },
      { status: 400 },
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "password_too_short" },
      { status: 400 },
    );
  }

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
      { ok: false, error: "no_session" },
      { status: 401 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  // Persist Terms consent if the client asked us to. Done after the
  // password update so a member who fails password validation never
  // ends up with a half-recorded consent state. Soft-fail: if the
  // members row update errors (RLS, schema drift), we still return
  // ok:true on the password change — Sentry / logs catch the consent
  // write failure for follow-up rather than blocking sign-in.
  if (
    payload.acceptedTerms === true &&
    typeof payload.termsVersion === "string" &&
    payload.termsVersion.length > 0
  ) {
    const { error: consentError } = await supabase
      .from("members")
      .update({
        terms_accepted_at: new Date().toISOString(),
        terms_version: payload.termsVersion,
      })
      .eq("id", user.id);
    if (consentError) {
      // Non-fatal — log for triage. Most likely cause is migration
      // 0003_terms_consent.sql not yet applied to the project.
      console.error("[update-password] consent persist failed:", consentError);
    }
  }

  return NextResponse.json({ ok: true });
}
