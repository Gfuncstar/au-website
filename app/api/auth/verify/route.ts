/**
 * POST /api/auth/verify — exchanges a 6-digit OTP code (sent by email
 * via /api/auth/login) for a session cookie. Companion to the OTP
 * flow that replaces the magic-link click flow.
 *
 * Why OTP instead of magic-link click:
 *   Microsoft 365 (and other corporate email providers) pre-scan URLs
 *   in incoming emails — they "click" magic links automatically to
 *   check for malware, which consumes the one-shot token. By the
 *   time the human clicks for real, Supabase sees the token as
 *   already used and returns `otp_expired`. Typed-in codes don't
 *   have this problem.
 *
 * Returns:
 *   200 { ok: true }
 *   400 { ok: false, error: "invalid_email|invalid_code" }
 *   500 { ok: false, error: "..." }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let payload: { email?: unknown; code?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const code = typeof payload.code === "string" ? payload.code.trim() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }
  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { ok: false, error: "invalid_code" },
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

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
