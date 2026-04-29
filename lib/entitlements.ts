/**
 * lib/entitlements.ts
 *
 * Server-side helper for "is the current member entitled to this
 * course?" — used by the lesson player routes to decide whether to
 * render the lesson or bounce to the public sales page.
 *
 * Two modes:
 *   - LIVE : queries the Supabase `memberships` table for an active
 *            row keyed to (member_id, course_slug).
 *   - MOCK : reads MOCK_LEAD.memberships and resolves through
 *            getCourseByMembershipName so dev / previews still gate
 *            correctly against the mock data.
 *
 * Both modes return { entitled, reason } so the page can branch on
 * "not signed in" vs "signed in but not entitled".
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { kartra } from "@/lib/kartra/client";
import { getCourseByMembershipName } from "@/lib/courses";

export type EntitlementResult =
  | { entitled: true }
  | { entitled: false; reason: "not_signed_in" | "no_membership" };

/** Emails that bypass the memberships check and get access to every
 *  course. The owner of the platform — used so Giles / Bernadette can
 *  preview unreleased course content on the holding site without
 *  having to seed membership rows in Supabase. */
const OWNER_EMAILS = ["giles@hieb.co.uk"];

export async function checkCourseEntitlement(
  courseSlug: string,
): Promise<EntitlementResult> {
  // LIVE: Supabase configured → check session + memberships table.
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { entitled: false, reason: "not_signed_in" };
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { entitled: false, reason: "not_signed_in" };

    if (user.email && OWNER_EMAILS.includes(user.email.toLowerCase())) {
      return { entitled: true };
    }

    const { data: membership } = await supabase
      .from("memberships")
      .select("course_slug, active")
      .eq("member_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("active", true)
      .maybeSingle();

    return membership
      ? { entitled: true }
      : { entitled: false, reason: "no_membership" };
  }

  // MOCK: no auth wiring → use MOCK_LEAD memberships so the
  // entitlement gate is still exercised in dev.
  const lead = await kartra.getLead("");
  if (!lead) return { entitled: false, reason: "not_signed_in" };

  const owned = lead.memberships
    .filter((m) => m.active)
    .map((m) => getCourseByMembershipName(m.membership_name)?.slug)
    .filter((s): s is string => Boolean(s));

  return owned.includes(courseSlug)
    ? { entitled: true }
    : { entitled: false, reason: "no_membership" };
}
