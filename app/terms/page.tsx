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
    "Terms of use governing access to Aesthetics Unlocked® courses, content, and the Aesthetics Unlocked members portal.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms & Conditions, Aesthetics Unlocked®",
    description:
      "Terms of use governing access to Aesthetics Unlocked® courses and the members portal.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions, Aesthetics Unlocked®",
    description:
      "Terms of use governing access to Aesthetics Unlocked® courses and the members portal.",
  },
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
    heading: "All sales final",
    body: "Course enrolments are non-refundable. You're paying for lifetime access to the content as it exists at the point of purchase, plus every future update at no additional cost. Take a free taster first if you want to be sure the teaching style fits before you commit. If something genuinely goes wrong with your access, email hello@aunlock.co.uk and I'll make it right.",
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
    body: "These terms are governed by the laws of England and Wales. Any disputes go to the courts of England and Wales. If you are a consumer resident in Scotland or Northern Ireland, you may also have rights under the law of your country and may bring proceedings in the courts there. Nothing in these terms limits the statutory rights you have as a consumer where you live.",
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
      intro="The agreement between you and Aesthetics Unlocked® when you use this site or buy a course."
      lastUpdated="April 2026"
      sections={SECTIONS}
    />
  );
}
