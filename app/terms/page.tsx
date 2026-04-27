/**
 * /terms — Terms of Use / Terms & Conditions.
 *
 * PLACEHOLDER copy — solicitor-reviewed text required before launch.
 */

import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of use governing access to Aesthetics Unlocked® courses, content, and the AU members portal.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    body: "Aesthetics Unlocked® is a trading name operated by Bernadette Tobin. By accessing this site or buying a course, you agree to the terms below.",
  },
  {
    heading: "Educational content, not medical advice",
    body: "AU courses are educational. Nothing in any AU course is a substitute for professional clinical judgement on a specific patient. You're responsible for the treatments you provide and the regulatory environment you practise in.",
  },
  {
    heading: "Course access",
    body: "Paid courses give you a personal, non-transferable licence to the content. You can't share your login, redistribute the materials, or use them to build a competing product. Free tasters run on the same rules.",
  },
  {
    heading: "Refunds",
    body: "We offer a 14-day money-back guarantee on paid courses, no questions asked, provided you've completed less than 30% of the modules. Email hello@aunlock.co.uk to request a refund.",
  },
  {
    heading: "Intellectual property",
    body: "All AU course materials, the UNLOCK PROFIT™ Framework, the RAG Pathway™, From Regulation to Reputation™, The 5K+ Formula™, and the Aesthetics Unlocked® mark are owned by Bernadette Tobin / Aesthetics Unlocked. You can't reproduce them outside the personal use granted by your course licence.",
  },
  {
    heading: "Liability",
    body: "We do everything we can to keep AU running, accurate, and useful. We can't be liable for losses arising from your use of the content, your interpretation of any clinical material, or downtime on the members portal.",
  },
  {
    heading: "Governing law",
    body: "These terms are governed by the laws of England and Wales. Any disputes go to the courts of England and Wales.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      headline={[
        <span key="1">Terms,</span>,
        <span key="2">
          in <span style={{ color: "var(--color-au-pink)" }}>plain English</span>
          .
        </span>,
      ]}
      intro="The agreement between you and Aesthetics Unlocked® when you use this site or buy a course. Working draft — replaced with solicitor-reviewed copy before launch."
      lastUpdated="Working draft · April 2026"
      sections={SECTIONS}
    />
  );
}
