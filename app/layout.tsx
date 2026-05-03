import type { Metadata } from "next";
import { Montserrat, Oswald, Lato, Spectral } from "next/font/google";
import { PlausibleScript } from "@/components/PlausibleScript";
import "./globals.css";

/* ==========================================================================
   Fonts
   - Montserrat (display, hero) — 700, 800, 900
   - Oswald (sections, eyebrows, stat labels) — 500, 600
   - Lato (body) — 400, 700
   - Spectral (pull quotes, italic) — 400 italic
   ========================================================================== */

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

/* ==========================================================================
   Default metadata — surfaces the Educator of the Year 2026 nominee USP
   per build-decisions.md and seo-audit.md.
   ========================================================================== */

const SITE_URL = "https://www.aestheticsunlocked.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "UK Aesthetics Training & Compliance Courses | Aesthetics Unlocked",
    template: "%s · Aesthetics Unlocked®",
  },
  description:
    "UK aesthetics training, compliance and clinic strategy by Bernadette Tobin RN, MSc, Educator of the Year 2026 Nominee. NICE-aligned CPD for practitioners.",
  keywords: [
    // Core brand + educator
    "aesthetics education UK",
    "aesthetic practitioner training",
    "Bernadette Tobin",
    "MSc Advanced Practice aesthetics",
    "Educator of the Year 2026",
    "Beauty & Aesthetics Awards",
    // Business / clinic-owner queries (competitor gap per research)
    "aesthetics business course UK",
    "clinic owner profit framework",
    "aesthetic clinic pricing strategy UK",
    "from NHS nurse to aesthetics clinic owner",
    // Regulation queries (competitor gap)
    "aesthetics regulation course UK",
    "JCCP-aligned business training",
    "CQC compliance aesthetic clinic",
    "MHRA aesthetics",
    // AU's trademarked frameworks (own the IP terms)
    "RAG Pathway",
    "Traffic Light System aesthetics",
    "5K+ Formula",
    "UNLOCK PROFIT framework",
    // Clinical (NICE-aligned)
    "Acne Decoded NICE-aligned",
    "Rosacea Beyond Redness",
    "NICE-aligned acne treatment pathway clinic",
    // Standards
    "JCCP",
    "CPSA",
    "MHRA",
    "NICE",
  ],
  authors: [{ name: "Bernadette Tobin RN MSc" }],
  creator: "Bernadette Tobin",
  publisher: "Aesthetics Unlocked",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Aesthetics Unlocked® · Educator of the Year 2026 Nominee",
    description:
      "Education for UK aesthetic practitioners by Bernadette Tobin RN MSc, Beauty & Aesthetics Awards Educator of the Year 2026 Nominee.",
    url: SITE_URL,
    siteName: "Aesthetics Unlocked",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Aesthetics Unlocked® · Educator of the Year 2026 Nominee",
    description:
      "UK aesthetics education by Bernadette Tobin RN MSc. NICE-aligned, evidence-led.",
  },
  robots: {
    index: true,
    follow: true,
  },
  /**
   * Google Search Console verification.
   *
   * Activated post-DNS-flip on launch day. Google looks for the meta
   * tag in <head>; Next renders this from `metadata.verification.google`.
   * If the property is ever moved or re-verified, paste the new token
   * below.
   */
  verification: {
    google: "m21duHNZgtRfKf-Cdz4meL_4aQA2l0nYBFwphHPqX8o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${montserrat.variable} ${oswald.variable} ${lato.variable} ${spectral.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-au-white text-au-body">
        {/* Skip-to-content link for keyboard / screen-reader users.
            Hidden visually until focused, when it pops to the top-left
            with the AU brand. WCAG 2.1 AA compliance + a small SEO
            signal that the site is built with accessibility in mind. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-au-charcoal focus:text-au-white focus:rounded-[3px] focus:font-section focus:font-semibold focus:text-[0.8125rem]"
        >
          Skip to content
        </a>
        {children}
        <PlausibleScript />
      </body>
    </html>
  );
}
