/**
 * /members/courses — courses launchpad.
 *
 * Tile grid of every membership the user holds + a quieter "you might
 * also like" upsell strip for catalogue items they don't own.
 *
 * Each "Open course" CTA routes to the native lesson player at
 * /members/courses/<slug> if the course has lesson markdown in
 * content/courses/<slug>/, falling back to the public sales page
 * otherwise.
 */

import Link from "next/link";
import { kartra } from "@/lib/kartra/client";
import { CourseIllustrationFor } from "@/components/CourseIllustration";
import { FreeBadge } from "@/components/FreeBadge";
import { StatusBadge } from "@/components/members/StatusBadge";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { StartFreeCourseButton } from "@/components/members/StartFreeCourseButton";
import { CourseTileProgress } from "@/components/members/CourseTileProgress";
import {
  MembersSearch,
  type SearchableLesson,
} from "@/components/members/MembersSearch";
import { COURSES, getCourseByMembershipName, type Course } from "@/lib/courses";
import { getCourseLessonsMeta, hasNativeCourse } from "@/lib/courseLessons";
import {
  aggregateProgress,
  getMemberLessonProgress,
} from "@/lib/lessonProgress.server";
import { formatDate } from "@/lib/format";

export default async function CoursesPage() {
  const lead = await kartra.getLead("");
  if (!lead) return null;

  // Resolve each active Kartra membership to its Course entry via the
  // `kartraMembershipName` field on lib/courses.ts. Co-located lookup
  // means adding a course only touches that one file.
  const owned = lead.memberships
    .filter((m) => m.active)
    .map((m) => ({
      membership: m,
      course: getCourseByMembershipName(m.membership_name),
    }))
    .filter((x): x is { membership: typeof x.membership; course: NonNullable<typeof x.course> } => !!x.course);

  const ownedSlugs = new Set(owned.map((x) => x.course.slug));

  // Show every catalogue course the member doesn't already own. Free
  // tasters first (one-tap value, lowest friction), then paid courses
  // available now, then anything on a waitlist. Within each group keep
  // the COURSES ordering (which the catalogue page also uses) so the
  // launchpad and the marketing surface stay coherent.
  const tier = (c: Course): number => {
    if (c.availability === "waitlist") return 2;
    if (c.price === undefined) return 0;
    return 1;
  };
  const recommendations = COURSES.filter(
    (c) => !ownedSlugs.has(c.slug),
  ).sort((a, b) => tier(a) - tier(b));

  // Aggregate progress totals for the status strip (mirrors the
  // /members dashboard so both surfaces show the same numbers).
  const progressRows = await getMemberLessonProgress();
  const progress = aggregateProgress(
    progressRows,
    owned
      .map(({ course }) => course)
      .filter((c) => hasNativeCourse(c.slug))
      .map((c) => ({
        slug: c.slug,
        lessonSlugs: getCourseLessonsMeta(c.slug).map((l) => l.slug),
      })),
  );

  // Searchable index of every lesson in every owned course with native
  // content. Title + summary only — keeps the client payload small
  // and the search instant. Body-level search would need to go
  // server-side and is a v2 problem.
  const searchableLessons: SearchableLesson[] = owned.flatMap(({ course }) => {
    if (!hasNativeCourse(course.slug)) return [];
    return getCourseLessonsMeta(course.slug).map((lesson) => ({
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonSummary: lesson.summary || "",
    }));
  });

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="bg-au-charcoal text-au-white -mx-4 sm:-mx-8 lg:-mx-12 -mt-5 sm:-mt-8 lg:-mt-10 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-white/55 mb-3">
          My courses
        </p>
        <h1
          className="font-display font-black text-au-white leading-[0.95]"
          style={{
            fontSize: "clamp(1.625rem, 5.5vw, 3.5rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Your <span className="text-au-pink">courses</span>.
        </h1>
        <p className="mt-3 sm:mt-4 text-[0.9375rem] sm:text-[1.0625rem] text-au-white/75 max-w-[60ch] leading-relaxed">
          Everything you have access to, and what&apos;s next.
        </p>
        {recommendations.length > 0 && (
          <Link
            href="#more-to-explore"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-[5px] font-display font-bold uppercase tracking-[0.05em] text-[0.8125rem] bg-[var(--color-au-pink)] text-au-charcoal hover:bg-au-white transition-colors"
          >
            Browse the full library
            <span aria-hidden="true">↓</span>
          </Link>
        )}
      </section>

      <MembersStatusStrip lead={lead} progress={progress} />

      {/* Search across every lesson in every course the member owns.
          Sits above the enrolled-courses grid so a member who knows
          what they're looking for finds it in one tap rather than
          scanning tiles. Hidden when the member has no owned courses
          with native lessons. */}
      <MembersSearch lessons={searchableLessons} />

      {/* ============================================================
          Owned courses
          ============================================================ */}
      <Reveal delay={0.1}>
      <section>
        <header className="mb-6 border-b border-au-charcoal/10 pb-4">
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
            Enrolled · {owned.length}
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {owned.map(({ membership, course }) => {
            const isFree = membership.level_name.toLowerCase().includes("free");
            return (
              <li
                key={membership.membership_id}
                className="group bg-au-pink-soft/30 rounded-[4px] p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <StatusBadge status={isFree ? "free" : "active"}>
                        {membership.level_name}
                      </StatusBadge>
                      <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid">
                        Granted {formatDate(membership.granted_at)}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-au-charcoal text-[1.1875rem] leading-tight">
                      {membership.membership_name}
                    </h3>
                  </div>
                  {course && (
                    <CourseIllustrationFor
                      slug={course.slug}
                      className="shrink-0 w-14 h-14"
                    />
                  )}
                </div>
                {course?.summary && (
                  <p className="text-[0.9375rem] text-au-body leading-relaxed mb-5 flex-1">
                    {course.summary}
                  </p>
                )}
                {course && hasNativeCourse(course.slug) && (
                  <CourseTileProgress
                    courseSlug={course.slug}
                    lessonSlugs={getCourseLessonsMeta(course.slug).map(
                      (l) => l.slug,
                    )}
                  />
                )}
                <div className="flex items-center justify-between gap-4 mt-auto">
                  <Link
                    href={
                      course
                        ? hasNativeCourse(course.slug)
                          ? `/members/courses/${course.slug}`
                          : `/courses/${course.slug}`
                        : "#"
                    }
                    className="bg-au-pink hover:bg-au-black text-au-white font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-5 py-2.5 min-h-[40px] text-[0.8125rem] transition-colors inline-flex items-center gap-2"
                  >
                    Open course
                    <span aria-hidden="true">→</span>
                  </Link>
                  <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-mid">
                    {course?.format}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      </Reveal>

      {/* ============================================================
          The rest of the library, surfaced as a real upsell channel
          rather than a polite three-tile recommendations strip.
          - Free tasters: one-tap "Add to my dashboard" via the
            existing /api/members/enrol-free route.
          - Paid: "Enrol now" → Kartra checkout.
          - Waitlist: "Join the waitlist" → Kartra waitlist URL.
          Each tile keeps a secondary "Browse course" link so the
          member can read the sales page first if they want to.
          ============================================================ */}
      {recommendations.length > 0 && (
        <Reveal delay={0.15}>
        <section id="more-to-explore" className="scroll-mt-24">
          <header className="mb-6 border-b border-au-charcoal/10 pb-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-pink mb-2">
              More to explore
            </p>
            <h2
              className="font-display font-black text-au-charcoal leading-[1] mb-2"
              style={{
                fontSize: "clamp(1.375rem, 3.5vw, 2rem)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              The rest of the library.
            </h2>
            <p className="text-[0.9375rem] text-au-body max-w-[60ch] leading-relaxed">
              Free tasters add to your dashboard in one tap. Paid courses
              open in checkout, then land here the moment payment clears.
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((c) => {
              const isFree = c.price === undefined;
              const isWaitlist = c.availability === "waitlist";
              return (
                <li
                  key={c.slug}
                  className="bg-au-white border border-au-charcoal/10 rounded-[4px] p-5 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CourseIllustrationFor
                      slug={c.slug}
                      className="shrink-0 w-10 h-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid mb-1">
                        {c.category}
                        {isWaitlist && " · Waitlist"}
                        {isFree && !isWaitlist && " · Free taster"}
                      </p>
                      <h3 className="font-display font-bold text-au-charcoal text-[1rem] leading-tight">
                        {c.title}
                      </h3>
                    </div>
                    {isFree ? (
                      <FreeBadge className="shrink-0 w-12 h-12" />
                    ) : (
                      <span className="shrink-0 font-display font-black text-au-charcoal text-[0.9375rem] tabular-nums">
                        £{c.price?.toLocaleString("en-GB")}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.8125rem] text-au-body leading-relaxed mb-5 flex-1">
                    {c.summary}
                  </p>
                  <div className="mt-auto flex flex-col gap-3">
                    {isWaitlist ? (
                      <Link
                        href={c.kartraUrl}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[5px] font-display font-bold uppercase tracking-[0.05em] text-[0.8125rem] bg-au-charcoal text-au-white hover:bg-au-pink hover:text-au-charcoal transition-colors"
                      >
                        Join the waitlist
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : isFree ? (
                      <StartFreeCourseButton
                        courseSlug={c.slug}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[5px] font-display font-bold uppercase tracking-[0.05em] text-[0.8125rem] bg-[var(--color-au-pink)] text-au-charcoal hover:bg-au-charcoal hover:text-au-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    ) : (
                      <Link
                        href={c.kartraUrl}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[5px] font-display font-bold uppercase tracking-[0.05em] text-[0.8125rem] bg-[var(--color-au-pink)] text-au-charcoal hover:bg-au-charcoal hover:text-au-white transition-colors"
                      >
                        Enrol now
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                    <Link
                      href={`/courses/${c.slug}`}
                      className="self-center font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-mid hover:text-au-pink transition-colors"
                    >
                      Browse course →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        </Reveal>
      )}
    </div>
  );
}
