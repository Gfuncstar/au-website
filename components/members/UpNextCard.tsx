/**
 * UpNextCard — preview tile shown above LessonNavFooter so the next
 * lesson has a "story handoff" at the foot of every chapter, not just
 * a button. Pulls the next lesson's icon, title and summary into a
 * pink-soft card mirroring the course-overview row treatment.
 *
 * Renders nothing on the final lesson.
 */

import Link from "next/link";
import { LessonIcon } from "@/components/members/LessonIcon";
import type { LessonMeta } from "@/lib/courseLessons";

interface UpNextCardProps {
  courseSlug: string;
  next: LessonMeta | null;
}

export function UpNextCard({ courseSlug, next }: UpNextCardProps) {
  if (!next) return null;
  return (
    <aside className="mt-12 sm:mt-14">
      <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.65rem] text-au-mid mb-3 flex items-center gap-2">
        <span aria-hidden="true" className="block h-px w-8 bg-au-pink" />
        Up next
      </p>
      <Link
        href={`/members/courses/${courseSlug}/${next.slug}`}
        className="group flex items-start gap-4 sm:gap-6 bg-au-pink-soft/40 hover:bg-au-pink-soft/60 rounded-[5px] p-5 sm:p-6 transition-colors"
      >
        <span className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <LessonIcon name={next.icon} className="w-full h-full" />
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-[5px] flex items-center justify-center font-section font-semibold tabular-nums text-[0.78rem] sm:text-[0.85rem] tracking-[0.04em] bg-au-white text-au-charcoal border border-au-charcoal/20 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          >
            {String(next.order).padStart(2, "0")}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display font-bold text-au-charcoal text-[1.0625rem] sm:text-[1.1875rem] leading-snug group-hover:text-au-black transition-colors">
              {next.title}
            </h3>
            {next.duration && (
              <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid tabular-nums">
                {next.duration}
              </span>
            )}
          </div>
          {next.summary && (
            <p className="mt-1.5 text-[0.9375rem] text-au-charcoal/80 leading-relaxed max-w-[60ch]">
              {next.summary}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 self-center text-au-mid group-hover:text-au-pink group-hover:translate-x-1 transition-all duration-200 text-[1.125rem]"
        >
          →
        </span>
      </Link>
    </aside>
  );
}
