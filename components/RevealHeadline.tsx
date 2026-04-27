/**
 * RevealHeadline — line-by-line scroll reveal for poster headlines.
 *
 * Per Giles' "text needs to reveal line by line quickly. On scroll." call.
 * Each line slides up from below an overflow-clipped band so the entry
 * reads like a printed poster being assembled rather than a faded block.
 *
 * - Container `staggerChildren` is fast (default 0.06s between lines).
 * - Each line: y: 100% → 0 (fully clipped to fully revealed).
 * - Once-only via `viewport={{ once: true }}`.
 *
 * Usage:
 *   <RevealHeadline
 *     lines={[
 *       "Three pillars.",
 *       "One framework that",
 *       <span style={{ color: "var(--color-au-pink)" }} key="3">
 *         holds up.
 *       </span>,
 *     ]}
 *     className="..."
 *     style={...}
 *     stagger={0.05}
 *   />
 */

"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Each entry is rendered as one revealed line. */
  lines: ReactNode[];
  className?: string;
  style?: CSSProperties;
  /** Time between line reveals in seconds. Default 0.06 (fast). */
  stagger?: number;
  /** Tag for the headline element. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
};

const lineVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RevealHeadline({
  lines,
  className,
  style,
  stagger = 0.06,
  as = "h2",
}: Props) {
  // Resolve the `as` prop to the matching motion element.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (motion as any)[as];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span variants={lineVariants} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
