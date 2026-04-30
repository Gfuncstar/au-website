/**
 * DashboardPreview — the editorial preview of the members' portal.
 *
 * Used in two surfaces:
 *   1. Section on the homepage (between courses list + testimonials)
 *   2. Opening of /dashboard, the dedicated marketing page
 *
 * v2 — per Giles' "icons on the right, animated, text on the left,
 * each card in dark mode" call. Cards are now charcoal surfaces with
 * white type; each illustrated icon sits to the right of the title
 * row and *animates* (line-art stroke draw-in) when the card scrolls
 * into the viewport.
 *
 * Voice rules respected:
 *   • "Aesthetics Unlocked" written in full
 *   • Reader-facing copy
 *   • Crisp 5px corners, no rounded-full
 */

"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

type Feature = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const FEATURES: readonly Feature[] = [
  {
    title: "Every course you've enrolled in, on one shelf",
    body: "The free taster you took last summer. The £79 decoder you bought to settle the science. The 12-week programme you're working through this month. All visible the moment you sign in, with the next lesson cued up on each one.",
    icon: <ShelfIcon />,
  },
  {
    title: "Pick up exactly where you left off",
    body: "Aesthetics Unlocked tracks your progress lesson by lesson. The next lesson is one click from the homepage, no remembering which module you were on, no scrolling through a curriculum to find your spot.",
    icon: <ResumeIcon />,
  },
  {
    title: "Anytime. Any device. Lifetime access.",
    body: "Sign in from your laptop in clinic. Finish the lesson on your phone on the train. Your progress is in sync. Once you enrol, you keep the course, including future updates as NICE guidance, regulatory frameworks, and clinical pathways evolve.",
    icon: <DeviceIcon />,
  },
] as const;

export function DashboardPreview() {
  return (
    <div>
      {/* Animated mark, floats top-right of the headline like the
          /courses index hero. Animates draw-in on viewport entry. */}
      <MembersAreaMark className="float-right ml-4 sm:ml-5 -mt-1 w-[88px] h-[88px] sm:w-[120px] sm:h-[120px] md:w-[148px] md:h-[148px]" />
      <ScrollReveal className="max-w-3xl mb-10 sm:mb-12">
        <Eyebrow className="mb-6">Your members&apos; area</Eyebrow>
        <h2
          className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
          style={{
            fontSize: "var(--text-poster)",
            lineHeight: "var(--leading-poster)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Instant access to{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            everything you own.
          </span>
        </h2>
        <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed max-w-2xl">
          When you enrol with Aesthetics Unlocked, every course you&apos;ve
          taken, every lesson, every certificate, every purchase, is in
          one place. Easy to find, easy to pick up, on any device, any
          time.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <h3
          className="font-display font-black text-au-charcoal mb-6 sm:mb-7 leading-[1.1] max-w-3xl"
          style={{
            fontSize: "clamp(1.375rem, 3.6vw, 1.875rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Inside your members&apos; area, you&apos;ll have{" "}
          <span style={{ color: "var(--color-au-pink)" }}>access to:</span>
        </h3>
      </ScrollReveal>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {FEATURES.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 0.08}>
            <li className="bg-au-charcoal text-au-white rounded-[5px] p-6 sm:p-7 h-full flex flex-col">
              {/* Title row, text on the left, animated icon top-right. */}
              <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
                <h3
                  className="font-display font-black leading-[1.1] flex-1 min-w-0"
                  style={{
                    fontSize: "clamp(1.125rem, 2.6vw, 1.375rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                    color: "var(--color-au-pink)",
                  }}
                >
                  {f.title}
                </h3>
                <div className="shrink-0">{f.icon}</div>
              </div>
              <p className="text-[0.9375rem] sm:text-[1rem] text-au-white/75 leading-relaxed">
                {f.body}
              </p>
            </li>
          </ScrollReveal>
        ))}
      </ul>

      <ScrollReveal delay={0.2}>
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2 bg-au-charcoal hover:bg-[var(--color-au-pink)] text-au-white font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 sm:px-7 py-3.5 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors"
          >
            <span>See your members&apos; area</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="text-[0.875rem] text-au-charcoal/65">
            Already enrolled?{" "}
            <Link
              href="/login"
              className="text-[var(--color-au-pink)] hover:text-au-charcoal underline-offset-4 hover:underline transition-colors"
            >
              Sign in
            </Link>
            .
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ============================================================
   Animated line-art icons. Each one self-triggers its draw-in
   animation when the icon scrolls into the viewport, so the
   reveal feels alive — not a static decal pinned to the card.
   ============================================================ */

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.2, delay: 0.2 + i * 0.18 },
    },
  }),
};

const popVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.5 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function MembersAreaMark({ className }: { className?: string }) {
  // Hero mark — a stylised members-area frame with four course tiles.
  // The frame draws in first, then each tile pops in sequence, then
  // the "active" tile fills solid pink — communicating "your dashboard,
  // your courses, the one you're inside right now" at a glance.
  return (
    <motion.svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Members' area"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {/* Outer frame */}
      <motion.rect
        x="6"
        y="10"
        width="88"
        height="80"
        strokeWidth="3.5"
        custom={0}
        variants={drawVariants}
      />
      {/* Top bar (sidebar/topbar suggestion) */}
      <motion.line
        x1="6"
        y1="24"
        x2="94"
        y2="24"
        strokeWidth="3"
        custom={1}
        variants={drawVariants}
      />

      {/* Four course tiles in a 2x2 grid below the bar. */}
      <motion.rect
        x="14"
        y="32"
        width="32"
        height="22"
        strokeWidth="3"
        custom={2}
        variants={drawVariants}
      />
      <motion.rect
        x="54"
        y="32"
        width="32"
        height="22"
        strokeWidth="3"
        custom={3}
        variants={drawVariants}
      />
      <motion.rect
        x="14"
        y="62"
        width="32"
        height="22"
        strokeWidth="3"
        custom={4}
        variants={drawVariants}
      />
      <motion.rect
        x="54"
        y="62"
        width="32"
        height="22"
        strokeWidth="3"
        custom={5}
        variants={drawVariants}
      />

      {/* Active tile, fills solid pink last, the one you're "inside" */}
      <motion.rect
        x="14"
        y="32"
        width="32"
        height="22"
        fill="currentColor"
        stroke="none"
        custom={6}
        variants={popVariants}
      />
    </motion.svg>
  );
}

function ShelfIcon() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Course shelf"
      className="w-12 h-12 sm:w-14 sm:h-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {/* Three "books" on a shelf, draw in left-to-right. */}
      <motion.rect
        x="6"
        y="14"
        width="16"
        height="36"
        custom={0}
        variants={drawVariants}
      />
      <motion.rect
        x="26"
        y="14"
        width="16"
        height="36"
        custom={1}
        variants={drawVariants}
      />
      <motion.rect
        x="46"
        y="14"
        width="12"
        height="36"
        custom={2}
        variants={drawVariants}
      />
      {/* Shelf rule, last to draw, longest sweep. */}
      <motion.line
        x1="6"
        y1="50"
        x2="58"
        y2="50"
        strokeWidth="3.5"
        custom={3}
        variants={drawVariants}
      />
    </motion.svg>
  );
}

function ResumeIcon() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Resume where you left off"
      className="w-12 h-12 sm:w-14 sm:h-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="round"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {/* Outer ring draws first… */}
      <motion.circle cx="32" cy="32" r="24" custom={0} variants={drawVariants} />
      {/* …then the play triangle pops in, filled. */}
      <motion.polygon
        points="26,21 26,43 44,32"
        fill="currentColor"
        stroke="currentColor"
        custom={0}
        variants={popVariants}
      />
    </motion.svg>
  );
}

function DeviceIcon() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Any device, anywhere"
      className="w-12 h-12 sm:w-14 sm:h-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      {/* Laptop body draws in… */}
      <motion.rect
        x="6"
        y="14"
        width="36"
        height="22"
        custom={0}
        variants={drawVariants}
      />
      {/* …then the desk rule sweeps under it… */}
      <motion.line
        x1="2"
        y1="42"
        x2="46"
        y2="42"
        strokeWidth="3.5"
        custom={1}
        variants={drawVariants}
      />
      {/* …finally the phone draws in alongside. */}
      <motion.rect
        x="48"
        y="22"
        width="12"
        height="22"
        rx="1"
        custom={2}
        variants={drawVariants}
      />
      <motion.line
        x1="51"
        y1="40"
        x2="57"
        y2="40"
        custom={3}
        variants={drawVariants}
      />
    </motion.svg>
  );
}
