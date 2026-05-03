/**
 * /members/courses/[slug]/[lesson] — native lesson player.
 *
 * Server-renders one lesson from `content/courses/<slug>/<lesson>.md`
 * and composes the in-lesson chrome:
 *   - LessonScrollProgress: 3px pink rule that fills as you scroll
 *   - CourseChapterStrip:    charcoal title band (course title + course progress)
 *   - CourseChapterPills:    sticky pill row of all chapters
 *   - Editorial lesson hero: pink rule + chapter eyebrow + revealed
 *     title + Lato chapter summary + LessonByline + AudioIntroPill +
 *     illustrated chapter glyph on the right
 *   - VideoPlaceholder
 *   - Lesson body (markdown rendered through .prose-au + .lesson-body
 *     transforms — section bands, callouts, step heads, mobile tables)
 *   - UpNextCard — preview of the next chapter
 *   - LessonNavFooter — prev / mark complete / next
 *   - OnThisPageNav (xl+ only): sticky right-rail section nav
 *
 * Negative margins on the chapter chrome wrappers let them break out
 * of the members layout's content padding for full-width bands.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getCourseLessonsMeta,
  getLesson,
  getLessonNeighbours,
  getLessonSections,
  getNativeCourseSlugs,
  hasNativeCourse,
} from "@/lib/courseLessons";
import { getCourse } from "@/lib/courses";
import { checkCourseEntitlement } from "@/lib/entitlements";
import {
  CourseChapterStrip,
  CourseChapterPills,
} from "@/components/members/CourseChapterStrip";
import { VideoPlaceholder } from "@/components/members/VideoPlaceholder";
import { LessonNavFooter } from "@/components/members/LessonNavFooter";
import { LessonRating } from "@/components/members/LessonRating";
import { Reveal } from "@/components/members/Reveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { LessonIcon } from "@/components/members/LessonIcon";
import { LessonScrollProgress } from "@/components/members/LessonScrollProgress";
import { UpNextCard } from "@/components/members/UpNextCard";
import { LessonByline } from "@/components/members/LessonByline";
import { AudioIntroPill } from "@/components/members/AudioIntroPill";
import { OnThisPageNav } from "@/components/members/OnThisPageNav";
import { LessonKeyboardNav } from "@/components/members/LessonKeyboardNav";
import { LessonViewTracker } from "@/components/members/LessonViewTracker";

type Params = { slug: string; lesson: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, lesson } = await params;
  const course = getCourse(slug);
  const lessonData = await getLesson(slug, lesson);
  if (!course || !lessonData) return { title: "Lesson" };
  return { title: `${lessonData.title}, ${course.title}` };
}

export async function generateStaticParams() {
  const params: Params[] = [];
  for (const slug of getNativeCourseSlugs()) {
    for (const l of getCourseLessonsMeta(slug)) {
      params.push({ slug, lesson: l.slug });
    }
  }
  return params;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, lesson } = await params;
  if (!hasNativeCourse(slug)) notFound();

  // Entitlement gate — bounce signed-in members who don't own this
  // course to its public sales page. Auth-not-signed-in is already
  // handled by middleware.ts upstream when LIVE.
  const entitlement = await checkCourseEntitlement(slug);
  if (!entitlement.entitled) {
    redirect(`/courses/${slug}`);
  }

  const course = getCourse(slug);
  const lessonsMeta = getCourseLessonsMeta(slug);
  const current = await getLesson(slug, lesson);
  if (!course || !current) notFound();

  const { prev, next } = getLessonNeighbours(lessonsMeta, current.slug);
  const sections = getLessonSections(current.html);

  return (
    <>
      {/* Scroll-linked progress rule fixed to viewport top */}
      <LessonScrollProgress />

      {/* Behaviour-only, listens for ← / → / M to navigate or mark
          complete without leaving the keyboard. */}
      <LessonKeyboardNav
        courseSlug={slug}
        lessonSlugs={lessonsMeta.map((l) => l.slug)}
        currentSlug={current.slug}
        prevHref={prev ? `/members/courses/${slug}/${prev.slug}` : null}
        nextHref={next ? `/members/courses/${slug}/${next.slug}` : null}
      />

      {/* Conversion event, fires once on lesson render. */}
      <LessonViewTracker courseSlug={slug} lessonSlug={current.slug} />

      {/* All lesson chrome + body inside one wrapper so the sticky pill
          row stays in view through the whole lesson. */}
      <div className="-mx-4 sm:-mx-8 lg:-mx-12 -mt-5 sm:-mt-8 lg:-mt-10">
        <CourseChapterStrip
          courseSlug={slug}
          courseTitle={course.title}
          lessons={lessonsMeta}
          currentSlug={current.slug}
        />
        <CourseChapterPills
          courseSlug={slug}
          lessons={lessonsMeta}
          currentSlug={current.slug}
        />

        {/* ============================================================
            Editorial lesson hero, full-bleed dark mode (charcoal poster
            with pink accents). Per Giles' "this section course-wide
            needs to be in dark mode" rule. Carries the soft pink wash +
            diagonal pink rule used on the Part dividers and the resume
            hero so the dark surfaces are a coherent family.
            ============================================================ */}
        <Reveal>
          <header className="relative bg-au-charcoal text-au-white overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                background:
                  "radial-gradient(70% 100% at 100% 0%, var(--color-au-pink) 0%, transparent 60%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 w-px h-[180%] bg-au-pink/30 rotate-[18deg] origin-top-right pointer-events-none"
            />
            <div className="relative px-4 sm:px-8 lg:px-12 py-10 sm:py-12 max-w-[1100px] grid grid-cols-[1fr_auto] gap-x-5 sm:gap-x-7 gap-y-2 items-start">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-px w-8 sm:w-12 bg-au-pink"
                />
                <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-white/70">
                  Chapter {String(current.order).padStart(2, "0")} of{" "}
                  {lessonsMeta.length}
                  {current.duration && (
                    <>
                      <span aria-hidden="true" className="mx-2 text-au-white/30">
                        ·
                      </span>
                      <span className="tabular-nums">{current.duration}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Animated chapter glyph */}
              <div className="row-span-4 self-start mt-1">
                <LessonIcon
                  name={current.icon}
                  replay
                  className="w-16 h-16 sm:w-24 sm:h-24"
                />
              </div>

              {/* Title */}
              <RevealHeadline
                as="h1"
                stagger={0.07}
                lines={[current.title]}
                className="font-display font-black text-au-white leading-[0.95]"
                style={{
                  fontSize: "clamp(1.875rem, 6vw, 3.5rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              />

              {/* Summary */}
              {current.summary && (
                <p
                  className="mt-4 pl-4 border-l-2 border-au-pink text-au-white/85 leading-relaxed max-w-[58ch]"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.125rem)" }}
                >
                  {current.summary}
                </p>
              )}

              {/* Byline, dark-mode tone */}
              <div>
                <LessonByline tone="dark" />
              </div>
            </div>
          </header>
        </Reveal>

        <div className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-12 lg:pb-16 max-w-[1100px]">
          {/* Audio intro — only rendered when this lesson has one. */}
          {current.audioIntro && (
            <div className="mb-5">
              <AudioIntroPill src={current.audioIntro} />
            </div>
          )}

          {/* Lesson video — only rendered when this lesson has one. */}
          {current.videoSrc && (
            <div className="mb-12 sm:mb-14">
              <VideoPlaceholder
                src={current.videoSrc}
                duration={current.duration}
                lessonTitle={current.title}
                chapterNumber={current.order}
              />
            </div>
          )}

          {/* Lesson body */}
          <Reveal delay={0.1}>
            <article
              className="prose-au lesson-body max-w-3xl text-au-charcoal"
              dangerouslySetInnerHTML={{ __html: current.html }}
            />
          </Reveal>

          {/* Lesson rating — sits between the body and the up-next
              card, so members rate the lesson when its content is
              still fresh in mind, before they move on. */}
          <LessonRating courseSlug={slug} lessonSlug={current.slug} />

          {/* Up next card */}
          <UpNextCard courseSlug={slug} next={next} />

          <LessonNavFooter
            courseSlug={slug}
            lessons={lessonsMeta}
            currentSlug={current.slug}
            prev={prev}
            next={next}
          />
        </div>
      </div>

      {/* Sticky right-rail "On this chapter", desktop only, shows
          when the lesson has 4+ sections. */}
      <OnThisPageNav sections={sections} />
    </>
  );
}
