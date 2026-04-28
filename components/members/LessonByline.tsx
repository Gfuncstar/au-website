/**
 * LessonByline — "Taught by Bernadette Tobin RN, MSc" strip with a
 * portrait crop. Used inside the lesson hero. Hero is dark per the
 * "lesson hero is always dark mode" rule, so the byline ships in
 * inverse tone by default. Pass `tone="light"` if it ever needs to
 * sit on a light surface.
 */

import Image from "next/image";
import { FOUNDER } from "@/lib/credentials";

interface LessonBylineProps {
  /** Visual tone — `dark` (default) for charcoal backgrounds,
   *  `light` for white. */
  tone?: "dark" | "light";
}

export function LessonByline({ tone = "dark" }: LessonBylineProps) {
  const eyebrow = tone === "dark" ? "text-au-white/55" : "text-au-mid";
  const name = tone === "dark" ? "text-au-white" : "text-au-charcoal";
  const credentials = tone === "dark" ? "text-au-white/55" : "text-au-mid";
  const ring = tone === "dark" ? "ring-au-white/15" : "ring-au-charcoal/10";

  return (
    <div className="mt-6 flex items-center gap-3">
      <span
        className={`relative shrink-0 w-10 h-10 rounded-[5px] overflow-hidden bg-au-pink-soft ring-1 ${ring}`}
      >
        <Image
          src="/brand/bernadette-3.jpg"
          alt={FOUNDER.fullName}
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
      <div className="min-w-0">
        <p
          className={`font-section font-semibold uppercase tracking-[0.18em] text-[0.6rem] leading-none mb-1 ${eyebrow}`}
        >
          Taught by
        </p>
        <p className={`font-display font-bold text-[0.875rem] leading-tight ${name}`}>
          {FOUNDER.fullName}
          <span
            className={`font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] ml-1.5 ${credentials}`}
          >
            {FOUNDER.shortCredentials}
          </span>
        </p>
      </div>
    </div>
  );
}
