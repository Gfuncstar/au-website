/**
 * GET /api/auth/callback — magic-link landing endpoint.
 *
 * Supabase appends `?code=<one-time-code>&next=/members` to the
 * email link. We exchange the code for a session, set the cookies,
 * then redirect to the original destination (defaults to /members).
 *
 * If the exchange fails (expired link, tampered token), we redirect
 * to /login with an `?error=link_expired` flag so the page can show
 * a calm "send me another link" CTA.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/members";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=link_invalid`);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=auth_not_configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link_expired`);
  }

  // Only redirect inside our own origin to prevent open-redirect.
  const safeNext = next.startsWith("/") ? next : "/members";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
