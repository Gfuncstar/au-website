/**
 * StandardsStrip — surfaces the regulators and professional bodies
 * AU's teaching is anchored to.
 *
 * Each row links through to /standards/[slug] for the full read-out
 * (who they are, what they do, how AU teaches against them, related
 * courses) per Giles' "Read more on these sections that open and then
 * maybe each one of them has its page" call.
 */

import Link from "next/link";
import { Eyebrow } from "./Eyebrow";
import { STANDARDS, type StandardContext } from "@/lib/standards";

type Props = {
  context?: StandardContext;
  /** Tone of the surrounding section — drives label / body colours. */
  tone?: "light" | "dark";
  /** Show the headline above the grid. Default true. */
  showEyebrow?: boolean;
};

export function StandardsStrip({
  context = "all",
  tone = "light",
  showEyebrow = true,
}: Props) {
  const items = STANDARDS.filter((s) => s.contexts.includes(context));

  const labelColor = "var(--color-au-pink)";
  const nameColor =
    tone === "dark" ? "text-au-white/55" : "text-au-charcoal/55";
  const readMoreColor =
    tone === "dark"
      ? "text-au-white/55 hover:text-[var(--color-au-pink)]"
      : "text-au-charcoal/55 hover:text-[var(--color-au-pink)]";
  const borderColor =
    tone === "dark" ? "border-au-white/15" : "border-au-charcoal/15";
  const hoverBg = tone === "dark" ? "hover:bg-au-white/5" : "hover:bg-au-cream";

  return (
    <div>
      {showEyebrow && (
        <Eyebrow color="pink" className="mb-6 sm:mb-7">
          Standards we teach against
        </Eyebrow>
      )}
      <ul
        className={`flex flex-col border-t ${borderColor}`}
      >
        {items.map((s) => (
          <li key={s.slug} className={`border-b ${borderColor}`}>
            <Link
              href={`/standards/${s.slug}`}
              className={`group block py-5 sm:py-6 grid grid-cols-[auto_1fr_auto] gap-x-5 items-center transition-colors ${hoverBg}`}
            >
              <span
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(1.125rem, 2.4vw, 1.5rem)",
                  color: labelColor,
                  letterSpacing: "var(--tracking-tight-display)",
                  minWidth: "3.5rem",
                }}
              >
                {s.abbrev}
              </span>
              <p
                className={`font-section font-semibold uppercase tracking-[0.15em] text-[0.6875rem] sm:text-[0.75rem] ${nameColor}`}
              >
                {s.name}
              </p>
              <span
                aria-hidden="true"
                className={`font-section font-semibold uppercase tracking-[0.15em] text-[0.6875rem] whitespace-nowrap transition-all ${readMoreColor} group-hover:translate-x-0.5`}
              >
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
