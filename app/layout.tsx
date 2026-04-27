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
    "Education for UK aesthetic practitioners by Bernadette Tobin RN MSc — Beauty & Aesthetics Awards Educator of the Year 2026 Nominee. NICE-aligned, evidence-led courses on regulation, profit, and clinical practice.",
  keywords: [
    "aesthetics education UK",
    "aesthetic practitioner training",
    "clinic growth",
    "aesthetics business",
    "Bernadette Tobin",
    "Educator of the Year 2026",
    "RAG Pathway",
    "5K Formula",
    "Acne Decoded",
    "Rosacea Beyond Redness",
    "JCCP",
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
