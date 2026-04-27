/**
 * Transformations — "what will change for you" rail.
 *
 * v4 — refined per Giles' "still looks crude — look at website for
 * alternative design" feedback. Out: chip badges, charcoal/pink card
 * blocks, decorative arrows. In: a numbered editorial setlist where
 * each transformation reads like a single diary entry — strike-through
 * "what stops" above bold pink "what starts", separated by a thin pink
 * rule. Minimal, typographic, on-brand.
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
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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
      className="flex flex-col max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {transformations.map((t, i) => (
        <motion.li
          key={i}
          variants={rowVariants}
          className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-9 py-7 sm:py-9 border-t border-au-charcoal/15 first:border-t-0"
        >
          {/* Numeric counter — pink display number, gig-poster signature. */}
          <span
            aria-hidden="true"
            className="font-display font-black leading-none pt-1"
            style={{
              fontSize: "clamp(1.5rem, 3.6vw, 2.25rem)",
              color: "var(--color-au-pink)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Right column — strike-through Before above bold After. */}
          <div className="flex flex-col gap-3">
            {/* Before — small label, struck-through body. */}
            <div>
              <span className="block font-section font-semibold uppercase tracking-[0.22em] text-[0.625rem] sm:text-[0.6875rem] text-au-charcoal/45 mb-1.5">
                You stop
              </span>
              <p
                className="text-au-charcoal/55 leading-relaxed line-through decoration-au-charcoal/30 decoration-1"
                style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)" }}
              >
                {t.before}
              </p>
            </div>

            {/* Thin pink rule — quiet signal between states. */}
            <span
              aria-hidden="true"
              className="block h-[1.5px] w-12"
              style={{ backgroundColor: "var(--color-au-pink)" }}
            />

            {/* After — pink label, bold body. The promise. */}
            <div>
              <span
                className="block font-section font-semibold uppercase tracking-[0.22em] text-[0.625rem] sm:text-[0.6875rem] mb-1.5"
                style={{ color: "var(--color-au-pink)" }}
              >
                You start
              </span>
              <p
                className="text-au-charcoal font-bold leading-relaxed"
                style={{
                  fontSize: "clamp(1.0625rem, 2.4vw, 1.25rem)",
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
