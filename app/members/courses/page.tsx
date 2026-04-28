/**
 * /members/courses — courses launchpad.
 *
 * Tile grid of every membership the user holds + a quieter "you might
 * also like" upsell strip for catalogue items they don't own.
 *
 * v1: each "Open course" CTA links to the public course page (which
 * houses the Kartra hand-off URL today). v2 swaps to a native lesson
 * player at /members/courses/<slug>/<lesson>.
 */

import Link from "next/link";
import { kartra } from "@/lib/kartra/client";
import { CourseIllustrationFor } from "@/components/CourseIllustration";
import { FreeBadge } from "@/components/FreeBadge";
import { StatusBadge } from "@/components/members/StatusBadge";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { COURSES, getCourseByMembershipName } from "@/lib/courses";
import { hasNativeCourse } from "@/lib/courseLessons";
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

  const recommendations = COURSES.filter((c) => !ownedSlugs.has(c.slug)).slice(
    0,
    3,
  );

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
          Everything you have access to — and what&apos;s next.
        </p>
      </section>

      <MembersStatusStrip lead={lead} />

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
          You might also like — restrained upsell, never blocking
          ============================================================ */}
      {recommendations.length > 0 && (
        <Reveal delay={0.15}>
        <section>
          <header className="mb-6 border-b border-au-charcoal/10 pb-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
              You might also like
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recommendations.map((c) => {
              const isFree = c.price === undefined;
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
                    <div className="min-w-0">
                      <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid mb-1">
                        {c.category}
                        {c.availability === "waitlist" && " · Waitlist"}
                      </p>
                      <h3 className="font-display font-bold text-au-charcoal text-[1rem] leading-tight">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[0.8125rem] text-au-body leading-relaxed mb-4 flex-1">
                    {c.summary}
                  </p>
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <Link
                      href={`/courses/${c.slug}`}
                      className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors"
                    >
                      Browse course →
                    </Link>
                    {c.price === undefined ? (
                      <FreeBadge className="w-12 h-12" />
                    ) : (
                      <span className="font-display font-black text-au-charcoal text-[0.875rem] tabular-nums">
                        £{c.price.toLocaleString("en-GB")}
                      </span>
                    )}
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
