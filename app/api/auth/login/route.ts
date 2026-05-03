/**
 * POST /api/auth/login — signs a member in with email + password.
 *
 * On success, Supabase's server client writes the session cookies via
 * the cookie handler in `createSupabaseServerClient`, so by the time
 * we return the browser is signed in. The page does a hard navigation
 * to /members afterwards so the SSR layer reads the new cookies.
 *
 * Returns:
 *   200 { ok: true }
 *   400 { ok: false, error: "invalid_email|invalid_password|invalid_json" }
 *   401 { ok: false, error: "invalid_credentials|email_not_confirmed" }
 *   500 { ok: false, error: "auth_not_configured|<supabase msg>" }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let payload: { email?: unknown; password?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 },
    );
  }
  if (!password) {
    return NextResponse.json(
      { ok: false, error: "invalid_password" },
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials")) {
      return NextResponse.json(
        { ok: false, error: "invalid_credentials" },
        { status: 401 },
      );
    }
    if (msg.includes("email not confirmed")) {
      return NextResponse.json(
        { ok: false, error: "email_not_confirmed" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
