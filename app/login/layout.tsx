/**
 * /login layout — supplies metadata for the sign-in page.
 *
 * The login page itself is a client component (uses useSearchParams,
 * form state, etc.), so it can't export `metadata` directly. This
 * server-component layout sits beside it and provides the metadata
 * Next.js merges into the head.
 *
 * The login page is intentionally noindex: it's a passwordless OTP
 * sign-in for paid members, not a marketing surface. Mirrors the
 * `disallow: ["/login"]` rule already in app/robots.ts.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members sign in",
  description:
    "Sign in to your Aesthetics Unlocked members area with a one-time 6-digit code, no password required.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
