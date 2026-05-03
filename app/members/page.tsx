/**
 * /members — dashboard home.
 *
 * Editorial-dashboard layout per design-direction.md §15.4. Surfaces
 * the live snapshot of the member: where they are in their courses,
 * what's coming up, what's recently happened. Pulls from kartra.getLead
 * (mock-backed at v0).
 */

import Link from "next/link";
import { kartra } from "@/lib/kartra/client";
import { CourseIllustrationFor } from "@/components/CourseIllustration";
import { FreeBadge } from "@/components/FreeBadge";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { StartFreeCourseButton } from "@/components/members/StartFreeCourseButton";
import { COURSES, getCourse, getCourseByMembershipName } from "@/lib/courses";
import { hasNativeCourse } from "@/lib/courseLessons";
import { formatDateLong, formatDate, formatGBP } from "@/lib/format";

/** Resolve the right destination for a course: the native lesson
 *  player overview if we have lesson markdown for it, otherwise the
 *  public sales page (which today still hands off to Kartra). */
function courseHref(slug: string): string {
  return hasNativeCourse(slug)
    ? `/members/courses/${slug}`
    : `/courses/${slug}`;
}

export default async function MembersHomePage() {
  const lead = await kartra.getLead("");
  if (!lead) return null;

  const today = formatDateLong(new Date().toISOString());
  const activeMemberships = lead.memberships.filter((m) => m.active);
  const ownedCourses = activeMemberships
    .map((m) => getCourseByMembershipName(m.membership_name))
    .filter((c): c is NonNullable<ReturnType<typeof getCourse>> => Boolean(c));
  const ownedSlugs = ownedCourses.map((c) => c.slug);

  const recentTransactions = [...lead.transactions]
    .sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
    )
    .slice(0, 4);

  const ownedSlugSet = new Set(ownedSlugs);
  const recommendations = COURSES.filter((c) => !ownedSlugSet.has(c.slug)).slice(
    0,
    3,
  );

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* ============================================================
          Personal hero, dark-mode editorial poster, sympathetic to the
          /login dark surface so members feel they're in the private
          portal. White type on charcoal with the pink accent intact.
          ============================================================ */}
      <section className="bg-au-charcoal text-au-white -mx-4 sm:-mx-8 lg:-mx-12 -mt-5 sm:-mt-8 lg:-mt-10 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] sm:text-[0.7rem] text-au-white/55">
          Welcome back · {today.toUpperCase()}
        </p>
        <p
          className="font-display font-black text-au-white mt-2.5 sm:mt-4 leading-[1.05]"
          style={{
            fontSize: "clamp(1.625rem, 5vw, 3rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          {lead.first_name},{" "}
          <span className="text-au-pink">picking up where you left off.</span>
        </p>

        {ownedCourses.length > 0 && (
          <p className="mt-3 sm:mt-5 max-w-[60ch] text-[0.9375rem] sm:text-[1.0625rem] text-au-white/75 leading-relaxed">
            You have{" "}
            <span className="font-bold text-au-white">
              {activeMemberships.length}{" "}
              {activeMemberships.length === 1 ? "course" : "courses"}
            </span>{" "}
            on your shelf, most recently{" "}
            <span className="font-bold text-au-white">
              {ownedCourses[0].title}
            </span>
            .
          </p>
        )}

        {ownedCourses.length > 0 && (
          <Link
            href="/members/courses"
            className="group mt-5 sm:mt-7 inline-flex items-center gap-2 bg-au-pink hover:bg-au-white hover:text-au-charcoal text-au-charcoal font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] sm:min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors"
          >
            <span>Continue learning</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </section>

      {/* ============================================================
          At-a-glance status, sits just below the personal greeting
          ============================================================ */}
      <Reveal delay={0.05}>
        <MembersStatusStrip lead={lead} />
      </Reveal>

      {/* ============================================================
          Your courses
          ============================================================ */}
      <Reveal delay={0.1}>
      <section>
        <header className="mb-6 flex items-baseline justify-between gap-4 border-b border-au-charcoal/10 pb-4">
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
            Enrolled courses
          </p>
          <Link
            href="/members/courses"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors"
          >
            View all →
          </Link>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {activeMemberships.map((m) => {
            const course = getCourseByMembershipName(m.membership_name);
            const slug = course?.slug;
            return (
              <li
                key={m.membership_id}
                className="group bg-au-pink-soft/30 rounded-[4px] p-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.65rem] text-au-mid mb-1">
                      {m.level_name} · since {formatDate(m.granted_at)}
                    </p>
                    <h3 className="font-display font-black text-au-charcoal text-[1.125rem] leading-tight">
                      {m.membership_name}
                    </h3>
                  </div>
                  {slug && (
                    <CourseIllustrationFor
                      slug={slug}
                      className="shrink-0 w-12 h-12"
                    />
                  )}
                </div>
                {course?.summary && (
                  <p className="text-[0.9375rem] text-au-body leading-relaxed mb-4">
                    {course.summary}
                  </p>
                )}
                <Link
                  href={course ? courseHref(course.slug) : "/members/courses"}
                  className="font-section font-semibold uppercase tracking-[0.1em] text-[0.75rem] text-au-pink group-hover:text-au-charcoal transition-colors"
                >
                  Open course →
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      </Reveal>

      {/* ============================================================
          Recent purchases, clean two-line rows, no badge clutter,
          full-width single column. Refunds render with negative
          amount + REFUND label so the state still reads.
          ============================================================ */}
      <Reveal delay={0.1}>
        <section>
          <header className="mb-5 sm:mb-6 border-b border-au-charcoal/10 pb-4 flex items-baseline justify-between gap-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] sm:text-[0.7rem] text-au-mid">
              Recent purchases
            </p>
            <Link
              href="/members/billing"
              className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors"
            >
              Full history →
            </Link>
          </header>
          <ul>
            {recentTransactions.map((t) => {
              const isRefund = t.transaction_type === "refund";
              return (
                <li
                  key={t.id}
                  className="py-4 border-b border-au-charcoal/8 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1.5">
                    <h3 className="font-display font-bold text-au-charcoal text-[0.9375rem] sm:text-[1rem] leading-tight min-w-0 flex-1">
                      {t.product_name}
                    </h3>
                    <span
                      className={
                        "font-display font-black tabular-nums text-[1rem] sm:text-[1.0625rem] shrink-0 " +
                        (isRefund ? "text-au-mid" : "text-au-charcoal")
                      }
                    >
                      {formatGBP(t.amount_cents)}
                    </span>
                  </div>
                  <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid">
                    {formatDate(t.occurred_at)} ·{" "}
                    {isRefund
                      ? "Refund"
                      : t.transaction_type === "sale"
                        ? "Purchase"
                        : t.transaction_type}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </Reveal>

      {/* ============================================================
          Your tags (Kartra segmentation made visible to the user)
          ============================================================ */}
      <Reveal delay={0.15}>
        <section>
          <header className="mb-5 border-b border-au-charcoal/10 pb-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
              Your AU profile
            </p>
          </header>
          <ul className="flex flex-wrap gap-2">
            {lead.tags.map((tag) => (
              <li
                key={tag.tag_name}
                className="inline-flex items-center font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] px-3 py-1.5 rounded-[5px] bg-au-pink-soft/40 text-au-charcoal border border-au-pink/30"
              >
                {tag.tag_name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.8125rem] text-au-mid">
            {COURSES.length} courses in the catalogue · You hold{" "}
            {activeMemberships.length} ·{" "}
            <Link
              href="/members/courses"
              className="text-au-pink hover:text-au-charcoal transition-colors"
            >
              Browse what&apos;s next →
            </Link>
          </p>
        </section>
      </Reveal>

      {/* ============================================================
          Courses you might be interested in, restrained upsell at the
          bottom of the dashboard, never blocking, never modal.
          ============================================================ */}
      {recommendations.length > 0 && (
        <Reveal delay={0.2}>
        <section>
          <header className="mb-5 sm:mb-6 border-b border-au-charcoal/10 pb-4 flex items-baseline justify-between gap-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.65rem] sm:text-[0.7rem] text-au-mid">
              Courses you might like
            </p>
            <Link
              href="/members/courses"
              className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors"
            >
              View all →
            </Link>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {recommendations.map((c) => {
              const isFree = c.price === undefined;
              return (
                <li
                  key={c.slug}
                  className="group bg-au-white border border-au-charcoal/10 rounded-[4px] p-5 flex flex-col hover:border-au-pink transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CourseIllustrationFor
                      slug={c.slug}
                      className="shrink-0 w-10 h-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-section font-semibold uppercase tracking-[0.12em] text-[0.625rem] text-au-mid mb-1 leading-tight">
                        {c.category}
                        {c.availability === "waitlist" && " · Waitlist"}
                      </p>
                      <h3 className="font-display font-bold text-au-charcoal text-[1rem] leading-tight">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[0.875rem] text-au-body leading-relaxed mb-4 flex-1">
                    {c.summary}
                  </p>
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    {c.price === undefined ? (
                      <StartFreeCourseButton courseSlug={c.slug} />
                    ) : (
                      <Link
                        href={`/courses/${c.slug}`}
                        className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink group-hover:text-au-charcoal transition-colors"
                      >
                        Browse course →
                      </Link>
                    )}
                    {c.price === undefined ? (
                      <FreeBadge className="w-12 h-12 sm:w-14 sm:h-14" />
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
