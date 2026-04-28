/**
 * SectionMarks — small animated SVG illustrations sat at the top-right
 * of major homepage / about-page sections.
 *
 * Built per Giles' "we have lots of space at the top of sections, please
 * populate with animated illustration" call. Same line-based gig-poster
 * aesthetic as the laurel + trophy + course marks.
 *
 * Each component:
 *   - Uses `currentColor` so it tints with parent text colour
 *   - Animates its paths in on scroll (framer-motion pathLength)
 *   - Is sized for the corner of a poster section (sm 80px / md 112px)
 *
 * Usage:
 *   <PulseMark className="absolute top-6 right-[35px] sm:top-10 sm:right-10" />
 */

"use client";

import { motion, type Variants } from "framer-motion";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, ease: "easeOut", delay: 0.1 + i * 0.08 },
      opacity: { duration: 0.4, delay: 0.1 + i * 0.08 },
    },
  }),
};

const baseClass =
  "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 pointer-events-none";

/** Pulse line + heartbeat — for the Meet Bernadette / clinical sections. */
export function PulseMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${baseClass} ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.path
        d="M6 40 L22 40 L28 24 L36 56 L44 32 L52 48 L58 40 L74 40"
        variants={draw}
        custom={0}
      />
      <motion.path
        d="M40 16 C40 12 36 10 33 12 C30 10 26 12 26 16 C26 20 30 24 33 28 C36 24 40 20 40 16 Z"
        variants={draw}
        custom={1}
        style={{ opacity: 0.55 }}
      />
    </motion.svg>
  );
}

/** Lightbulb + rays — for the How AU teaches / educational sections. */
export function LightbulbMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${baseClass} ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Bulb */}
      <motion.path
        d="M40 18 C30 18 24 26 24 34 C24 40 28 44 32 48 L32 54 L48 54 L48 48 C52 44 56 40 56 34 C56 26 50 18 40 18 Z"
        variants={draw}
        custom={0}
      />
      {/* Filament */}
      <motion.path d="M34 38 L40 32 L46 38" variants={draw} custom={1} />
      {/* Cap */}
      <motion.line x1="32" y1="58" x2="48" y2="58" variants={draw} custom={2} />
      <motion.line x1="34" y1="62" x2="46" y2="62" variants={draw} custom={2} />
      <motion.line x1="36" y1="66" x2="44" y2="66" variants={draw} custom={2} />
      {/* Rays */}
      <motion.line x1="40" y1="6" x2="40" y2="12" variants={draw} custom={3} />
      <motion.line x1="14" y1="14" x2="18" y2="18" variants={draw} custom={3} />
      <motion.line x1="66" y1="14" x2="62" y2="18" variants={draw} custom={3} />
      <motion.line x1="6" y1="36" x2="12" y2="36" variants={draw} custom={4} />
      <motion.line x1="74" y1="36" x2="68" y2="36" variants={draw} custom={4} />
    </motion.svg>
  );
}

/** Three pillars rising from a base line — for The Framework section. */
export function PillarsMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="square"
      aria-hidden="true"
      className={`${baseClass} ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Base */}
      <motion.line x1="6" y1="68" x2="74" y2="68" variants={draw} custom={0} />
      {/* Three pillars */}
      <motion.rect
        x="14" y="28" width="12" height="40"
        variants={draw} custom={1}
      />
      <motion.rect
        x="34" y="20" width="12" height="48"
        variants={draw} custom={2}
      />
      <motion.rect
        x="54" y="36" width="12" height="32"
        variants={draw} custom={3}
      />
      {/* Caps on pillars */}
      <motion.line x1="12" y1="28" x2="28" y2="28" variants={draw} custom={4} />
      <motion.line x1="32" y1="20" x2="48" y2="20" variants={draw} custom={4} />
      <motion.line x1="52" y1="36" x2="68" y2="36" variants={draw} custom={4} />
      {/* Top star centre on tallest pillar */}
      <motion.path
        d="M40 12 L41 15 L44 15 L41.5 17 L42.5 20 L40 18 L37.5 20 L38.5 17 L36 15 L39 15 Z"
        fill="currentColor"
        stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "backOut", delay: 0.85 }}
        style={{ originX: "40px", originY: "16px" }}
      />
    </motion.svg>
  );
}

/** Compass rose — for the "starting point" courses section. */
export function CompassMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${baseClass} ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.circle cx="40" cy="40" r="32" variants={draw} custom={0} />
      <motion.circle cx="40" cy="40" r="22" variants={draw} custom={1} />
      <motion.path
        d="M40 18 L46 40 L40 62 L34 40 Z"
        variants={draw}
        custom={2}
      />
      <motion.path
        d="M18 40 L40 34 L62 40 L40 46 Z"
        variants={draw}
        custom={3}
        style={{ opacity: 0.45 }}
      />
      <motion.circle
        cx="40" cy="40" r="2"
        fill="currentColor" stroke="none"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "backOut", delay: 0.9 }}
        style={{ originX: "40px", originY: "40px" }}
      />
    </motion.svg>
  );
}

/** Open book + page marker — for the book / authority sections. */
export function BookMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${baseClass} ${className}`}
      style={{ color: "var(--color-au-pink)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {/* Spine + pages */}
      <motion.path d="M40 22 L40 64" variants={draw} custom={0} />
      <motion.path
        d="M40 22 C32 18 18 18 10 22 L10 60 C18 56 32 56 40 60"
        variants={draw}
        custom={1}
      />
      <motion.path
        d="M40 22 C48 18 62 18 70 22 L70 60 C62 56 48 56 40 60"
        variants={draw}
        custom={1}
      />
      {/* Lines on left page */}
      <motion.line x1="16" y1="32" x2="34" y2="30" variants={draw} custom={2} />
      <motion.line x1="16" y1="40" x2="34" y2="38" variants={draw} custom={3} />
      <motion.line x1="16" y1="48" x2="30" y2="46" variants={draw} custom={4} />
      {/* Lines on right page */}
      <motion.line x1="46" y1="30" x2="64" y2="32" variants={draw} custom={2} />
      <motion.line x1="46" y1="38" x2="64" y2="40" variants={draw} custom={3} />
      <motion.line x1="50" y1="46" x2="64" y2="48" variants={draw} custom={4} />
    </motion.svg>
  );
}
