/**
 * CourseChapterStrip + CourseChapterPills — split into two exports so
 * the lesson page can place the charcoal title band at the top of the
 * page (scrolls away normally) and the pill row as a sibling that
 * sticks to the viewport top throughout the lesson body.
 *
 * Sticky semantics: the pill row's `sticky top-0` only follows the
 * user as long as its PARENT element is still on screen. Splitting the
 * pills out so they live as a direct sibling of the lesson body inside
 * a single tall wrapper makes the parent the entire lesson page, so
 * the pills stay visible all the way down.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCourseProgress } from "@/lib/lessonProgress";
import type { LessonMeta } from "@/lib/courseLessons";

interface CommonProps {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
}

interface CourseChapterStripProps extends CommonProps {
  courseTitle: string;
}

/* ============================================================
   1) Title band — charcoal block with course title + progress.
   Scrolls away normally as the user reads.
   ============================================================ */
export function CourseChapterStrip({
  courseSlug,
  courseTitle,
  lessons,
  currentSlug,
}: CourseChapterStripProps) {
  const slugs = lessons.map((l) => l.slug);
  const { completed } = useCourseProgress(courseSlug, slugs);
  const completedCount = completed.size;
  const totalCount = lessons.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentIndex = lessons.findIndex((l) => l.slug === currentSlug);

  return (
    <div className="bg-au-charcoal text-au-white">
      <div className="px-5 sm:px-8 lg:px-12 pt-5 sm:pt-6 pb-5 max-w-[1100px]">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <Link
            href="/members/courses"
            className="font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] text-au-white/55 hover:text-au-pink transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span> All courses
          </Link>
          <p className="shrink-0 font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-white/55 tabular-nums">
            <span className="text-au-pink">{completedCount}</span>{" "}
            <span aria-hidden="true">/</span> {totalCount} complete
          </p>
        </div>

        <p className="font-display font-black uppercase tracking-[0.04em] text-[1.0625rem] sm:text-[1.25rem] leading-[1.1] text-au-pink mb-1.5">
          {courseTitle}
        </p>
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] sm:text-[0.75rem] text-au-white/70">
          Chapter {String(currentIndex + 1).padStart(2, "0")} of{" "}
          {String(totalCount).padStart(2, "0")}
        </p>

        <div
          className="mt-4 h-[3px] w-full bg-au-white/10 rounded-[2px] overflow-hidden"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-label={`Course progress: ${completedCount} of ${totalCount} chapters complete`}
        >
          <motion.div
            className="h-full bg-au-pink rounded-[2px]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2) Pill row — sticky chapter chips. Lives at the top of the
   lesson page wrapper as a sibling of the lesson body so the
   sticky containing block is the full lesson height.
   ============================================================ */
export function CourseChapterPills({
  courseSlug,
  lessons,
  currentSlug,
}: CommonProps) {
  const slugs = lessons.map((l) => l.slug);
  const { isComplete } = useCourseProgress(courseSlug, slugs);

  return (
    <nav
      aria-label="Course chapters"
      className="bg-au-white/95 backdrop-blur-sm border-b border-au-charcoal/5 overflow-x-auto sticky z-20 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      style={{ top: "var(--members-topbar-h)" }}
    >
      <ol className="flex items-stretch gap-1.5 px-5 sm:px-8 lg:px-12 py-3 sm:py-3.5 max-w-[1100px] sm:flex-wrap">
        {lessons.map((lesson, i) => {
          const active = lesson.slug === currentSlug;
          const done = isComplete(lesson.slug);
          return (
            <motion.li
              key={lesson.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08 + i * 0.025,
              }}
              className="shrink-0"
            >
              <Link
                href={`/members/courses/${courseSlug}/${lesson.slug}`}
                aria-current={active ? "page" : undefined}
                title={lesson.title}
                className={
                  "group relative flex items-center gap-2 px-3.5 py-2 rounded-[5px] transition-all duration-200 min-w-[3.25rem] " +
                  (active
                    ? "bg-au-charcoal text-au-white shadow-[0_2px_0_var(--color-au-pink)]"
                    : done
                      ? "bg-au-pink-soft/30 text-au-charcoal hover:bg-au-pink-soft/60 hover:-translate-y-px"
                      : "text-au-mid hover:text-au-charcoal hover:-translate-y-px border border-au-charcoal/10 hover:border-au-pink")
                }
              >
                <span
                  className={
                    "font-section font-semibold tabular-nums text-[0.7rem] tracking-[0.05em] " +
                    (active ? "text-au-pink" : "")
                  }
                >
                  {String(lesson.order).padStart(2, "0")}
                </span>
                {done && !active && (
                  <span
                    aria-label="Completed"
                    className="text-[0.7rem] text-au-pink"
                  >
                    ✓
                  </span>
                )}
                {active && (
                  <motion.span
                    aria-hidden="true"
                    className="block w-1 h-1 rounded-[1px] bg-au-pink"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
