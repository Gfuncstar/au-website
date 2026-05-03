/**
 * /set-password — first-time login for migrated and new-purchase
 * members. Same mechanism as /reset-password (recovery session
 * established by the email-link callback), different copy.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PasswordSetForm } from "@/components/auth/PasswordSetForm";

// The session check reads cookies, which must happen on every request,
// not at build time. Force dynamic so a build without env vars can't
// freeze the page into a static "redirect to /login" response.
export const dynamic = "force-dynamic";

export default async function SetPasswordPage() {
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
      eyebrow="Welcome to Aesthetics Unlocked"
      heading="Set your password."
      intro="Pick a password you'll remember. At least 10 characters. You'll use this every time you sign in from now on."
      noticeFlag="password_set"
    />
  );
}
