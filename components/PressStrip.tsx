/**
 * PressStrip — credibility band sat below the hero.
 *
 * v2 — refined per Giles' "this needs to look better" call. The previous
 * row-with-wrapping layout looked crude. This version uses a clean
 * 2x2 (mobile) / 4-column (desktop) grid with consistent type scale,
 * vertical pink dividers between items, and uniform spacing. Reads as
 * an editorial press strip rather than a list.
 *
 * Each credential is verifiable on the public record: Cosmopolitan
 * editorial mention + NMC statutory registration + RCN membership +
 * MSc Advanced Practice (Level 7).
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { Eyebrow } from "./Eyebrow";
import { FOUNDER } from "@/lib/credentials";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type Mark = {
  abbrev: string;
  label: string;
};

const MARKS: readonly Mark[] = [
  { abbrev: "Cosmo", label: "As featured" },
  { abbrev: "NMC", label: `Pin ${FOUNDER.nmcPin}` },
  { abbrev: "RCN", label: "Registered member" },
  { abbrev: "MSc", label: "Advanced Practice (L7)" },
];

export function PressStrip() {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 sm:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={itemVariants}>
        <Eyebrow className="text-center">
          Trusted, registered, on the public record
        </Eyebrow>
      </motion.div>

      {/* Tightened per Giles' "smaller" call, single horizontal row on
          tablet+, 2x2 on mobile, with reduced padding and smaller marks. */}
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl border-y border-au-charcoal/15 divide-x divide-au-charcoal/15"
        variants={containerVariants}
      >
        {MARKS.map((m) => (
          <motion.li
            key={m.abbrev}
            variants={itemVariants}
            className="flex flex-col items-center justify-center text-center py-3.5 sm:py-4 px-3 first:border-l-0 sm:[&:nth-child(3)]:border-l"
          >
            <span
              className="font-display font-black leading-none mb-1.5"
              style={{
                fontSize: "clamp(1rem, 2.6vw, 1.375rem)",
                color: "var(--color-au-pink)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              {m.abbrev}
            </span>
            <span className="font-section font-semibold uppercase tracking-[0.16em] text-[0.5625rem] sm:text-[0.625rem] text-au-charcoal/55 leading-snug">
              {m.label}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
