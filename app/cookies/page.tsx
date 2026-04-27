/**
 * /cookies — Cookie Policy.
 *
 * PLACEHOLDER copy — replace with the actual cookie inventory once
 * analytics + tag-management are wired up before launch.
 */

import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What cookies Aesthetics Unlocked® uses, what they do, and how to control them.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "What cookies are",
    body: "Cookies are small text files a website stores on your device to remember things — whether you're logged in, which page you visited last, anonymous usage patterns. They're how the modern web works.",
  },
  {
    heading: "Strictly necessary",
    body: "These keep the site working. Members-area login, checkout flow, security tokens. You can't switch these off and still use the site, but they don't track you across the wider web.",
  },
  {
    heading: "Analytics",
    body: "We use a privacy-respecting analytics tool to understand which courses people read about, which pages bounce, and where the broken links are. The data is anonymised and aggregated — we don't see individual users.",
  },
  {
    heading: "Marketing",
    body: "If you opt in to email marketing, our automation platform (Kartra) sets a cookie so you don't see the same opt-in form twice. You can clear that cookie at any time from your browser settings.",
  },
  {
    heading: "Controlling cookies",
    body: "Every modern browser lets you block cookies, clear cookies, or be warned before they're set. ICO.org.uk has a step-by-step guide for every browser. Block strictly-necessary cookies and the members area won't function — that's the only trade-off.",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      headline={[
        <span key="1">Cookies,</span>,
        <span key="2">
          the <span style={{ color: "var(--color-au-pink)" }}>short version</span>
          .
        </span>,
      ]}
      intro="What we use, why, and how you control it. Working draft — final version slots in once analytics + tag-management are wired before launch."
      lastUpdated="Working draft · April 2026"
      sections={SECTIONS}
    />
  );
}
