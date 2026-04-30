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

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { kartra } from "@/lib/kartra/client";
import { getCourse, getCourseByMembershipName } from "@/lib/courses";
import { isOwnerEmail } from "@/lib/owner-emails";

export type EntitlementResult =
  | { entitled: true }
  | { entitled: false; reason: "not_signed_in" | "no_membership" };

/** Cookie name set by middleware when a request arrives with a valid
 *  `?preview=<AU_PREVIEW_TOKEN>` query param. Recognised here so
 *  preview-link visitors skip the membership check too. */
const PREVIEW_COOKIE = "au_preview_ok";

export async function checkCourseEntitlement(
  courseSlug: string,
): Promise<EntitlementResult> {
  // Local dev → unrestricted. Matches the middleware bypass so the
  // entire `/members/*` surface is editable on localhost without auth.
  if (process.env.NODE_ENV === "development") {
    return { entitled: true };
  }

  // Preview-link bypass — set by middleware on a valid `?preview=<TOKEN>`
  // hit. Does not require sign-in.
  const cookieStore = await cookies();
  if (cookieStore.get(PREVIEW_COOKIE)?.value === "1") {
    return { entitled: true };
  }

  // FREE-COURSE BYPASS: any course with no price is free, and the
  // brand promise is that free is free. Any signed-in user gets the
  // free course without needing a memberships row to be synced from
  // Kartra. This sidesteps the case where someone opted in via a
  // different funnel path (or owns this course via Kartra but the
  // Supabase membership row hasn't yet been created), and matches
  // the architectural decision in PROJECT-STATE.md §13 that the
  // members area is the brand surface for the free-taster bridge.
  //
  // The check runs AFTER auth so anonymous visitors still bounce to
  // the sales page; it just removes the per-user-per-free-course
  // gate for signed-in users.
  const course = getCourse(courseSlug);
  const isFreeCourse = course && course.price === undefined;

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

    if (isOwnerEmail(user.email)) {
      return { entitled: true };
    }

    if (isFreeCourse) {
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

  if (isFreeCourse) {
    return { entitled: true };
  }

  const owned = lead.memberships
    .filter((m) => m.active)
    .map((m) => getCourseByMembershipName(m.membership_name)?.slug)
    .filter((s): s is string => Boolean(s));

  return owned.includes(courseSlug)
    ? { entitled: true }
    : { entitled: false, reason: "no_membership" };
}
