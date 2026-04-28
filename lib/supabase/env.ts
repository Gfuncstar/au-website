/**
 * Supabase env-var contract.
 *
 * The members area runs in two modes:
 *   - LIVE  — env vars are present, so real Supabase Auth + the
 *             Kartra-synced entitlements gate are in effect.
 *   - MOCK  — env vars are missing, so the dashboard falls back to
 *             MOCK_LEAD and no auth/entitlement check runs (dev mode).
 *
 * The fallback is important: it lets the app keep building and
 * rendering on Vercel previews and locally while Bernadette/Giles
 * are still wiring the Supabase project. The moment the three vars
 * below are set, auth quietly activates.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
/** Service-role key — server-only, never exposed to the browser.
 *  Used by the Kartra IPN endpoint to write membership data without
 *  needing a member's session cookie. */
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the public env vars are set — drives whether we run in
 *  LIVE or MOCK mode. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
