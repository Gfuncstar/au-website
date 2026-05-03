/**
 * CourseOverviewChapters — full vertical chapter ledger shown on the
 * course overview page. Editorial-poster aesthetic per Giles' "no
 * cream, take design from the website" call:
 *
 *   - Resume hero: black poster (charcoal bg, white + pink type, pink
 *     pill CTA) — the AU "Black poster" pattern from design-direction
 *     Section 3.
 *   - Chapter ledger: alternating row tones, pink number roundels that
 *     fill on hover, animated entrance via Reveal.
 *
 * Hydrates progress + resume target from localStorage on mount.
 */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCourseProgress } from "@/lib/lessonProgress";
import { Reveal } from "@/components/members/Reveal";
import { LessonIcon } from "@/components/members/LessonIcon";
import type { CoursePart, LessonMeta } from "@/lib/courseLessons";

interface Props {
  courseSlug: string;
  lessons: LessonMeta[];
  /** Editorial Part dividers to interleave between chapter rows.
   *  Loaded from `content/courses/<slug>/course.json` upstream. */
  parts?: CoursePart[];
}

export function CourseOverviewChapters({
  courseSlug,
  lessons,
  parts,
}: Props) {
  const slugs = useMemo(() => lessons.map((l) => l.slug), [lessons]);
  const { isComplete, completed } = useCourseProgress(courseSlug, slugs);
  const partByStartOrder = useMemo(() => {
    const m = new Map<number, CoursePart>();
    for (const p of parts ?? []) m.set(p.startOrder, p);
    return m;
  }, [parts]);

  const resumeLesson =
    lessons.find((l) => !isComplete(l.slug)) ?? lessons[lessons.length - 1];
  const completedCount = completed.size;
  const totalCount = lessons.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  return (
    <>
      {/* ============================================================
          Resume hero, Black Poster treatment (per design-direction §3)
          ============================================================ */}
      <Reveal>
        <section className="relative bg-au-charcoal text-au-white rounded-[5px] overflow-hidden mb-12 sm:mb-14">
          {/* Soft pink radial wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(70% 100% at 100% 0%, var(--color-au-pink) 0%, transparent 60%)",
            }}
          />
          {/* Diagonal pink rule, editorial flourish */}
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 w-px h-[180%] bg-au-pink/30 rotate-[18deg] origin-top-right"
          />

          <div className="relative px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="min-w-0 flex-1">
                <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.65rem] text-au-pink mb-3">
                  {allDone
                    ? "Course complete"
                    : completedCount === 0
                      ? "Begin"
                      : "Pick up where you left off"}
                </p>
                <h2
                  className="font-display font-black leading-[0.98] mb-3"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  {resumeLesson?.title}
                </h2>
                {resumeLesson?.summary && (
                  <p
                    className="font-quote italic text-au-white/75 leading-snug max-w-[55ch]"
                    style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.125rem)" }}
                  >
                    {resumeLesson.summary}
                  </p>
                )}
              </div>
              {resumeLesson && !allDone && (
                <Link
                  href={`/members/courses/${courseSlug}/${resumeLesson.slug}`}
                  className="shrink-0 bg-au-pink hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 py-3.5 min-h-[48px] text-[0.8125rem] transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
                >
                  {completedCount === 0 ? "Begin lesson 1" : "Resume lesson"}{" "}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
              {allDone && (
                <a
                  href={`/api/members/certificate/${courseSlug}`}
                  className="shrink-0 bg-au-pink hover:bg-au-white text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-7 py-3.5 min-h-[48px] text-[0.8125rem] transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
                  download
                >
                  Download certificate{" "}
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>

            {/* Progress meter */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex-1 h-[3px] bg-au-white/15 rounded-[2px] overflow-hidden">
                <motion.div
                  className="h-full bg-au-pink rounded-[2px]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.15,
                  }}
                />
              </div>
              <p className="shrink-0 font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-white/55 tabular-nums">
                <span className="text-au-pink">{completedCount}</span>{" "}
                <span aria-hidden="true">/</span> {totalCount}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ============================================================
          Chapter ledger
          ============================================================ */}
      <section>
        <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-au-charcoal/10 pb-4">
          <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.7rem] text-au-charcoal">
            <span className="text-au-pink">●</span> All chapters · {totalCount}
          </p>
          <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-mid tabular-nums">
            {completedCount} / {totalCount} complete
          </p>
        </header>

        <ol className="border-t border-au-charcoal/10 -mt-px">
          {lessons.map((lesson, i) => {
            const done = isComplete(lesson.slug);
            const part = partByStartOrder.get(lesson.order);
            return (
              <motion.li
                key={lesson.slug}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.04 * i,
                }}
                className={
                  i > 0 && !part ? "border-t border-au-charcoal/10" : ""
                }
              >
                {part && (
                  <div className="relative bg-au-charcoal text-au-white rounded-[5px] overflow-hidden my-6 sm:my-8 -mx-3 sm:-mx-4">
                    {/* Soft pink wash + diagonal rule for editorial weight */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-25"
                      style={{
                        background:
                          "radial-gradient(70% 100% at 100% 0%, var(--color-au-pink) 0%, transparent 60%)",
                      }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -right-10 -top-10 w-px h-[180%] bg-au-pink/30 rotate-[18deg] origin-top-right"
                    />
                    <div className="relative px-5 sm:px-7 py-5 sm:py-6">
                      <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.65rem] text-au-pink mb-2">
                        {part.eyebrow}
                      </p>
                      <h3
                        className="font-display font-black leading-[1] mb-1.5"
                        style={{
                          fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                          letterSpacing: "var(--tracking-tight-display)",
                        }}
                      >
                        {part.title}
                      </h3>
                      {part.body && (
                        <p className="text-[0.9rem] text-au-white/70 leading-snug max-w-[55ch]">
                          {part.body}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <Link
                  href={`/members/courses/${courseSlug}/${lesson.slug}`}
                  className="group flex items-start gap-4 sm:gap-6 py-5 sm:py-6 -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-[3px] transition-all duration-200 hover:bg-au-pink-soft/15 hover:translate-x-1"
                >
                  {/* Illustrated chapter icon with a chunky status badge in the corner */}
                  <span className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <LessonIcon
                      name={lesson.icon}
                      className="w-full h-full"
                    />
                    <span
                      aria-hidden="true"
                      className={
                        "absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-[5px] flex items-center justify-center font-section font-semibold tabular-nums text-[0.78rem] sm:text-[0.85rem] tracking-[0.04em] transition-colors duration-200 shadow-[0_1px_0_rgba(0,0,0,0.06)] " +
                        (done
                          ? "bg-au-pink text-au-charcoal"
                          : "bg-au-white text-au-charcoal border border-au-charcoal/20 group-hover:bg-au-charcoal group-hover:text-au-pink group-hover:border-au-charcoal")
                      }
                    >
                      {done ? "✓" : String(lesson.order).padStart(2, "0")}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display font-bold text-au-charcoal text-[1.0625rem] sm:text-[1.1875rem] leading-snug group-hover:text-au-black transition-colors">
                        {lesson.title}
                      </h3>
                      {lesson.duration && (
                        <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid tabular-nums">
                          {lesson.duration}
                        </span>
                      )}
                      {lesson.isCertificate && (
                        <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-pink">
                          ✦ Certificate
                        </span>
                      )}
                    </div>
                    {lesson.summary && (
                      <p className="mt-1.5 text-[0.9375rem] text-au-body leading-relaxed max-w-[60ch]">
                        {lesson.summary}
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
              </motion.li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
