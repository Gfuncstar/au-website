/**
 * components/PlausibleScript.tsx
 *
 * Loads the Plausible analytics script when NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 * is set. Renders nothing otherwise — keeps dev / preview environments
 * free of analytics noise.
 *
 * The custom-event extension (`script.outbound-links.tagged-events`)
 * lets `track()` from lib/analytics.ts post named events alongside
 * pageviews. Single inline init function exposes window.plausible so
 * events fired before the script finishes loading still queue up
 * correctly.
 *
 * No cookies. No PII. No consent banner needed (UK GDPR-compliant
 * out of the box).
 */

import Script from "next/script";

export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.tagged-events.js"
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  );
}
