/**
 * Transformations — "what will change for you" rail.
 *
 * v6 — re-stated again per Giles' "they all flow into each other" call.
 * Each transformation is now its own outlined card with a tinted
 * header band ("Transformation 01", "02"…) so the rhythm of the page
 * reads as: separate moment → separate moment → separate moment, not
 * a continuous waterfall of cards.
 *
 * Inside each card:
 *   • Left half (BEFORE) — muted cream-grey, large red-rose ✗ icon,
 *     struck-through body in dimmed charcoal
 *   • Right half (AFTER) — pink-soft, large pink ✓ icon, bold charcoal
 *     body — the promise
 *
 * Cross-vs-tick is the universal "good / bad" cue, big enough to read
 * at a glance with no copy. Below md the two halves stack vertically
 * with a downward arrow between them.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { CourseTransformation } from "@/lib/courses";

type Props = {
  transformations: readonly CourseTransformation[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const rowVariants: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Transformations({ transformations }: Props) {
  return (
    <motion.ol
      className="flex flex-col gap-8 sm:gap-10 max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {transformations.map((t, i) => (
        <motion.li
          key={i}
          variants={rowVariants}
          className="bg-au-white border border-au-charcoal/12 rounded-[5px] overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        >
          {/* Header band, anchors the whole row to a numbered moment. */}
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3 sm:py-3.5 bg-au-charcoal text-au-white">
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="font-display font-black leading-none text-[var(--color-au-pink)]"
                style={{
                  fontSize: "clamp(1.25rem, 2.6vw, 1.625rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-section font-semibold uppercase tracking-[0.22em] text-[0.625rem] sm:text-[0.6875rem] text-au-white/80">
                Transformation
              </span>
            </div>
            <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.625rem] text-au-white/55 hidden sm:inline">
              Before → After
            </span>
          </div>

          {/* Body, BEFORE | arrow | AFTER. Stacks below md. */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch">
            {/* BEFORE */}
            <div
              className="p-5 sm:p-7 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-au-charcoal/10"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-au-charcoal) 4%, white)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CrossIcon />
                  <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.875rem] sm:text-[1rem] text-au-charcoal/70">
                    Before the course
                  </span>
                </div>
                <BeforeIllustration />
              </div>
              <p
                className="text-au-charcoal/65 leading-relaxed line-through decoration-au-charcoal/25 decoration-1"
                style={{ fontSize: "clamp(0.9375rem, 1.95vw, 1.0625rem)" }}
              >
                {t.before}
              </p>
            </div>

            {/* Arrow column */}
            <div
              aria-hidden="true"
              className="flex items-center justify-center bg-au-white border-b md:border-b-0 md:border-r border-au-charcoal/10 py-2 md:py-0 md:px-3"
            >
              {/* Mobile (vertical) arrow */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
                className="md:hidden w-6 h-6 text-[var(--color-au-pink)]"
              >
                <line x1="12" y1="4" x2="12" y2="20" />
                <polyline points="6 14 12 20 18 14" />
              </svg>
              {/* Desktop (horizontal) arrow */}
              <svg
                viewBox="0 0 32 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="square"
                className="hidden md:block w-8 h-6 text-[var(--color-au-pink)]"
              >
                <line x1="2" y1="12" x2="28" y2="12" />
                <polyline points="22 6 28 12 22 18" />
              </svg>
            </div>

            {/* AFTER */}
            <div
              className="p-5 sm:p-7 flex flex-col gap-4"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--color-au-pink) 12%, white)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TickIcon />
                  <span
                    className="font-section font-semibold uppercase tracking-[0.18em] text-[0.875rem] sm:text-[1rem]"
                    style={{ color: "var(--color-au-pink)" }}
                  >
                    After the course
                  </span>
                </div>
                <AfterIllustration />
              </div>
              <p
                className="text-au-charcoal font-bold leading-snug"
                style={{
                  fontSize: "clamp(1rem, 2.25vw, 1.1875rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {t.after}
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

/* ============================================================
   Cross + tick icons. Sized big enough to read at a glance.
   ============================================================ */

/* ============================================================
   Per-card illustrations.
   BeforeIllustration is a flat, dimmed scribble (chaos/uncertainty
   left behind). AfterIllustration is a rising line + arrowhead that
   *draws itself* in pink as the card enters the viewport — the
   transformation made visible. Both inherit the parent <motion.li>'s
   visibility cascade, so the draw-in is triggered by scroll, not on
   mount.
   ============================================================ */

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
      opacity: { duration: 0.25, delay: 0.25 },
    },
  },
};

function BeforeIllustration() {
  // Declining chart — animated draw-in from top-left to bottom-right
  // in dimmed charcoal. The line itself is the message.
  return (
    <svg
      viewBox="0 0 56 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0 w-14 h-10 sm:w-16 sm:h-11 mt-0.5"
    >
      {/* Faint baseline so the "down" direction has somewhere to land. */}
      <line
        x1="3"
        y1="36"
        x2="53"
        y2="36"
        stroke="rgba(33,33,33,0.18)"
        strokeWidth="1"
      />
      <motion.path
        d="M3 8 L13 14 L23 12 L33 22 L43 28 L53 33"
        stroke="rgba(33,33,33,0.55)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={drawVariants}
      />
      {/* Down-right arrowhead, drawn after the line lands. */}
      <motion.path
        d="M46 30 L53 33 L50 38"
        stroke="rgba(33,33,33,0.55)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial="hidden"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.35,
              delay: 1.15,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      />
    </svg>
  );
}

function AfterIllustration() {
  // Rising chart — animated draw-in from bottom-left to top-right
  // in AU pink. Mirror of the Before path, opposite direction.
  return (
    <svg
      viewBox="0 0 56 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0 w-14 h-10 sm:w-16 sm:h-11 mt-0.5"
    >
      {/* Faint baseline for grounding. */}
      <line
        x1="3"
        y1="36"
        x2="53"
        y2="36"
        stroke="rgba(231, 90, 124, 0.25)"
        strokeWidth="1"
      />
      <motion.path
        d="M3 32 L13 26 L23 28 L33 18 L43 14 L53 6"
        stroke="var(--color-au-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={drawVariants}
      />
      {/* Up-right arrowhead, drawn after the line peaks. */}
      <motion.path
        d="M50 1 L53 6 L46 9"
        stroke="var(--color-au-pink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial="hidden"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.35,
              delay: 1.15,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-[5px] border border-au-charcoal/25"
      style={{
        backgroundColor:
          "color-mix(in oklab, var(--color-au-charcoal) 8%, white)",
        color: "var(--color-au-charcoal)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        className="w-5 h-5 sm:w-5.5 sm:h-5.5 opacity-65"
      >
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </span>
  );
}

function TickIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-[5px]"
      style={{
        backgroundColor: "var(--color-au-pink)",
        color: "white",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="square"
        strokeLinejoin="round"
        className="w-5 h-5 sm:w-5.5 sm:h-5.5"
      >
        <polyline points="5 12 10 17 19 7" />
      </svg>
    </span>
  );
}
