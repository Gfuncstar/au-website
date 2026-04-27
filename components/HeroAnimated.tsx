/**
 * HeroAnimated — homepage hero, v3.
 *
 * Pivot: Bernadette scroll sequence is out (Giles' call — "doesn't work").
 * What's in: a pure-typographic editorial poster hero — closer to the
 * Tour de Phil 2026 / Just Phil inspiration board. Dark mode, oversized
 * Montserrat black, pink word accents, framer-motion staggered cascade
 * on entry, glass CTAs. No photographic content.
 *
 * Editorial details:
 *   - Subtle crumpled-paper grain layered at low opacity over pure black —
 *     gives the surface a printed-poster feel without competing with the type.
 *   - A vertical credentials rail sits flush to the right edge on tablet+
 *     ("BERNADETTE TOBIN · RN MSC") — gig-poster signature mark, never the
 *     focal point but always there.
 *   - A pink rule + eyebrow tops the headline — same poster moment as the
 *     awards block beneath it, so the two read as one continuous cover.
 *   - Bottom-anchored type on mobile so the CTAs sit comfortably above the
 *     thumb on a phone.
 *
 * Server-component-friendly: this file is `"use client"` because framer-motion
 * runs in the browser. `app/page.tsx` stays a Server Component (keeps metadata
 * + JSON-LD output); it just mounts <HeroAnimated /> as a child.
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/Button";

/* ============================================================
   Small animated award icons for the hero awards rail.
   Pink, line-based, draw their paths in on mount.
   ============================================================ */

const drawIcon: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 1.0 + i * 0.05 },
      opacity: { duration: 0.3, delay: 1.0 + i * 0.05 },
    },
  }),
};

function HeroLaurelIcon() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="w-5 h-5 sm:w-[1.375rem] sm:h-[1.375rem] shrink-0"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      animate="visible"
    >
      <motion.path d="M12 21 C7 18 4 13 4 8" variants={drawIcon} custom={0} />
      <motion.path d="M12 21 C17 18 20 13 20 8" variants={drawIcon} custom={0} />
      <motion.path d="M5 11 L7 9" variants={drawIcon} custom={1} />
      <motion.path d="M6 14 L8 12" variants={drawIcon} custom={2} />
      <motion.path d="M19 11 L17 9" variants={drawIcon} custom={1} />
      <motion.path d="M18 14 L16 12" variants={drawIcon} custom={2} />
      <motion.circle cx="12" cy="11" r="2" fill="currentColor" stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 1.5 }}
        style={{ originX: "12px", originY: "11px" }}
      />
    </motion.svg>
  );
}

function HeroTrophyIcon() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5 sm:w-[1.375rem] sm:h-[1.375rem] shrink-0"
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      animate="visible"
    >
      <motion.path d="M8 4 L16 4 L15.5 11 C15.5 13.5 14 15 12 15 C10 15 8.5 13.5 8.5 11 Z"
        variants={drawIcon} custom={0} />
      <motion.path d="M8 5 C5.5 6 5.5 9.5 8.5 11" variants={drawIcon} custom={1} />
      <motion.path d="M16 5 C18.5 6 18.5 9.5 15.5 11" variants={drawIcon} custom={1} />
      <motion.line x1="12" y1="15" x2="12" y2="19" variants={drawIcon} custom={2} />
      <motion.line x1="9" y1="20" x2="15" y2="20" variants={drawIcon} custom={3} />
    </motion.svg>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1], // expo-out — confident, editorial
    },
  },
};

export function HeroAnimated() {
  return (
    <section className="relative bg-au-black text-au-white h-screen-safe overflow-hidden">
      {/* 1. Bernadette background video — loops silently, plays inline on
             mobile (required for iOS autoplay), poster frame shown until the
             video buffers. NOTE: source is currently 480x640 (low-res sample
             from clone-aesthetics-unlocked/VIDEO/). Drop a true 1080p+ source
             at /public/video/bernadette-hero.mp4 to upgrade. */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/bernadette-hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/video/bernadette-hero.mp4" type="video/mp4" />
      </video>

      {/* 2. Readability gradient — black up from the bottom so the type
             below stays legible over any frame of the video. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[80%] sm:h-[70%] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.82) 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* 3. Top vignette — small black-to-transparent fade so the Nav
             logo + hamburger always have contrast no matter the video frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[20%] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* 2. Type — the poster itself. Bottom-anchored on mobile,
             centred-bottom on desktop. (Pink halo removed per Giles'
             "remove line" call — it was bleeding into the top-right
             corner near the nav.) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // pb history:
        //   - +100px per "PADDING MOVE TEXT UP 100 PIX" call.
        //   - −40px per "move down 40px" call (justify-end flex, so smaller
        //     pb shifts the type block downwards toward the bottom edge).
        className="relative z-20 h-full flex flex-col justify-end px-[35px] sm:px-10 md:px-14 pb-[40px] sm:pb-[80px] md:pb-[100px]"
      >
        <div className="md:max-w-3xl">
          {/* Awards rail — leads the hero. "Strategic Education" eyebrow
              was removed per Giles' "remove" call; the two award lines now
              sit at the top on their own. */}
          <motion.ul
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 font-section font-semibold uppercase text-[0.6875rem] sm:text-[0.75rem] tracking-[0.22em] text-au-white/85"
            aria-label="Awards"
          >
            <li className="flex items-center gap-2">
              <HeroLaurelIcon />
              <span>Educator of the Year 2026 · Nominee</span>
            </li>
            <li className="flex items-center gap-2">
              <HeroTrophyIcon />
              <span>Best Non-Surgical Clinic 2026 · Essex</span>
            </li>
          </motion.ul>

          {/* Headline — line-by-line cascade */}
          <h1
            className="mt-7 sm:mt-9 font-display font-black text-au-white"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--leading-display)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            <motion.span variants={itemVariants} className="block">
              Strategy
            </motion.span>
            <motion.span
              variants={itemVariants}
              className="block"
              style={{ color: "var(--color-au-pink)" }}
            >
              injected.
            </motion.span>
            <motion.span variants={itemVariants} className="block">
              Aesthetics
            </motion.span>
            <motion.span
              variants={itemVariants}
              className="block"
              style={{ color: "var(--color-au-pink)" }}
            >
              unlocked.
            </motion.span>
          </h1>

          {/* Hero description — Giles-supplied copy. Positions AU directly
              as the platform, naming the audience (practitioners + clinic
              owners) and the promise (clarity, structure, confidence). */}
          <motion.p
            variants={itemVariants}
            className="mt-7 sm:mt-9 max-w-xl text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-white/85 leading-relaxed"
          >
            An education platform built to help{" "}
            <span style={{ color: "var(--color-au-pink)" }}>
              aesthetic practitioners and clinic owners
            </span>{" "}
            scale with{" "}
            <span style={{ color: "var(--color-au-pink)" }}>
              clarity, structure, and confidence
            </span>
            .
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
          >
            {/* Primary — solid AU pink. Conversion CTA per AU brand rule.
                Size dropped to `sm` per Giles' "reduce by 50%" call —
                the hero CTAs are now ~half the previous footprint. */}
            <Button href="/courses" variant="pink" size="sm">
              Browse the courses
            </Button>
            {/* Secondary — glass / nurture CTA. */}
            <Button href="/about" variant="glass" size="sm">
              Why Bernadette
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
