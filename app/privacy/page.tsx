/**
 * /privacy — Privacy Policy.
 *
 * Body copy is PLACEHOLDER and will need solicitor-reviewed text before
 * launch. Structure follows the standard UK GDPR / DPA 2018 sections so
 * the eventual rewrite slots in cleanly.
 */

import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Aesthetics Unlocked® handles your personal data under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy, Aesthetics Unlocked®",
    description:
      "How Aesthetics Unlocked® handles your personal data under UK GDPR and the Data Protection Act 2018.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy, Aesthetics Unlocked®",
    description:
      "How Aesthetics Unlocked® handles your personal data under UK GDPR.",
  },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    body: "Aesthetics Unlocked® is a trading name operated by Bernadette Tobin. We're the data controller for any personal information you give us through this site, our courses, or our email lists.",
  },
  {
    heading: "What we collect",
    body: "When you sign up for a course, opt in to a free taster, or contact us, we collect your name, email address, and (for paid courses) the billing details required by our payment processor. We don't collect health data, financial account numbers, or anything else without your explicit consent.",
  },
  {
    heading: "How we use it",
    body: "Strictly to deliver the courses you've signed up for, send you the emails you've opted in to receive, and respond to enquiries. We never sell or share your details with third parties for their marketing.",
  },
  {
    heading: "Where it's stored",
    body: "Course delivery and email automation runs on Kartra (US-hosted, GDPR-compliant). Payments run through Stripe. Both are processors we trust and have signed Data Processing Agreements with.",
  },
  {
    heading: "Your rights",
    body: "You can ask us at any time to see, correct, or delete the personal data we hold about you. Email hello@aunlock.co.uk and we'll act on it within 30 days. You also have the right to complain to the ICO if you think we've handled your data badly, ico.org.uk.",
  },
  {
    heading: "Cookies",
    body: "We use a small number of cookies for analytics and to remember whether you're logged in. See our cookie policy for the full list.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      headline={[
        <span key="1">Your data,</span>,
        <span key="2">
          handled <span style={{ color: "var(--color-au-pink)" }}>properly</span>
          .
        </span>,
      ]}
      intro="A plain-English summary of how Aesthetics Unlocked handles your personal information. The below sections are the working draft and will be replaced with solicitor-reviewed copy before launch."
      lastUpdated="Working draft · April 2026"
      sections={SECTIONS}
    />
  );
}
