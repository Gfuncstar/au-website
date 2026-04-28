/**
 * lib/kartra/client.ts
 *
 * Server-side member-data client. Two modes:
 *
 *   - LIVE   : Supabase env vars are set AND a session cookie exists.
 *              `getLead("")` reads the signed-in user's row from the
 *              Supabase `members` + `memberships` tables (synced from
 *              Kartra via the IPN webhook) and returns a Lead-shaped
 *              object. Empty arrays for buckets we don't sync at v1
 *              (transactions, sequences, calendars, surveys, etc.).
 *
 *   - MOCK   : Supabase isn't configured OR the user isn't signed in.
 *              Returns MOCK_LEAD so dev / previews still render the
 *              full dashboard.
 *
 * The `searchLead` / `editLead` / `cancelRecurringSubscription` /
 * `toggleListSubscription` methods stay mock-only at v1 — they need
 * a real Kartra API call to be useful, and the dashboard surface for
 * those (account edit, billing) doesn't ship until the kartra-API
 * client lands. Account edits stored in Supabase only at v1.
 */

import type {
  Lead,
  LeadMembership,
} from "./types";
import { MOCK_LEAD } from "./mock";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface KartraClient {
  searchLead(email: string): Promise<{ exists: boolean; id?: string }>;
  getLead(emailOrId: string): Promise<Lead | null>;
  cancelRecurringSubscription(subscriptionId: string): Promise<void>;
  toggleListSubscription(
    email: string,
    listName: string,
    subscribe: boolean,
  ): Promise<void>;
  editLead(email: string, patch: Partial<Lead>): Promise<void>;
}

/**
 * Build a Lead from the signed-in user's Supabase rows. Returns null
 * if the user isn't signed in OR Supabase isn't configured — caller
 * should fall back to MOCK_LEAD in that case.
 */
async function getLeadFromSupabase(): Promise<Lead | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Pull member profile + active memberships in parallel.
  const [{ data: member }, { data: memberships }] = await Promise.all([
    supabase
      .from("members")
      .select("id, email, first_name, last_name, kartra_lead_id, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("memberships")
      .select(
        "course_slug, level_name, granted_at, active, kartra_membership_id, kartra_level_id",
      )
      .eq("member_id", user.id),
  ]);

  // If the trigger hasn't fired (first ever sign-in), member row may
  // not exist yet. Treat as a brand-new lead with no entitlements.
  const email = member?.email ?? user.email ?? "";
  const firstName = member?.first_name ?? "";
  const lastName = member?.last_name ?? "";

  // Map memberships into the Lead shape. We don't have membership_id
  // for non-Kartra-synced rows, so synthesise from the slug. The
  // dashboard only uses `membership_name` + `level_name` + `active`
  // for routing, so this is enough.
  const leadMemberships: LeadMembership[] = (memberships ?? []).map(
    (m, i) => ({
      membership_id: m.kartra_membership_id ?? `${user.id}:${m.course_slug}`,
      membership_name: m.course_slug, // overridden by SLUG_TO_NAME below
      level_id: m.kartra_level_id ?? `${user.id}:${m.course_slug}:${i}`,
      level_name: m.level_name ?? "Full access",
      active: m.active,
      granted_at: m.granted_at ?? new Date().toISOString(),
    }),
  );

  // Resolve course_slug → membership_name via lib/courses.ts so the
  // launchpad's getCourseByMembershipName lookup still works.
  // (Imported here to avoid pulling lib/courses into the type file.)
  const { COURSES } = await import("@/lib/courses");
  for (const lm of leadMemberships) {
    const course = COURSES.find((c) => c.slug === lm.membership_name);
    if (course?.kartraMembershipName) lm.membership_name = course.kartraMembershipName;
  }

  return {
    id: member?.kartra_lead_id ?? user.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: "",
    phone_country_code: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    website: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    lead_picture: "",
    score: 0,
    source: "members-app",
    ip_country: "",
    ip: "",
    notes: "",
    date_joined: member?.created_at ?? user.created_at ?? new Date().toISOString(),
    lead_preferred_time_zone: "",
    gdpr_lead_status: "unknown",
    gdpr_lead_status_date: "",
    gdpr_lead_communications: false,
    tags: [],
    lists: [],
    sequences: [],
    memberships: leadMemberships,
    custom_fields: [],
    transactions: [],
    recurring_subscriptions: [],
    calendar_bookings: [],
    surveys: [],
  };
}

export const kartra: KartraClient = {
  async searchLead(email) {
    if (email.toLowerCase() === MOCK_LEAD.email.toLowerCase()) {
      return { exists: true, id: MOCK_LEAD.id };
    }
    // Calm "always show check-your-inbox" UX so we don't leak which
    // emails belong to members.
    return { exists: true, id: MOCK_LEAD.id };
  },

  async getLead(emailOrId) {
    // Empty string = "current signed-in user". Try Supabase first,
    // fall back to MOCK_LEAD.
    if (emailOrId === "") {
      const live = await getLeadFromSupabase();
      return live ?? MOCK_LEAD;
    }
    // Specific email/id lookup — mock for now (no real Kartra API
    // wiring yet). Returns MOCK_LEAD so demos still resolve.
    return MOCK_LEAD;
  },

  async cancelRecurringSubscription() {
    return;
  },

  async toggleListSubscription() {
    return;
  },

  async editLead() {
    return;
  },
};
