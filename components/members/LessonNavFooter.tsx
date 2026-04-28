/**
 * LessonNavFooter — sticky-feeling action bar at the bottom of every
 * lesson. Pink "Mark complete" pill (toggles to "Completed ✓") with a
 * charcoal "Next lesson" pill pushing the member forward. Prev sits as
 * a tertiary text link on the opposite side. Hover micro-motion (arrow
 * nudge, pink glow) keeps it from feeling flat without being noisy.
 *
 * Calm by design — no celebratory toasts (per design-direction.md
 * Section 15.7).
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCourseProgress } from "@/lib/lessonProgress";
import type { LessonMeta } from "@/lib/courseLessons";

interface LessonNavFooterProps {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export function LessonNavFooter({
  courseSlug,
  lessons,
  currentSlug,
  prev,
  next,
}: LessonNavFooterProps) {
  const slugs = lessons.map((l) => l.slug);
  const { isComplete, markComplete, markIncomplete } = useCourseProgress(
    courseSlug,
    slugs,
  );
  const done = isComplete(currentSlug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 sm:mt-16 pt-8 border-t border-au-charcoal/10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="order-2 sm:order-1">
          {prev ? (
            <Link
              href={`/members/courses/${courseSlug}/${prev.slug}`}
              className="group font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-mid hover:text-au-pink transition-colors inline-flex items-center gap-1.5"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:-translate-x-0.5"
              >
                ←
              </span>{" "}
              Previous: {prev.title}
            </Link>
          ) : (
            <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-mid/50">
              Course start
            </span>
          )}
        </div>

        <div className="order-1 sm:order-2 flex flex-wrap items-center gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() =>
              done ? markIncomplete(currentSlug) : markComplete(currentSlug)
            }
            aria-pressed={done}
            className={
              "group font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.8125rem] transition-all duration-200 inline-flex items-center gap-2 " +
              (done
                ? "bg-au-pink-soft/40 text-au-charcoal hover:bg-au-pink-soft/70"
                : "bg-au-pink hover:bg-au-charcoal text-au-charcoal hover:text-au-white shadow-[0_3px_0_var(--color-au-charcoal)] hover:shadow-[0_3px_0_var(--color-au-pink)]")
            }
          >
            <span
              aria-hidden="true"
              className={
                done
                  ? "inline-flex w-4 h-4 rounded-[5px] bg-au-pink text-au-charcoal items-center justify-center text-[0.65rem]"
                  : "inline-flex w-4 h-4 rounded-[5px] border border-au-charcoal/40 items-center justify-center text-[0.65rem]"
              }
            >
              {done ? "✓" : ""}
            </span>
            {done ? "Completed" : "Mark complete"}
          </button>

          {next ? (
            <Link
              href={`/members/courses/${courseSlug}/${next.slug}`}
              className="group bg-au-charcoal hover:bg-au-pink text-au-white hover:text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.8125rem] transition-colors inline-flex items-center gap-2"
            >
              Next lesson{" "}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          ) : (
            <Link
              href={`/members/courses/${courseSlug}`}
              className="group bg-au-charcoal hover:bg-au-pink text-au-white hover:text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.8125rem] transition-colors inline-flex items-center gap-2"
            >
              Back to course{" "}
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Keyboard hint — quietly tells members the course supports
          arrow-key navigation. Hidden on touch viewports where it's
          irrelevant. */}
      <p className="hidden lg:flex mt-5 items-center gap-3 text-[0.7rem] text-au-mid font-section font-semibold uppercase tracking-[0.16em]">
        <kbd className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1.5 rounded-[3px] border border-au-charcoal/15 bg-au-white text-au-charcoal text-[0.7rem] font-section">
          ←
        </kbd>
        <kbd className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1.5 rounded-[3px] border border-au-charcoal/15 bg-au-white text-au-charcoal text-[0.7rem] font-section">
          →
        </kbd>
        <span>Navigate lessons</span>
        <span aria-hidden="true" className="text-au-mid/40">·</span>
        <kbd className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1.5 rounded-[3px] border border-au-charcoal/15 bg-au-white text-au-charcoal text-[0.7rem] font-section">
          M
        </kbd>
        <span>Mark complete</span>
      </p>
    </motion.div>
  );
}
