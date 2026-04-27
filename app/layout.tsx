import type { Metadata } from "next";
import { Montserrat, Oswald, Lato, Spectral } from "next/font/google";
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
      "Aesthetics Unlocked® — UK Aesthetics Education · Educator of the Year 2026 Nominee",
    template: "%s — Aesthetics Unlocked®",
  },
  description:
    "Education for UK aesthetic practitioners by Bernadette Tobin RN MSc — working clinic owner, NHS clinical leader, and Educator of the Year 2026 Nominee at the Beauty & Aesthetics Awards. NICE-aligned, JCCP-aware, evidence-led courses on regulation, profit, and clinical practice.",
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
      "Aesthetics Unlocked® — Educator of the Year 2026 Nominee",
    description:
      "Education for UK aesthetic practitioners by Bernadette Tobin RN MSc — Beauty & Aesthetics Awards Educator of the Year 2026 Nominee.",
    url: SITE_URL,
    siteName: "Aesthetics Unlocked",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Aesthetics Unlocked® — Educator of the Year 2026 Nominee",
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
   * To activate: paste the value Google gives you in Search Console
   * (Add property → URL prefix → HTML tag verification) between the
   * quotes below, then redeploy. Google looks for the meta tag in
   * <head>; Next renders this from `metadata.verification.google`.
   *
   * Commented out until the production domain is pointed at this
   * Vercel project — verifying a Vercel preview URL would index
   * staging pages, not the real domain.
   */
  // verification: {
  //   google: "PASTE_VERIFICATION_TOKEN_HERE",
  // },
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
        {children}
      </body>
    </html>
  );
}
