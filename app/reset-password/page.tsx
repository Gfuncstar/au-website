/**
 * /reset-password — landing page for the password-reset email link.
 *
 * Auth flow:
 *   - User clicks email link → /api/auth/callback?code=…&next=/reset-password
 *   - Callback exchanges the code for a recovery session, sets cookies,
 *     redirects here
 *   - This page checks for a session; if none (cold link, expired
 *     token), bounces back to /forgot-password
 *   - PasswordSetForm submits to /api/auth/update-password
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PasswordSetForm } from "@/components/auth/PasswordSetForm";

// The session check reads cookies, which must happen on every request,
// not at build time. Force dynamic so a build without env vars can't
// freeze the page into a static "redirect to /login" response.
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=auth_not_configured");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <PasswordSetForm
      eyebrow="Reset password"
      heading="Choose a new password."
      intro="Use at least 10 characters. You'll sign in with this from now on."
      noticeFlag="password_reset"
    />
  );
}
