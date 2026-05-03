/**
 * CourseTileProgress — small progress indicator for a course tile.
 *
 * Renders a thin progress bar and a "X of Y lessons" caption derived
 * from the same `useCourseProgress` hook the course-overview page
 * already uses. Drops into the course tiles on /members and
 * /members/courses so members can see, at a glance from the
 * dashboard, how far through each course they are without clicking
 * into the course first.
 *
 * Returns null for courses that have no native lessons (e.g.,
 * placeholder courses that still hand off to Kartra), so the tile
 * stays clean.
 *
 * Visual matches the in-course progress bar: charcoal track, pink
 * fill, Oswald uppercase caption.
 */

"use client";

import { useCourseProgress } from "@/lib/lessonProgress";

interface Props {
  courseSlug: string;
  lessonSlugs: readonly string[];
}

export function CourseTileProgress({ courseSlug, lessonSlugs }: Props) {
  const total = lessonSlugs.length;
  const { completed } = useCourseProgress(
    courseSlug,
    lessonSlugs as string[],
  );

  if (total === 0) return null;

  const completedCount = completed.size;
  const pct = (completedCount / total) * 100;
  const allDone = completedCount === total;

  return (
    <div className="mb-4">
      <div
        className="h-[3px] w-full bg-au-charcoal/10 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completedCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completedCount} of ${total} lessons complete`}
      >
        <div
          className={
            "h-full transition-all duration-500 " +
            (allDone ? "bg-au-charcoal" : "bg-au-pink")
          }
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 font-section font-semibold uppercase tracking-[0.12em] text-[0.625rem] text-au-mid">
        {allDone ? (
          <span className="text-au-charcoal">Course complete</span>
        ) : (
          <>
            {completedCount} of {total} lesson{total === 1 ? "" : "s"} done
          </>
        )}
      </p>
    </div>
  );
}
