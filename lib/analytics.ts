/**
 * lib/analytics.ts
 *
 * Privacy-friendly conversion tracking via Plausible. No cookies, no
 * PII, no consent banner needed (UK GDPR-compliant out of the box).
 *
 * Why Plausible (vs PostHog / GA4):
 *   - No cookies → no consent banner overhead
 *   - £9/mo flat for AU's traffic profile
 *   - Custom events surface in the same dashboard as pageviews
 *   - The script tag is one line; the API surface is one function
 *
 * Configuration:
 *   - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in env (e.g. "aestheticsunlocked.co.uk")
 *   - When unset, the <PlausibleScript> renders nothing and `track()`
 *     is a silent no-op — dev / preview environments stay clean
 *
 * Funnel events tracked:
 *   - opt_in_submit       — free-course OptInForm submitted
 *   - opt_in_success      — Kartra confirmed the lead was created
 *   - sign_in_request     — magic-link / OTP code requested
 *   - sign_in_success     — OTP verified, session created
 *   - lesson_view         — members-area lesson page rendered
 *   - lesson_complete     — "Mark complete" clicked on a lesson
 *   - course_purchase     — Kartra IPN fired membership_granted
 *   - course_revoke       — Kartra IPN fired membership_revoked
 *
 * Each event can carry small string `props` (e.g. courseSlug) for
 * funnel breakdown in the Plausible dashboard.
 */

export type AnalyticsEvent =
  | "opt_in_submit"
  | "opt_in_success"
  | "sign_in_request"
  | "sign_in_success"
  | "lesson_view"
  | "lesson_complete"
  | "course_purchase"
  | "course_revoke";

export type AnalyticsProps = Record<string, string | number | boolean>;

/**
 * Track a custom event from the browser. Silently no-ops on the
 * server, when Plausible isn't loaded, or when the script was
 * blocked by an ad-blocker.
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("opt_in_submit", { course: "free-3-day-startup" });
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  if (typeof plausible !== "function") return;
  try {
    plausible(event, props ? { props } : undefined);
  } catch {
    // Plausible silently swallows; we do too.
  }
}

/**
 * Server-side event tracking via Plausible's HTTP API. Used by
 * webhook routes (Kartra IPN, Stripe webhook) to record events that
 * happen outside a browser session.
 *
 * Plausible's events API expects:
 *   POST https://plausible.io/api/event
 *   { domain, name, url, props? }
 *
 * Caller MUST forward the original request's IP + User-Agent if
 * available (so Plausible deduplicates correctly). The `request`
 * argument is the incoming Next.js Request — we pull headers from it.
 */
export async function trackServer(
  event: AnalyticsEvent,
  request: Request | { headers: Headers; url: string },
  props?: AnalyticsProps,
): Promise<void> {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return;
  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          request.headers.get("user-agent") ?? "aesthetics-unlocked-server",
        "X-Forwarded-For":
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "127.0.0.1",
      },
      body: JSON.stringify({
        domain,
        name: event,
        url: request.url,
        props,
      }),
      // Webhook latency budget — fail fast if Plausible is slow.
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });
  } catch {
    // Analytics is best-effort. Never let a tracking failure break
    // a webhook handler.
  }
}

/* ============================================================
   Type augmentation — surfaces window.plausible() so call-sites
   inside React components type-check without `any` casts.
   ============================================================ */

type PlausibleFn = (
  event: string,
  options?: { callback?: () => void; props?: AnalyticsProps },
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}
