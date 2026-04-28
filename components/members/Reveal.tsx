/**
 * Reveal — small client wrapper for subtle fade-up-on-scroll animations.
 *
 * Drop-in around any block in a server-rendered members page:
 *
 *   <Reveal delay={0.1}>
 *     <section>...</section>
 *   </Reveal>
 *
 * Honours `prefers-reduced-motion` automatically (Framer Motion respects
 * the OS-level setting). Single-shot per element (`once: true`) so the
 * page doesn't re-animate when the user scrolls back up.
 */

"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Delay in seconds — used to stagger groups of items. Default 0. */
  delay?: number;
  /** Y-offset starting position in px. Default 12. */
  offset?: number;
  /** Animation duration in seconds. Default 0.55. */
  duration?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  offset = 12,
  duration = 0.55,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
