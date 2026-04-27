/**
 * Footer — recurring trust band on every page.
 *
 * v2 — rebuilt per Giles' "add NMC PIN, registered with the Royal
 * College of Nursing, Instagram, prominent email" call. The footer now
 * surfaces:
 *   - Logo + tagline
 *   - Big email CTA (mailto)
 *   - Trust strip: NMC PIN 05G1755E · Registered with RCN · MSc Adv Practice
 *   - Awards strip
 *   - Site nav (courses / about / standards / contact / faqs)
 *   - Legal column
 *   - Instagram link
 *   - Copyright
 */

import Link from "next/link";
import Image from "next/image";
import { AWARDS, BRAND, FOUNDER } from "@/lib/credentials";
import { NMC_REGISTER_URL } from "@/lib/links";

const FOOTER_LINKS = [
  {
    title: "Courses",
    items: [
      { href: "/courses/free-3-day-startup", label: "5K+ Mini · Free" },
      { href: "/courses/free-2-day-rag", label: "RAG Mini · Free" },
      { href: "/courses/acne-decoded", label: "Acne Decoded · £79" },
      { href: "/courses/rosacea-beyond-redness", label: "Rosacea Beyond Redness · £79" },
      { href: "/courses/rag-pathway", label: "The RAG Pathway · Waitlist" },
      { href: "/courses/5k-formula", label: "The 5K+ Formula™ · Waitlist" },
    ],
  },
  {
    title: "Aesthetics Unlocked",
    items: [
      { href: "/about", label: "About Bernadette" },
      { href: "/standards", label: "Standards we teach against" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-au-black text-au-white">
      <div className="mx-auto max-w-7xl px-[35px] sm:px-10 md:px-14 py-16 sm:py-20">
        {/* ============================================================
            TOP — logo + tagline + big email CTA.
            ============================================================ */}
        <div className="grid md:grid-cols-[5fr_4fr] gap-10 md:gap-16 pb-12 sm:pb-14 border-b border-au-white/15">
          <div>
            <Image
              src="/brand/au-logo-pink-on-dark.png"
              alt={BRAND.nameWithMark}
              width={640}
              height={232}
              className="h-10 sm:h-12 w-auto"
            />
            <p className="mt-6 text-[1rem] sm:text-[1.0625rem] text-au-white/75 max-w-md leading-relaxed">
              An education platform built to help{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                aesthetic practitioners and clinic owners
              </span>{" "}
              scale with clarity, structure, and confidence.
            </p>
          </div>

          {/* Email CTA — prominent. */}
          <div className="flex flex-col items-start md:items-end justify-start">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-white/55 mb-3">
              Get in touch
            </p>
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-3 px-5 sm:px-6 py-3.5 bg-[var(--color-au-pink)] text-au-black hover:bg-au-white transition-colors rounded-[5px] font-display font-bold leading-none"
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.125rem)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {BRAND.email}
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={BRAND.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] text-au-white/65 hover:text-au-white transition-colors"
            >
              Instagram · @{BRAND.instagram.handle}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* ============================================================
            TRUST STRIP — NMC PIN, RCN, MSc.
            ============================================================ */}
        <div className="py-8 sm:py-10 border-b border-au-white/15 flex flex-wrap items-center gap-x-8 gap-y-3 font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem]">
          <span className="text-au-white/55">For trust</span>
          <span aria-hidden="true" className="text-au-white/30">
            ·
          </span>
          <span className="text-au-white/85">
            NMC Pin{" "}
            <a
              href={NMC_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-au-pink)] transition-colors"
              style={{ color: "var(--color-au-pink)" }}
            >
              {FOUNDER.nmcPin}
            </a>
          </span>
          <span aria-hidden="true" className="text-au-white/30">
            ·
          </span>
          <span className="text-au-white/85">
            Registered with the Royal College of Nursing
          </span>
          <span aria-hidden="true" className="text-au-white/30">
            ·
          </span>
          <span className="text-au-white/85">
            MSc Advanced Practice (Level 7)
          </span>
        </div>

        {/* ============================================================
            NAV COLUMNS
            ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-10 sm:py-12 border-b border-au-white/15">
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-white/50 mb-4">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.9375rem] text-au-white/85 hover:text-[var(--color-au-pink)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ============================================================
            AWARDS STRIP
            ============================================================ */}
        <div className="py-8 sm:py-10 grid sm:grid-cols-2 gap-6 text-[0.8125rem] text-au-white/70 border-b border-au-white/15">
          <p>
            <span className="block font-section uppercase tracking-[0.15em] text-[var(--color-au-pink)] text-[0.6875rem] mb-2">
              {AWARDS[0].status} · {AWARDS[0].year}
            </span>
            <span className="text-au-white">{AWARDS[0].short}</span>
            <span className="block text-au-white/55 mt-0.5">
              {AWARDS[0].awardingBody}
            </span>
          </p>
          <p>
            <span className="block font-section uppercase tracking-[0.15em] text-[var(--color-au-pink)] text-[0.6875rem] mb-2">
              {AWARDS[1].status} · {AWARDS[1].year}
            </span>
            <span className="text-au-white">{AWARDS[1].short}</span>
            <span className="block text-au-white/55 mt-0.5">
              {AWARDS[1].awardingBody} · Founder, Visage Aesthetics
            </span>
          </p>
        </div>

        {/* ============================================================
            COPYRIGHT
            ============================================================ */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between gap-4 text-[0.75rem] text-au-white/50">
          <p>
            © {new Date().getFullYear()} {BRAND.nameWithMark}. All rights reserved.
          </p>
          <p>
            UK aesthetics education by Bernadette Tobin RN, MSc.
          </p>
        </div>
      </div>
    </footer>
  );
}
