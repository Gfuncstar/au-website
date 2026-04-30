/**
 * POST /api/kartra/ipn — Kartra IPN (Outbound API) webhook.
 *
 * Kartra fires this endpoint on lead-related events. We sync those
 * events into the Supabase `members` and `memberships` tables so the
 * native course player can gate access by entitlement.
 *
 * Authentication
 * --------------
 * Kartra's IPN is NOT cryptographically signed (per kartra-api.md §4).
 * We verify by **shared secret** in the query string:
 *
 *   POST /api/kartra/ipn?key=<KARTRA_IPN_SECRET>
 *
 * Bernadette configures the URL with the secret in
 * Settings → Integrations → My API → Outbound API. The secret is
 * stored as the env var KARTRA_IPN_SECRET.
 *
 * Events handled at v1
 * --------------------
 *   - membership_granted   → upsert member + membership row, active=true
 *   - membership_revoked   → mark membership row active=false
 *   - subscription_cancelled → mark relevant membership active=false
 *
 * Anything else returns 200 with `{ ignored: true }` so Kartra doesn't
 * retry endlessly. Future events get added here.
 *
 * Important: this endpoint NEVER trusts the request to identify a
 * member by Supabase auth.uid() — that would let anyone with the
 * URL forge entitlements. The shared-secret check is the only
 * trust boundary.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCourseByMembershipName } from "@/lib/courses";
import { trackServer } from "@/lib/analytics";

const IPN_SECRET = process.env.KARTRA_IPN_SECRET ?? "";

export async function POST(request: NextRequest) {
  // 1) Shared-secret check
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!IPN_SECRET || key !== IPN_SECRET) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  // 2) Parse payload — Kartra sends form-encoded data with a JSON
  //    body field, OR direct JSON depending on configuration.
  let payload: KartraIpnPayload | null = null;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = (await request.json()) as KartraIpnPayload;
    } else {
      const form = await request.formData();
      const raw = form.get("payload") ?? form.get("data");
      if (typeof raw === "string") {
        payload = JSON.parse(raw) as KartraIpnPayload;
      }
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_payload" },
      { status: 400 },
    );
  }

  if (!payload || !payload.action || !payload.lead) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  // 3) Supabase admin client (service-role; bypasses RLS)
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    // Auth/Supabase isn't configured yet — accept the IPN silently so
    // Kartra doesn't retry. The event will be lost; reconciliation
    // happens on the first member sign-in by re-querying Kartra.
    return NextResponse.json({ ok: true, mode: "noop" });
  }

  // 4) Upsert the member row from the lead block (every event has it).
  const memberPatch = {
    email: payload.lead.email,
    first_name: payload.lead.first_name ?? null,
    last_name: payload.lead.last_name ?? null,
    kartra_lead_id: String(payload.lead.id),
    updated_at: new Date().toISOString(),
  };

  // The members.id column references auth.users(id) so we can't
  // insert a member without a corresponding auth user. We keep the
  // lead-side data on a "shadow" approach: members get created the
  // first time they sign in (handle_new_auth_user trigger). On IPN,
  // we write to a `kartra_pending` table OR we just skip the member
  // upsert and rely on the email-keyed memberships approach below.
  //
  // Simpler, ships today: upsert by email into a pending_memberships
  // table that's joined to members on first sign-in. For v1 we keep
  // it stricter — try the upsert but tolerate failure.

  // Try to find the existing member by email or kartra_lead_id.
  const { data: existingMember } = await supabase
    .from("members")
    .select("id")
    .eq("email", payload.lead.email)
    .maybeSingle();

  if (existingMember) {
    await supabase
      .from("members")
      .update(memberPatch)
      .eq("id", existingMember.id);
  }

  // 5) Action-specific handling
  switch (payload.action) {
    case "membership_granted": {
      const details = payload.action_details;
      if (!details?.membership_name) break;
      const course = getCourseByMembershipName(details.membership_name);
      if (!course) {
        // Unknown membership name — log and ignore. Saves us from
        // syncing memberships we have no slug mapping for.
        return NextResponse.json({
          ok: true,
          ignored: true,
          reason: "no_course_slug_for_membership_name",
          membership_name: details.membership_name,
        });
      }

      const grantPayload = {
        course_slug: course.slug,
        level_name: details.level_name ?? null,
        kartra_membership_id: details.membership_id
          ? String(details.membership_id)
          : null,
        kartra_level_id: details.level_id ? String(details.level_id) : null,
        active: true,
        granted_at: new Date().toISOString(),
      };

      if (existingMember) {
        // Member already exists in Supabase — write directly to memberships.
        await supabase.from("memberships").upsert(
          { member_id: existingMember.id, ...grantPayload },
          { onConflict: "member_id,course_slug" },
        );
      } else {
        // Member hasn't signed in yet — park the grant in pending_memberships.
        // The trigger on auth.users insert (see migration 0002) drains
        // these into memberships when the user finally signs in.
        await supabase.from("pending_memberships").upsert(
          { email: payload.lead.email.toLowerCase(), ...grantPayload },
          { onConflict: "email,course_slug" },
        );
      }

      // Conversion event — fire even if existingMember was null. The
      // grant happened in Kartra; the Supabase row lands now (or on
      // first sign-in via the drain trigger). Tracks the revenue moment.
      await trackServer("course_purchase", request, {
        course: course.slug,
        level: details.level_name ?? "",
      });
      break;
    }

    case "membership_revoked":
    case "subscription_cancelled": {
      const details = payload.action_details;
      if (!details?.membership_name) break;
      const course = getCourseByMembershipName(details.membership_name);
      if (!course) break;

      if (existingMember) {
        await supabase
          .from("memberships")
          .update({ active: false })
          .eq("member_id", existingMember.id)
          .eq("course_slug", course.slug);
      } else {
        // No member yet — flip the pending row to inactive (or insert one
        // as inactive if a grant never came through). The drain on first
        // sign-in produces an inactive memberships row, which the
        // entitlement check treats as no-access.
        await supabase.from("pending_memberships").upsert(
          {
            email: payload.lead.email.toLowerCase(),
            course_slug: course.slug,
            active: false,
            granted_at: new Date().toISOString(),
          },
          { onConflict: "email,course_slug" },
        );
      }

      await trackServer("course_revoke", request, {
        course: course.slug,
        action: payload.action,
      });
      break;
    }

    default:
      // Unhandled action — accept silently so Kartra doesn't retry.
      return NextResponse.json({ ok: true, ignored: true });
  }

  return NextResponse.json({ ok: true });
}

/* ============================================================
   Payload types — covers the IPN events we handle at v1.
   ============================================================ */

type KartraIpnPayload = {
  action: string;
  lead: {
    id: number | string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  action_details?: {
    membership_id?: number | string;
    membership_name?: string;
    level_id?: number | string;
    level_name?: string;
  };
};
