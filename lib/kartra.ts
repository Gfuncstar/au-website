/**
 * lib/kartra.ts
 *
 * Server-side Kartra API wrapper.
 *
 * RULE: this file MUST never be imported into client components. Kartra
 * credentials are read from `process.env` and only available on the
 * Node server. Use this from `app/api/*` routes only.
 *
 * Authentication
 * --------------
 * Every Kartra API call POSTs to https://app.kartra.com/api/ with
 * application/x-www-form-urlencoded body containing:
 *   app_id          — KARTRA_APP_ID
 *   api_key         — KARTRA_API_KEY
 *   api_password    — KARTRA_API_PASSWORD
 * plus the action-specific fields documented per function below.
 *
 * Env vars expected (all REQUIRED at runtime):
 *   KARTRA_APP_ID
 *   KARTRA_API_KEY
 *   KARTRA_API_PASSWORD
 *
 * Set these in `.env.local` for development and in Vercel → Project
 * Settings → Environment Variables for production. They MUST NOT be
 * committed to git.
 *
 * Rate limits
 * -----------
 * Kartra rate-limits the API at ~60 requests/minute per account. For
 * burst-y events (a launch day with 200 simultaneous opt-ins), this
 * wrapper short-circuits with a 429 if we exceed the limit; the
 * client-side form should retry with exponential backoff.
 *
 * Error model
 * -----------
 * Every function returns a `KartraResult<T>` — never throws on
 * Kartra-side errors. Network errors throw. This makes the API-route
 * code simpler.
 */

const KARTRA_API_URL = "https://app.kartra.com/api/";

export type KartraResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; httpStatus?: number };

type KartraAuth = {
  appId: string;
  apiKey: string;
  apiPassword: string;
};

function getAuth(): KartraAuth {
  const appId = process.env.KARTRA_APP_ID;
  const apiKey = process.env.KARTRA_API_KEY;
  const apiPassword = process.env.KARTRA_API_PASSWORD;
  if (!appId || !apiKey || !apiPassword) {
    throw new Error(
      "[lib/kartra] Missing Kartra credentials. Set KARTRA_APP_ID, KARTRA_API_KEY, KARTRA_API_PASSWORD in .env.local (dev) or Vercel env (prod).",
    );
  }
  return { appId, apiKey, apiPassword };
}

/**
 * Low-level POST to Kartra. Builds the form-encoded body with auth +
 * the supplied params. Caller is responsible for parsing the response.
 *
 * Kartra returns JSON in the body even though it's served as text/html.
 */
async function kartraRequest(
  params: Record<string, string>,
): Promise<KartraResult> {
  const auth = getAuth();
  const body = new URLSearchParams({
    app_id: auth.appId,
    api_key: auth.apiKey,
    api_password: auth.apiPassword,
    ...params,
  });

  let res: Response;
  try {
    res = await fetch(KARTRA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      // Kartra is a third-party API; no Next caching.
      cache: "no-store",
    });
  } catch (err) {
    return {
      ok: false,
      error: `Network error contacting Kartra: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: `Kartra HTTP ${res.status}`,
      httpStatus: res.status,
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      error: `Kartra returned non-JSON response: ${text.slice(0, 200)}`,
    };
  }

  // Kartra success responses look like { status: "Success", actions: [...] }
  // Kartra error responses look like { status: "Error", message: "..." }
  if (
    json &&
    typeof json === "object" &&
    "status" in json &&
    (json as { status: string }).status === "Success"
  ) {
    return { ok: true, data: json };
  }

  const message =
    (json as { message?: string; error?: string })?.message ??
    (json as { message?: string; error?: string })?.error ??
    "Unknown Kartra error";
  return { ok: false, error: `Kartra: ${message}` };
}

/* ============================================================
   PUBLIC API — small surface, focused on what AU actually needs.
   ============================================================ */

export type AddLeadInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  /**
   * Lists to subscribe the lead to. Use the exact list NAME as it
   * appears in Kartra (Lists tab) — Kartra's API expects names,
   * not numeric IDs (verified empirically: list_id was silently
   * ignored, list_name worked).
   */
  listNames?: readonly string[];
  /**
   * Tags to apply to the lead. Same convention as listNames —
   * exact tag name from the Kartra Tags tab.
   */
  tagNames?: readonly string[];
  /**
   * Custom-field values to set on the lead. Each key is the Kartra
   * custom-field internal name (e.g. `magic_link_url`); each value is
   * the literal string Kartra stores against the lead.
   *
   * Prerequisite: the field must already exist in Kartra under
   * Settings → Lead Custom Fields. If it doesn't, Kartra silently
   * ignores the value.
   *
   * Used to pass the auto-enrol Supabase magic-link into Kartra so the
   * welcome-email template can reference it via `{magic_link_url}`.
   */
  customFields?: Readonly<Record<string, string>>;
};

/**
 * Add (or update) a lead in Kartra and optionally subscribe them to
 * lists + apply tags. Idempotent — Kartra dedupes by email.
 *
 * The lists and tags applied here trigger any Kartra automation
 * sequences attached to those lists/tags (welcome emails, course
 * access, etc.). All those sequences continue to live in Kartra.
 *
 * Kartra request shape (verified empirically):
 *   lead[email]=...
 *   lead[first_name]=...
 *   actions[0][cmd]=create_lead                    ← required first action
 *   actions[1][cmd]=subscribe_lead_to_list
 *   actions[1][list_name]=My List
 *   actions[2][cmd]=assign_tag
 *   actions[2][tag_name]=My Tag
 */
export async function addLead(
  input: AddLeadInput,
): Promise<KartraResult<{ leadId?: string }>> {
  const params: Record<string, string> = {
    "lead[email]": input.email,
  };

  if (input.firstName) params["lead[first_name]"] = input.firstName;
  if (input.lastName) params["lead[last_name]"] = input.lastName;

  // Custom fields — Kartra accepts them as `lead[<field_internal_name>]`
  // identical to first_name / last_name. The field must be defined in
  // the Kartra account settings first; otherwise Kartra ignores it.
  for (const [key, val] of Object.entries(input.customFields ?? {})) {
    if (typeof val === "string" && val.length > 0) {
      params[`lead[${key}]`] = val;
    }
  }

  // First action is always create_lead — without it, Kartra treats
  // the lead[email] field as a get_lead query and returns "No lead
  // found" instead of creating one.
  let actionIndex = 0;
  params[`actions[${actionIndex}][cmd]`] = "create_lead";
  actionIndex++;

  for (const listName of input.listNames ?? []) {
    params[`actions[${actionIndex}][cmd]`] = "subscribe_lead_to_list";
    params[`actions[${actionIndex}][list_name]`] = listName;
    actionIndex++;
  }
  for (const tagName of input.tagNames ?? []) {
    params[`actions[${actionIndex}][cmd]`] = "assign_tag";
    params[`actions[${actionIndex}][tag_name]`] = tagName;
    actionIndex++;
  }

  const result = await kartraRequest(params);
  if (!result.ok) return result;

  // Kartra returns per-action results inside data.actions[]. Pull the
  // lead_id from the create_lead action if present.
  const data = result.data as
    | { actions?: Array<{ create_lead?: { lead_details?: { id?: string } } }> }
    | undefined;
  const leadId = data?.actions?.[0]?.create_lead?.lead_details?.id;
  return { ok: true, data: { leadId } };
}

/**
 * Look up a lead by email. Returns the tag IDs currently applied —
 * used by the /learn login to determine which courses a user has
 * access to. Returns `{ ok: true, data: null }` when the email
 * isn't in Kartra (Kartra returns this as `status: Error, type: 234,
 * message: No lead found` — semantically a successful lookup with
 * no result, not an auth failure).
 */
export async function getLeadByEmail(
  email: string,
): Promise<KartraResult<{ tagIds: readonly string[] } | null>> {
  const result = await kartraRequest({
    "get_lead[email]": email,
  });

  if (!result.ok) {
    // Treat "No lead found" (Kartra error type 234) as a successful
    // lookup with null data — this isn't an auth or system failure.
    if (
      typeof result.error === "string" &&
      result.error.toLowerCase().includes("no lead found")
    ) {
      return { ok: true, data: null };
    }
    return result;
  }

  // Kartra wraps the get_lead result in `lead_details`, NOT `lead`
  // (verified empirically via probe; tags appear there as
  // [{tag_name}] without tag_id in the recent API response).
  const data = result.data as
    | {
        lead_details?: {
          tags?: Array<{ tag_id?: string; tag_name?: string }>;
        };
      }
    | undefined;

  if (!data?.lead_details) return { ok: true, data: null };

  const tagIds = (data.lead_details.tags ?? [])
    .map((t) => t.tag_id ?? t.tag_name ?? "")
    .filter(Boolean);
  return { ok: true, data: { tagIds } };
}

/**
 * Fetch a lead by email with full detail — tags + memberships + lists.
 * Used by the backfill script to migrate existing Kartra members into
 * the Supabase memberships table on first deploy. Returns null when
 * the email isn't in Kartra.
 *
 * Kartra's `get_lead` returns the full lead object including
 * `memberships[]`. Each membership has `membership_id`,
 * `membership_name`, `level_id`, `level_name`, `active`, `granted_at`.
 */
export type KartraLeadDetail = {
  email: string;
  firstName: string;
  lastName: string;
  leadId: string | null;
  tagIds: readonly string[];
  tagNames: readonly string[];
  memberships: ReadonlyArray<{
    membershipId: string;
    membershipName: string;
    levelId: string;
    levelName: string;
    active: boolean;
    grantedAt: string;
  }>;
};

export async function getLeadDetail(
  email: string,
): Promise<KartraResult<KartraLeadDetail | null>> {
  const result = await kartraRequest({
    "get_lead[email]": email,
  });

  if (!result.ok) {
    if (
      typeof result.error === "string" &&
      result.error.toLowerCase().includes("no lead found")
    ) {
      return { ok: true, data: null };
    }
    return result;
  }

  // Kartra wraps the get_lead result under `lead_details` at the top
  // level (verified empirically by direct API probe 2026-04-30 — see
  // PROJECT-STATE.md notes). Earlier code expected `data.lead` which
  // never exists on the get_lead response.
  const data = result.data as
    | {
        lead_details?: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          tags?: Array<{ tag_id?: string; tag_name?: string }>;
          memberships?: Array<{
            membership_id?: string;
            membership_name?: string;
            level_id?: string;
            level_name?: string;
            active?: boolean | string;
            granted_at?: string;
          }>;
        };
      }
    | undefined;

  if (!data?.lead_details) return { ok: true, data: null };

  const tags = data.lead_details.tags ?? [];
  const memberships = (data.lead_details.memberships ?? []).map((m) => ({
    membershipId: m.membership_id ?? "",
    membershipName: m.membership_name ?? "",
    levelId: m.level_id ?? "",
    levelName: m.level_name ?? "",
    active: m.active === true || m.active === "true" || m.active === "1",
    grantedAt: m.granted_at ?? "",
  }));

  return {
    ok: true,
    data: {
      email: data.lead_details.email ?? email,
      firstName: data.lead_details.first_name ?? "",
      lastName: data.lead_details.last_name ?? "",
      leadId: data.lead_details.id ?? null,
      tagIds: tags.map((t) => t.tag_id ?? "").filter(Boolean),
      tagNames: tags.map((t) => t.tag_name ?? "").filter(Boolean),
      memberships,
    },
  };
}

/**
 * Apply a single tag to an existing lead by email. Used by Stripe
 * webhook on successful payment to mark the lead as "Acne Decoded
 * Purchased" etc. Pass the exact tag name from the Kartra Tags tab.
 */
export async function assignTag(
  email: string,
  tagName: string,
): Promise<KartraResult> {
  return kartraRequest({
    "lead[email]": email,
    "actions[0][cmd]": "assign_tag",
    "actions[0][tag_name]": tagName,
  });
}

/**
 * Remove a tag from an existing lead by email. Used by Stripe webhook
 * on subscription cancellation, refund, or chargeback to revoke access.
 */
export async function removeTag(
  email: string,
  tagName: string,
): Promise<KartraResult> {
  return kartraRequest({
    "lead[email]": email,
    "actions[0][cmd]": "remove_tag",
    "actions[0][tag_name]": tagName,
  });
}

/**
 * Subscribe or unsubscribe an existing lead from a Kartra list. Used
 * by the members-area communications-preferences UI to honour opt-out
 * choices (or re-opt-in if a member explicitly asks to be added back
 * to a sequence).
 *
 * Pass the EXACT list name from the Kartra Lists tab — same naming
 * rule as `addLead`.
 */
export async function setListSubscription(
  email: string,
  listName: string,
  subscribe: boolean,
): Promise<KartraResult> {
  return kartraRequest({
    "lead[email]": email,
    "actions[0][cmd]": subscribe
      ? "subscribe_lead_to_list"
      : "unsubscribe_lead_from_list",
    "actions[0][list_name]": listName,
  });
}

/**
 * Edit a lead's profile fields (first_name, last_name, phone, address,
 * etc.). Wired so the members-area "Account" page can sync edits back
 * to Kartra after writing them to Supabase.
 *
 * Patches are applied as `lead[<field>]=...` form fields, mirroring
 * the addLead shape. Only the fields present in the patch object are
 * sent — Kartra leaves untouched fields unchanged.
 */
export type EditLeadPatch = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneCountryCode?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  website?: string;
};

export async function editLead(
  email: string,
  patch: EditLeadPatch,
): Promise<KartraResult> {
  const params: Record<string, string> = {
    "lead[email]": email,
    "actions[0][cmd]": "edit_lead",
  };
  // Map camelCase patch fields to Kartra's snake_case form fields.
  const fieldMap: Record<keyof EditLeadPatch, string> = {
    firstName: "first_name",
    lastName: "last_name",
    phone: "phone",
    phoneCountryCode: "phone_country_code",
    company: "company",
    address: "address",
    city: "city",
    state: "state",
    zip: "zip",
    country: "country",
    website: "website",
  };
  for (const [key, val] of Object.entries(patch)) {
    if (val !== undefined && val !== null && val !== "") {
      const kartraKey = fieldMap[key as keyof EditLeadPatch];
      if (kartraKey) params[`lead[${kartraKey}]`] = val;
    }
  }
  return kartraRequest(params);
}

/**
 * Cancel a recurring subscription by its Kartra subscription_id. Used
 * by the members-area billing page when a member explicitly cancels.
 *
 * The subscription_id comes from the `recurring_subscriptions[]`
 * array on the lead — each entry has its own id.
 */
export async function cancelSubscription(
  subscriptionId: string,
): Promise<KartraResult> {
  return kartraRequest({
    "actions[0][cmd]": "cancel_recurring",
    "actions[0][subscription_id]": subscriptionId,
  });
}

/**
 * Check whether a lead exists in Kartra by email. Used by the sign-in
 * flow to render a "check your inbox" state without leaking which
 * emails belong to members. Returns `{ exists: false }` when the lead
 * isn't in Kartra (mapped from Kartra's "No lead found" error).
 *
 * Calm UX rule: callers SHOULD show "check your inbox" regardless of
 * the result, so a brute-force enumeration attack can't distinguish
 * existing members from new emails.
 */
export async function leadExists(
  email: string,
): Promise<KartraResult<{ exists: boolean; leadId?: string }>> {
  const result = await kartraRequest({
    "get_lead[email]": email,
  });
  if (!result.ok) {
    if (
      typeof result.error === "string" &&
      result.error.toLowerCase().includes("no lead found")
    ) {
      return { ok: true, data: { exists: false } };
    }
    return result;
  }
  // Kartra returns the lead under `lead_details` on get_lead — see
  // getLeadDetail above for the same correction.
  const data = result.data as
    | { lead_details?: { id?: string } }
    | undefined;
  return {
    ok: true,
    data: {
      exists: Boolean(data?.lead_details),
      leadId: data?.lead_details?.id,
    },
  };
}
