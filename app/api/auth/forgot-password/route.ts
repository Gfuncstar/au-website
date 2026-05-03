/**
 * POST /api/auth/forgot-password — sends a Supabase password-reset
 * email to the member.
 *
 * The email link points at /api/auth/callback?next=/reset-password,
 * so when the member clicks, the callback route exchanges the code
 * for a recovery session, then redirects them to /reset-password
 * where they pick a new password.
 *
 * Always returns 200, even if the email isn't on file. This is
 * deliberate: it prevents account enumeration. Supabase silently
 * no-ops on unknown emails.
 *
 * Returns:
 *   200 { ok: true }
 *   400 { ok: false, error: "invalid_email|invalid_json" }
 *   500 { ok: false, error: "auth_not_configured|<supabase msg>" }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let payload: { email?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
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

  const origin = new URL(request.url).origin;
  const redirectTo = `${origin}/api/auth/callback?next=/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
