/**
 * POST /api/auth/login — sends a Supabase magic-link email to the
 * member. Two-step auth flow:
 *   1) Member submits email on /login → POST here → Supabase emails
 *      a magic-link
 *   2) Member clicks the link → lands at /api/auth/callback → session
 *      cookies set → redirect to /members (or `next` param)
 *
 * Returns:
 *   200 { ok: true }                     — link sent
 *   400 { ok: false, error: "..." }      — bad input
 *   500 { ok: false, error: "..." }      — Supabase error or not configured
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let payload: { email?: unknown; next?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const next = typeof payload.next === "string" ? payload.next : "/members";
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
  const emailRedirectTo = `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      // We don't auto-create accounts here — the IPN webhook is the
      // only path that establishes a member. If the email isn't on
      // file as a member yet, the magic-link will still send (so
      // existing-customer-not-yet-synced doesn't fail) but the
      // entitlement check on /members/courses/<slug> will bounce
      // them to the public sales page.
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
