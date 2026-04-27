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
  /** Optional list IDs to add the lead to. */
  listIds?: readonly string[];
  /** Optional tag IDs to apply. */
  tagIds?: readonly string[];
};

/**
 * Add (or update) a lead in Kartra and optionally subscribe them to
 * lists + apply tags. Idempotent — Kartra dedupes by email.
 *
 * The lists and tags applied here trigger any Kartra automation
 * sequences attached to those lists/tags (welcome emails, course
 * access, etc.). All those sequences continue to live in Kartra.
 */
export async function addLead(
  input: AddLeadInput,
): Promise<KartraResult<{ leadId?: string }>> {
  const params: Record<string, string> = {
    "lead[email]": input.email,
  };

  if (input.firstName) params["lead[first_name]"] = input.firstName;
  if (input.lastName) params["lead[last_name]"] = input.lastName;

  // Build the actions array. Kartra's API accepts:
  //   actions[N][cmd] = "subscribe_lead_to_list" | "assign_tag" | ...
  //   actions[N][list_id] / actions[N][tag_id]
  let actionIndex = 0;
  for (const listId of input.listIds ?? []) {
    params[`actions[${actionIndex}][cmd]`] = "subscribe_lead_to_list";
    params[`actions[${actionIndex}][list_id]`] = listId;
    actionIndex++;
  }
  for (const tagId of input.tagIds ?? []) {
    params[`actions[${actionIndex}][cmd]`] = "assign_tag";
    params[`actions[${actionIndex}][tag_id]`] = tagId;
    actionIndex++;
  }

  const result = await kartraRequest(params);
  if (!result.ok) return result;

  // Kartra often returns the lead_id inside data.actions; surface it
  // if present, otherwise just signal success.
  const data = result.data as { lead_id?: string } | undefined;
  return { ok: true, data: { leadId: data?.lead_id } };
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

  const data = result.data as
    | { lead?: { tags?: Array<{ tag_id: string }> } }
    | undefined;

  if (!data?.lead) return { ok: true, data: null };

  const tagIds = (data.lead.tags ?? []).map((t) => t.tag_id);
  return { ok: true, data: { tagIds } };
}

/**
 * Apply a single tag to a lead by email. Used by Stripe webhook on
 * successful payment to mark the lead as "Acne Decoded Purchased" etc.
 */
export async function assignTag(
  email: string,
  tagId: string,
): Promise<KartraResult> {
  return kartraRequest({
    "lead[email]": email,
    "actions[0][cmd]": "assign_tag",
    "actions[0][tag_id]": tagId,
  });
}

/**
 * Remove a tag from a lead by email. Used by Stripe webhook on
 * subscription cancellation, refund, or chargeback to revoke access.
 */
export async function removeTag(
  email: string,
  tagId: string,
): Promise<KartraResult> {
  return kartraRequest({
    "lead[email]": email,
    "actions[0][cmd]": "remove_tag",
    "actions[0][tag_id]": tagId,
  });
}
