/**
 * CourseCard — image-backed editorial card.
 *
 * v5 — bgImage is now the visible dominant layer per Giles' "all cards
 * must use the background images" call. The pink/black/etc tone becomes
 * a colour wash on top of the texture, not the backdrop. Result: every
 * card reads as a printed poster with its own backdrop, not a flat tone.
 *
 * Used on /courses index. Homepage now uses the compact CourseListCompact
 * row pattern instead — the big card grid is reserved for the marketing
 * surface where depth belongs.
 */

import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";

type Tone = "black" | "charcoal" | "pink" | "pink-soft" | "cream";

type Props = {
  /** AU palette tone — drives the colour wash sat on top of the bgImage. */
  tone: Tone;
  /** Short eyebrow above the title — e.g. "Free · 3 days". */
  eyebrow: string;
  /** Course title — TM marks preserved. Renders as the BIG poster headline. */
  title: string;
  /** Key learning bullets — render as a gig-poster track listing. */
  bullets: readonly string[];
  /** Stat rail — small fact strings alongside the title. */
  stats?: readonly string[];
  /** SVG visual mark — top-right of the card. */
  mark?: ReactNode;
  /**
   * /public path to the dominant background image (e.g.
   * "/backgrounds/pink-grunge-deep.png"). Required-by-design — every
   * card on the marketing site should carry one.
   */
  bgImage?: string;
  href: string;
  ctaText: string;
  /** Optional GBP price for the CTA — passes through to AU Button. */
  price?: number | string;
  /** Time commitment as a short reader-facing string, e.g.
   *  "≈ 1 hr / week × 5 weeks". Surfaced as a small strip near the
   *  bottom of the card so visitors can plan around their week. */
  weeklyHours?: string;
  /** True when the course is structured for CPD evidence + NMC
   *  revalidation. Renders as a small pink "CPD ✓" chip beside the
   *  weekly-hours line. */
  isCpdEvidence?: boolean;
};

/* ============================================================
   Tone tokens — colour wash strength + content / CTA colours.
   ============================================================ */

type ToneSet = {
  /** Tint sat over the bgImage. rgba — alpha tunes how much the image
   *  shows through; deeper tones (black/charcoal) get a stronger wash
   *  to keep light text readable. */
  wash: string;
  bodyText: string;
  bodyMuted: string;
  eyebrowColor: "pink" | "black" | "white";
  markColor: string;
  ruleColor: string;

  ctaBg: string;
  ctaButtonVariant: "pink" | "black" | "glass";
};

const tones: Record<Tone, ToneSet> = {
  black: {
    wash: "rgba(0, 0, 0, 0.78)",
    bodyText: "text-au-white",
    bodyMuted: "text-au-white/70",
    eyebrowColor: "pink",
    markColor: "var(--color-au-pink)",
    ruleColor: "var(--color-au-pink)",
    ctaBg: "bg-[var(--color-au-pink)]",
    ctaButtonVariant: "black",
  },
  charcoal: {
    wash: "rgba(33, 33, 33, 0.75)",
    bodyText: "text-au-white",
    bodyMuted: "text-au-white/70",
    eyebrowColor: "pink",
    markColor: "var(--color-au-pink)",
    ruleColor: "var(--color-au-pink)",
    ctaBg: "bg-[var(--color-au-pink)]",
    ctaButtonVariant: "black",
  },
  pink: {
    wash: "rgba(230, 151, 183, 0.6)",
    bodyText: "text-au-black",
    bodyMuted: "text-au-black/70",
    eyebrowColor: "black",
    markColor: "var(--color-au-black)",
    ruleColor: "var(--color-au-black)",
    ctaBg: "bg-au-black",
    ctaButtonVariant: "pink",
  },
  "pink-soft": {
    wash: "rgba(243, 201, 216, 0.55)",
    bodyText: "text-au-black",
    bodyMuted: "text-au-black/70",
    eyebrowColor: "black",
    markColor: "var(--color-au-black)",
    ruleColor: "var(--color-au-black)",
    ctaBg: "bg-au-black",
    ctaButtonVariant: "pink",
  },
  cream: {
    wash: "rgba(250, 246, 241, 0.55)",
    bodyText: "text-au-charcoal",
    bodyMuted: "text-au-charcoal/65",
    eyebrowColor: "pink",
    markColor: "var(--color-au-pink)",
    ruleColor: "var(--color-au-pink)",
    ctaBg: "bg-[var(--color-au-pink)]",
    ctaButtonVariant: "black",
  },
};

export function CourseCard({
  tone,
  eyebrow,
  title,
  bullets,
  stats = [],
  mark,
  bgImage,
  href,
  ctaText,
  price,
  weeklyHours,
  isCpdEvidence,
}: Props) {
  const t = tones[tone];

  return (
    <article className="group relative isolate overflow-hidden rounded-[5px] flex flex-col h-full">
      {/* ============================================================
          MAIN BODY, bgImage as the dominant backdrop with a tone wash.
          ============================================================ */}
      <div className="relative flex-1">
        {/* Layer 1, bgImage (full opacity, fills the body). */}
        {bgImage && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
        )}
        {/* Layer 2, tone wash. Gives every card its brand identity while
            letting the texture read clearly through it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: t.wash }}
        />

        {/* Top accent rule, widens on hover. */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[3px] w-12 sm:w-16 transition-all duration-500 group-hover:w-24"
          style={{ backgroundColor: t.ruleColor }}
        />

        <div
          className={`relative z-10 h-full flex flex-col p-5 sm:p-6 ${t.bodyText}`}
        >
          {/* Eyebrow + mark row */}
          <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
            <Eyebrow color={t.eyebrowColor}>{eyebrow}</Eyebrow>
            {mark && (
              <div
                className="shrink-0 transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ color: t.markColor }}
              >
                {mark}
              </div>
            )}
          </div>

          {/* BIG title + stats */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 mb-5 sm:mb-6">
            <h3
              className="font-display font-black uppercase leading-[0.88] flex-1"
              style={{
                fontSize: "clamp(2rem, 8.5vw, 3.25rem)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {title}
            </h3>
            {stats.length > 0 && (
              <ul className={`flex flex-col gap-0.5 ${t.bodyMuted} text-[0.8125rem] sm:text-[0.875rem] leading-snug sm:text-right shrink-0`}>
                {stats.map((s) => (
                  <li key={s}>{s}.</li>
                ))}
              </ul>
            )}
          </div>

          {/* Bullet setlist */}
          {bullets.length > 0 && (
            <ul
              className={`mt-auto flex flex-col gap-2 font-section font-semibold uppercase text-[0.6875rem] sm:text-[0.75rem] tracking-[0.18em] ${t.bodyMuted}`}
              aria-label="What you'll learn"
            >
              {bullets.map((b) => (
                <li key={b} className="flex items-baseline gap-2.5">
                  <span aria-hidden="true">+</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Footer strip, weekly hours + CPD chip. Renders only when
              the course has set the data. Sits above the CTA strip so
              practitioners see the time commitment + CPD eligibility
              without having to open the detail page. */}
          {(weeklyHours || isCpdEvidence) && (
            <div
              className={`mt-5 sm:mt-6 pt-4 border-t flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.75rem] sm:text-[0.8125rem] ${t.bodyMuted}`}
              style={{ borderColor: "currentColor", borderTopWidth: "1px", opacity: 0.9 }}
            >
              {weeklyHours && (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 14" />
                  </svg>
                  {weeklyHours}
                </span>
              )}
              {isCpdEvidence && (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] font-section font-semibold uppercase tracking-[0.14em] text-[0.625rem] sm:text-[0.6875rem]"
                  style={{
                    backgroundColor: "var(--color-au-pink)",
                    color: "var(--color-au-white)",
                  }}
                >
                  <span aria-hidden="true">✓</span> CPD evidence
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          CTA STRIP, contrasting tone, full width.
          ============================================================ */}
      <div className={`relative ${t.ctaBg}`}>
        <div className="relative z-10 p-4 sm:p-5 flex">
          <Button
            href={href}
            variant={t.ctaButtonVariant}
            size="sm"
            price={price}
            className="w-full justify-between"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </article>
  );
}
