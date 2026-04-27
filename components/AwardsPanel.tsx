/**
 * AwardsPanel — the Aesthetics Unlocked recognition billboard.
 *
 * Surfaces the 1-2 USP punch:
 *  1. Educator of the Year 2026 Nominee — teaching axis (laurel mark)
 *  2. Best Non-Surgical Aesthetics Clinic 2026 — practice axis (trophy mark)
 *
 * v4 — animated illustrations inserted beside each award per Giles'
 * "add animated illustration" call. The laurel + trophy SVGs draw their
 * paths in on scroll-in, framer-motion pathLength 0 → 1.
 *
 * Bigger gap between awards (py-12 + h-divider) per Giles' "add gap" call.
 *
 * Used in:
 *  - About page (full panel + compact billboard)
 *  - Course detail pages ("Why Bernadette teaches this" section)
 */

"use client";

import { motion } from "framer-motion";
import { AWARDS, VISAGE_ATTRIBUTION } from "@/lib/credentials";
import { PosterBlock } from "./PosterBlock";
import { Eyebrow } from "./Eyebrow";

/* ============================================================
   Animated illustrations — line-based SVGs, paths draw in on
   scroll-in via framer-motion pathLength.
   ============================================================ */

/** Laurel wreath — used for the NOMINEE / Educator award. */
function LaurelMark() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 + i * 0.06 },
        opacity: { duration: 0.4, delay: 0.15 + i * 0.06 },
      },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="w-24 h-24 sm:w-32 sm:h-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Branches */}
      <motion.path
        d="M40 72 C28 64 20 50 18 32 C18 26 20 22 22 18"
        variants={draw}
        custom={0}
      />
      <motion.path
        d="M40 72 C52 64 60 50 62 32 C62 26 60 22 58 18"
        variants={draw}
        custom={1}
      />
      {/* Left leaves */}
      <motion.ellipse
        cx="20" cy="34" rx="3" ry="6" transform="rotate(-30 20 34)"
        variants={draw} custom={2}
      />
      <motion.ellipse
        cx="22" cy="46" rx="3" ry="6" transform="rotate(-45 22 46)"
        variants={draw} custom={3}
      />
      <motion.ellipse
        cx="28" cy="56" rx="3" ry="6" transform="rotate(-55 28 56)"
        variants={draw} custom={4}
      />
      {/* Right leaves */}
      <motion.ellipse
        cx="60" cy="34" rx="3" ry="6" transform="rotate(30 60 34)"
        variants={draw} custom={2}
      />
      <motion.ellipse
        cx="58" cy="46" rx="3" ry="6" transform="rotate(45 58 46)"
        variants={draw} custom={3}
      />
      <motion.ellipse
        cx="52" cy="56" rx="3" ry="6" transform="rotate(55 52 56)"
        variants={draw} custom={4}
      />
      {/* Star centre */}
      <motion.path
        d="M40 26 L41.5 31 L46.5 31 L42.5 34 L44 39 L40 36 L36 39 L37.5 34 L33.5 31 L38.5 31 Z"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "backOut", delay: 0.9 }}
        style={{ originX: "40px", originY: "32.5px" }}
      />
    </motion.svg>
  );
}

/** Trophy — used for the WINNER / Best Clinic award. */
function TrophyMark() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 + i * 0.08 },
        opacity: { duration: 0.4, delay: 0.15 + i * 0.08 },
      },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-24 h-24 sm:w-32 sm:h-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.path
        d="M26 14 L54 14 L52 36 C52 44 46 50 40 50 C34 50 28 44 28 36 Z"
        variants={draw}
        custom={0}
      />
      <motion.path d="M26 18 C18 20 18 32 28 36" variants={draw} custom={1} />
      <motion.path d="M54 18 C62 20 62 32 52 36" variants={draw} custom={1} />
      <motion.line x1="40" y1="50" x2="40" y2="62" variants={draw} custom={2} />
      <motion.line x1="30" y1="62" x2="50" y2="62" variants={draw} custom={3} />
      <motion.line x1="26" y1="68" x2="54" y2="68" variants={draw} custom={4} />
      <motion.path
        d="M40 22 L41.5 27 L46.5 27 L42.5 30 L44 35 L40 32 L36 35 L37.5 30 L33.5 27 L38.5 27 Z"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "backOut", delay: 0.9 }}
        style={{ originX: "40px", originY: "28.5px" }}
      />
    </motion.svg>
  );
}

const AWARD_MARKS: Record<string, React.ReactNode> = {
  "educator-of-the-year-2026": <LaurelMark />,
  "best-non-surgical-clinic-2026": <TrophyMark />,
};

type Props = {
  /** "full" = standalone About-page panel. "compact" = inline billboard. */
  variant?: "full" | "compact";
  /** Tone retained for API compatibility but ignored by compact billboard. */
  tone?: "cream" | "white" | "black" | "pink";
};

export function AwardsPanel({ variant = "full", tone = "cream" }: Props) {
  if (variant === "compact") {
    return (
      <div className="relative isolate overflow-hidden rounded-[5px] bg-au-black text-au-white">
        {/* Soft pink halo top-right — gives the billboard a touch of
            brand colour and lifts it off pure black. */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-32 h-[60vh] w-[60vh] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(230,151,183,0.22), rgba(230,151,183,0) 70%)",
          }}
        />
        {/* Pink top-rule signature mark */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-[3px] w-16"
          style={{ backgroundColor: "var(--color-au-pink)" }}
        />

        <div className="relative z-10 px-7 sm:px-9 py-9 sm:py-11">
          <Eyebrow color="pink" className="mb-7 sm:mb-9">
            Recognised by the industry
          </Eyebrow>

          <ul className="flex flex-col gap-12 sm:gap-14">
            {AWARDS.map((a, i) => (
              <li
                key={a.id}
                className={`grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-start ${
                  i < AWARDS.length - 1
                    ? "pb-12 sm:pb-14 border-b border-au-white/15"
                    : ""
                }`}
              >
                {/* LEFT — year numeral stacked over the animated mark. */}
                <div className="flex flex-col items-start gap-4">
                  <span
                    className="font-display font-black leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {a.year}
                  </span>
                  <div style={{ color: "var(--color-au-pink)" }}>
                    {AWARD_MARKS[a.id]}
                  </div>
                </div>

                {/* RIGHT — status badge, award title, awarding body. */}
                <div>
                  <span
                    className="inline-block font-section font-semibold uppercase tracking-[0.2em] text-[0.6875rem] sm:text-[0.75rem] mb-2.5 px-2 py-1 border"
                    style={{
                      color: "var(--color-au-pink)",
                      borderColor: "var(--color-au-pink)",
                    }}
                  >
                    {a.status}
                  </span>
                  <h3
                    className="font-display font-black leading-[0.95] text-au-white mb-3"
                    style={{
                      fontSize: "clamp(1.375rem, 4.4vw, 2.25rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {a.short}
                  </h3>
                  <p className="text-au-white/70 text-[0.9375rem] leading-snug">
                    {a.awardingBody}
                    {a.business === "Visage Aesthetics" && (
                      <span className="block mt-1.5 italic text-au-white/55 text-[0.8125rem]">
                        Founder, Visage Aesthetics
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <PosterBlock tone={tone} contained>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <Eyebrow>Recognised by the industry</Eyebrow>
          <h2
            className="font-display font-black mt-4 mb-6"
            style={{
              fontSize: "var(--text-section)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            Awards on both sides of the table.
          </h2>
          <p className="text-au-charcoal max-w-md">
            Bernadette teaches at award-nominee level — and practises at
            award-winning level. The work behind every Aesthetics Unlocked
            course is grounded in clinical credibility, academic rigour, and a
            refusal to teach what hasn&rsquo;t been proven in real clinic.
          </p>
        </div>
        <div className="flex flex-col gap-12">
          {AWARDS.map((a) => (
            <article key={a.id} className="border-t border-au-charcoal/15 pt-6">
              <Eyebrow>
                {a.status} · {a.year}
              </Eyebrow>
              <h3
                className="font-display font-bold mt-3 mb-2 leading-tight"
                style={{
                  fontSize: "clamp(1.375rem, 2.6vw, 1.75rem)",
                }}
              >
                {a.short}
              </h3>
              <p className="text-au-charcoal/80 text-[0.9375rem]">
                {a.awardingBody}
              </p>
              {a.business === "Visage Aesthetics" && (
                <p className="mt-3 text-[0.875rem] text-au-mid italic max-w-md">
                  {VISAGE_ATTRIBUTION}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </PosterBlock>
  );
}
