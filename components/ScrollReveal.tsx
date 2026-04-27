/**
 * ScrollReveal — site-wide scroll-triggered fade + slide-up entry.
 *
 * Per Giles' "add scroll reveal on scroll like the hero section site wide"
 * call. Uses the same easing curve and duration as the hero cascade in
 * `HeroAnimated.tsx` so the whole page reads as one motion language:
 *
 *   - y: 32 → 0
 *   - opacity: 0 → 1
 *   - duration 0.75s
 *   - ease [0.22, 1, 0.36, 1] (expo-out — confident, editorial)
 *
 * Animations fire once when the wrapped content enters the viewport (via
 * framer-motion's `whileInView` + `viewport={{ once: true }}`), so they
 * never replay on subsequent scrolls. Sections that already manage their
 * own scroll animation (the hero, ThreePillars, ScrollImageSequence, etc.)
 * are NOT wrapped in this — that would double-animate.
 *
 * Usage:
 *   <ScrollReveal>...content...</ScrollReveal>
 *   <ScrollReveal delay={0.15}>...staggered child...</ScrollReveal>
 *   <ScrollReveal as="li" className="...">...</ScrollReveal>
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional delay in seconds. Useful for sequencing siblings. */
  delay?: number;
  /**
   * The amount of vertical travel on entry (px). Defaults to 32 to match
   * the hero. Drop to ~16 for short / inline elements.
   */
  distance?: number;
  /** Tag override (default: "div"). */
  as?: ElementType;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 32,
  as = "div",
}: Props) {
  // Resolve the `as` prop to the corresponding motion component.
  // `motion.create()` is the modern API but `motion[tag]` still works for
  // built-in HTML tags, which is all we need here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (motion as any)[as as string] ?? motion.div;

  const variants: Variants = {
    hidden: { y: distance, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    },
  };

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </Tag>
  );
}
