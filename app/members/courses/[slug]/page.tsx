/**
 * /members/courses/[slug] — course overview (table of contents).
 *
 * Server-renders the course title + lesson ledger from the markdown
 * files in `content/courses/<slug>/`. Progress + resume target hydrate
 * client-side via the `useCourseProgress` hook inside
 * <CourseOverviewChapters />.
 *
 * Only courses with native lesson content render here. Slugs that
 * don't have a `content/courses/<slug>/` folder (everything except
 * `acne-decoded` at v1) 404 — the launchpad still hands those off to
 * Kartra.
 */

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  getCourseLessonsMeta,
  getCoursePartsConfig,
  getNativeCourseSlugs,
  hasNativeCourse,
} from "@/lib/courseLessons";
import { getCourse } from "@/lib/courses";
import { checkCourseEntitlement } from "@/lib/entitlements";
import { CourseOverviewChapters } from "@/components/members/CourseOverviewChapters";
import { CourseIllustrationFor } from "@/components/CourseIllustration";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return {
    title: course ? `${course.title} — Members` : "Course",
  };
}

export function generateStaticParams() {
  return getNativeCourseSlugs().map((slug) => ({ slug }));
}

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!hasNativeCourse(slug)) notFound();

  const course = getCourse(slug);
  const lessons = getCourseLessonsMeta(slug);
  const parts = getCoursePartsConfig(slug);
  if (!course || lessons.length === 0) notFound();

  // Entitlement gate — signed-in members who don't own this course
  // bounce to the public sales page (auth gate has already happened
  // in middleware.ts so we're guaranteed a session here when LIVE).
  const entitlement = await checkCourseEntitlement(slug);
  if (!entitlement.entitled) {
    redirect(`/courses/${slug}`);
  }

  return (
    <>
      {/* ============================================================
          Dark course-overview header — full-bleed charcoal poster
          (same family as the lesson hero and Part dividers). Per
          Giles' "needs to be in dark mode" rule, applied course-wide.
          ============================================================ */}
      <header className="relative bg-au-charcoal text-au-white overflow-hidden -mx-4 sm:-mx-8 lg:-mx-12 -mt-5 sm:-mt-8 lg:-mt-10 mb-8 sm:mb-10">
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
        <div className="relative px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-10 sm:pb-12 max-w-[1100px]">
          <Link
            href="/members/courses"
            className="font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] text-au-white/55 hover:text-au-pink transition-colors inline-flex items-center gap-1.5 mb-5"
          >
            <span aria-hidden="true">←</span> All courses
          </Link>
          <div className="flex items-start gap-5">
            <div className="min-w-0 flex-1">
              <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.65rem] text-au-pink mb-3">
                {course.category} · {course.format}
              </p>
              <h1
                className="font-display font-black text-au-white leading-[0.95]"
                style={{
                  fontSize: "clamp(1.75rem, 5.5vw, 3.5rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {course.title}
              </h1>
              {course.summary && (
                <p className="mt-4 text-[1rem] sm:text-[1.0625rem] text-au-white/85 max-w-[60ch] leading-relaxed">
                  {course.summary}
                </p>
              )}
            </div>
            <CourseIllustrationFor
              slug={course.slug}
              className="hidden sm:block shrink-0 w-20 h-20 lg:w-24 lg:h-24"
            />
          </div>
        </div>
      </header>

      <CourseOverviewChapters
        courseSlug={slug}
        lessons={lessons}
        parts={parts}
      />
    </>
  );
}
