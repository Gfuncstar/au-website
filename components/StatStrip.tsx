/**
 * StatStrip — inline credential row, sits below every hero.
 *
 * Mobile-first: on a phone, scrolls horizontally if the row overflows
 * (no awkward stacking, no wrapping). On desktop, lays out flat with
 * thin pink vertical bars between items.
 *
 * Per design-direction.md:
 *   12 YRS  |  MSC ANP  |  HEAD OF CLINICAL WORKFORCE  |  ...
 *
 * Items are passed as an array (default = HERO_STAT_STRIP from credentials).
 */

import { HERO_STAT_STRIP } from "@/lib/credentials";

type Props = {
  items?: readonly string[];
  /** Tone of the strip. 'dark' for cream/white blocks, 'light' for black blocks. */
  tone?: "dark" | "light";
  className?: string;
};

const toneMap = {
  dark: {
    text: "text-au-charcoal",
    rule: "before:bg-[var(--color-au-pink)]",
  },
  light: {
    text: "text-au-white/80",
    rule: "before:bg-[var(--color-au-pink)]",
  },
} as const;

export function StatStrip({
  items = HERO_STAT_STRIP,
  tone = "dark",
  className = "",
}: Props) {
  const t = toneMap[tone];
  return (
    <div
      className={`w-full overflow-x-auto no-scrollbar ${className}`}
      role="list"
      aria-label="Credentials"
    >
      <ul
        className={`flex items-center gap-x-6 sm:gap-x-8 px-4 sm:px-6 py-3 sm:py-4 font-section font-semibold uppercase text-[0.6875rem] sm:text-[0.75rem] tracking-[0.15em] ${t.text} whitespace-nowrap`}
      >
        {items.map((item, i) => (
          <li
            key={i}
            role="listitem"
            className={`relative flex items-center ${
              i > 0
                ? `before:content-[''] before:absolute before:-left-3 sm:before:-left-4 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-px ${t.rule}`
                : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
