/**
 * ThreePillars — homepage "Three pillars. One framework that holds up." block.
 *
 * Was inline JSX in app/page.tsx; lifted out into a client component so it can
 * carry framer-motion animations per Giles' "add element and animation" call.
 *
 * Each pillar gets:
 *   - A custom AU-pink line-mark SVG (geometric, gig-poster style — not a
 *     stock icon set). Animates its stroke draw on scroll-in.
 *   - A pink rule that grows 0 → 64px to the left of the number when the
 *     pillar enters the viewport.
 *   - A staggered fade + slide-up on the card itself.
 *   - A subtle hover lift on desktop (translate-y-1).
 *
 * Brand language preserved — same Montserrat hierarchy, same AU pink accent,
 * same body voice. Animations are once-only (`viewport={{ once: true }}`) so
 * they don't replay on every scroll.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Pillar = {
  num: string;
  title: string;
  body: string;
  /** SVG mark — receives the stroke colour as currentColor. */
  mark: ReactNode;
};

/* ============================================================
   Pillar marks — custom line SVGs, gig-poster geometric style.
   ============================================================ */

/** 01 — Concentric squares: focus, identity, narrowing in on a niche. */
const ClinicalIdentityMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="square"
    aria-hidden="true"
    className="w-12 h-12 sm:w-14 sm:h-14"
  >
    <motion.rect
      x="4"
      y="4"
      width="56"
      height="56"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
    />
    <motion.rect
      x="16"
      y="16"
      width="32"
      height="32"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
    />
    <motion.circle
      cx="32"
      cy="32"
      r="3"
      fill="currentColor"
      stroke="none"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "backOut", delay: 0.7 }}
    />
  </svg>
);

/** 02 — Shield outline: protection, safety, regulatory boundary. */
const RegulatorySafetyMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    className="w-12 h-12 sm:w-14 sm:h-14"
  >
    <motion.path
      d="M32 6 L56 16 L56 32 C56 46 44 56 32 60 C20 56 8 46 8 32 L8 16 Z"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
    />
    <motion.path
      d="M22 32 L29 39 L43 25"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
    />
  </svg>
);

/** 03 — Three ascending bars: growth, profit, compounding systems. */
const ProfitSystemsMark = (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="square"
    aria-hidden="true"
    className="w-12 h-12 sm:w-14 sm:h-14"
  >
    <motion.line
      x1="6"
      y1="58"
      x2="58"
      y2="58"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    />
    {[
      { x: 12, h: 16, delay: 0.3 },
      { x: 28, h: 28, delay: 0.45 },
      { x: 44, h: 42, delay: 0.6 },
    ].map((bar) => (
      <motion.rect
        key={bar.x}
        x={bar.x}
        width="8"
        fill="currentColor"
        stroke="none"
        initial={{ height: 0, y: 56, opacity: 0 }}
        whileInView={{
          height: bar.h,
          y: 56 - bar.h,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut", delay: bar.delay }}
      />
    ))}
  </svg>
);

/* ============================================================
   Pillar data
   ============================================================ */

const PILLARS: Pillar[] = [
  {
    num: "01",
    title: "Clinical identity",
    body:
      "The niche where your expertise, your interest, and the economics line up. Messaging that turns “another injector” into “the practitioner I trust.”",
    mark: ClinicalIdentityMark,
  },
  {
    num: "02",
    title: "Regulatory safety",
    body:
      "Scope of practice, risk-gap auditing, premises, documentation, marketing claims you can defend. The Traffic Light System turned into your decision-making muscle.",
    mark: RegulatorySafetyMark,
  },
  {
    num: "03",
    title: "Profit & systems",
    body:
      "Signature offers, confident pricing, the services you keep and the ones you cut. The way money actually moves through a clinic.",
    mark: ProfitSystemsMark,
  },
];

/* ============================================================
   Card-level entry animation
   ============================================================ */

const cardVariants: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.12,
    },
  }),
};

export function ThreePillars() {
  return (
    <div className="grid md:grid-cols-3 gap-12 md:gap-16">
      {PILLARS.map((p, i) => (
        <motion.article
          key={p.num}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="group transition-transform duration-500 ease-out hover:-translate-y-1"
        >
          {/* Top row, pink rule + number on the left, SVG mark on the
              right. Per Giles' "all icons in this position on all" call,
              the marks now anchor the top-right of each pillar (was at
              the foot beneath the body copy). */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <motion.span
                aria-hidden="true"
                className="block h-px"
                style={{ backgroundColor: "var(--color-au-pink)" }}
                initial={{ width: 0 }}
                whileInView={{ width: "4rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              />
              <span
                className="font-display font-black"
                style={{
                  fontSize: "1.75rem",
                  color: "var(--color-au-pink)",
                }}
              >
                {p.num}
              </span>
            </div>

            <div
              className="shrink-0 transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ color: "var(--color-au-pink)" }}
            >
              {p.mark}
            </div>
          </div>

          <h3 className="font-display font-bold text-au-white text-[1.5rem] mb-4">
            {p.title}
          </h3>
          <p className="text-au-white/75 leading-relaxed">{p.body}</p>
        </motion.article>
      ))}
    </div>
  );
}
