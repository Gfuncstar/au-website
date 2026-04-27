/**
 * Eyebrow — small Oswald all-caps label that sits above hero / poster headlines.
 *
 * Usage:
 *   <Eyebrow>Educator of the Year 2026 · Nominee</Eyebrow>
 *   <Eyebrow color="white">Free 2-day course</Eyebrow>
 *
 * Always read by users BEFORE the headline — its job is to tell them what kind
 * of moment they're about to encounter. Per design-direction.md: 0.75rem,
 * Oswald SemiBold, ALL CAPS, tracking 0.18em.
 */

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Pink (default — for cream/white blocks) or white (for black blocks). */
  color?: "pink" | "white" | "black";
  className?: string;
};

const colorMap = {
  pink: "text-[var(--color-au-pink)]",
  white: "text-au-white",
  black: "text-au-black",
} as const;

export function Eyebrow({ children, color = "pink", className = "" }: Props) {
  return (
    <p
      className={`font-section font-semibold uppercase text-[0.75rem] sm:text-[0.8125rem] tracking-[0.18em] ${colorMap[color]} ${className}`}
    >
      {children}
    </p>
  );
}
