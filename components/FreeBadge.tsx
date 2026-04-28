/**
 * FreeBadge — solid pink "ink stamp" with reversed-out white "FREE"
 * wordmark used wherever a free course tile renders.
 *
 * Visual:
 *   - Solid pink circle (the ink)
 *   - White hairline ring + four cardinal dots inside (reversed-out
 *     decoration that reads as a stamp/seal)
 *   - "FREE" wordmark in white Montserrat Black 900, slightly rotated
 *     like a real ink stamp
 *   - Pop-in + slight rotation animation on viewport entry
 *
 * Always rendered in its own dedicated zone — never positioned over
 * card body text. Per Giles' direction: "Never over the text and
 * always reversed out. In ink with white writing."
 */

"use client";

import { motion, type Variants } from "framer-motion";

const stampPop: Variants = {
  hidden: { scale: 0, rotate: 12, opacity: 0 },
  visible: {
    scale: 1,
    rotate: -8,
    opacity: 1,
    transition: {
      duration: 0.55,
      delay: 0.1,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  },
};

const ringDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      opacity: { duration: 0.3, delay: 0.35 },
    },
  },
};

const dotPop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.55 + i * 0.05,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

const wordmarkPop: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      delay: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  },
};

export function FreeBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative inline-flex shrink-0 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={stampPop}
      role="img"
      aria-label="Free course"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Solid pink ink */}
        <circle cx="50" cy="50" r="46" fill="var(--color-au-pink)" />
        {/* White hairline inner ring — decorative */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={ringDraw}
        />
        {/* White cardinal dots */}
        <motion.circle cx="50" cy="14" r="2" fill="#ffffff" custom={0} variants={dotPop} />
        <motion.circle cx="86" cy="50" r="2" fill="#ffffff" custom={1} variants={dotPop} />
        <motion.circle cx="50" cy="86" r="2" fill="#ffffff" custom={2} variants={dotPop} />
        <motion.circle cx="14" cy="50" r="2" fill="#ffffff" custom={3} variants={dotPop} />
      </svg>
      <motion.span
        variants={wordmarkPop}
        className="absolute inset-0 flex items-center justify-center font-display font-black text-au-white leading-none tracking-tight"
        style={{
          fontSize: "clamp(0.875rem, 5cqw, 1.375rem)",
          containerType: "inline-size",
          textShadow: "0 1px 0 rgba(0,0,0,0.06)",
        }}
      >
        FREE
      </motion.span>
    </motion.div>
  );
}
