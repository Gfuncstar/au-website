/**
 * /courses/[slug] — individual course sales page.
 *
 * Restructured per Giles' "build individual courses pages, more
 * informative, structure flows better" call.
 *
 * Layout (mobile-first):
 *   1. Cream hero — category eyebrow + course title + body + price/CTA
 *   2. Course-voice quote — pulled from inside the course (course-content.md)
 *   3. What you'll learn — outcome bullets (white)
 *   4. Curriculum — module ledger with parallax bg (black)
 *   5. Who's teaching this — Bernadette strip (pink)
 *   6. Quote — Bernadette signature line (cream)
 *   7. Final enrol CTA — solid black
 *
 * Course-level Schema.org JSON-LD baked into <head>.
 * Waitlist courses swap "Enrol now" copy for "Join the waitlist".
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { CTAPoster } from "@/components/CTAPoster";
import { QuotePoster } from "@/components/QuotePoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { AwardsPanel } from "@/components/AwardsPanel";
import { StandardsStrip } from "@/components/StandardsStrip";
import { Transformations } from "@/components/Transformations";
import { FAQ } from "@/components/FAQ";
import { StickyEnrolBar } from "@/components/StickyEnrolBar";
import { LessonPreview } from "@/components/LessonPreview";
import { getPostsForCourse, formatPostDate, TOPIC_LABELS } from "@/lib/blog";
import {
  NicheMark,
  TrafficLightMark,
  HexMark,
  BarrierMark,
  ProfitBarsMark,
} from "@/components/CourseMarks";

/**
 * Slug → illustrated course mark, mirrored from the /courses index so a
 * visitor sees the same visual identity in the hero of the detail page
 * as they did on the catalogue tile they clicked. Falls back to
 * HexMark for any slug not explicitly listed.
 */
const HERO_MARKS: Record<string, React.ReactNode> = {
  "free-3-day-startup": NicheMark,
  "5k-formula": ProfitBarsMark,
  "free-2-day-rag": TrafficLightMark,
  "free-clinical-audit": TrafficLightMark,
  "rag-pathway": TrafficLightMark,
  "free-acne-decoded": HexMark,
  "acne-decoded": HexMark,
  "free-rosacea-beyond-redness": BarrierMark,
  "rosacea-beyond-redness": BarrierMark,
  "free-skin-specialist-mini": HexMark,
  "skin-specialist-programme": HexMark,
};
import { TestimonialStrip } from "@/components/TestimonialStrip";
import { OptInForm } from "@/components/OptInForm";
import { COURSES, getCourse } from "@/lib/courses";
import { BRAND, FOUNDER } from "@/lib/credentials";
import { getTestimonialsForCourse } from "@/lib/testimonials";

type Params = { slug: string };

/** Pre-render every course at build time. */
export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };

  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.title}, Aesthetics Unlocked®`,
      description: course.summary,
      url: `/courses/${course.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title}, Aesthetics Unlocked®`,
      description: course.summary,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const isWaitlist = course.availability === "waitlist";
  const courseTestimonials = getTestimonialsForCourse(course.slug);
  const relatedPosts = await getPostsForCourse(course.slug, 3);
  const priceLabel =
    course.price === undefined
      ? "Free"
      : `£${course.price.toLocaleString("en-GB")}`;

  // CTA copy varies by availability.
  const primaryCtaText = isWaitlist
    ? "Join the waitlist"
    : course.price === undefined
      ? "Get instant access"
      : "Enrol now";

  // StandardsStrip context — drives which regulators to surface.
  const standardsContext: "clinical" | "regulatory" | "business" =
    course.category === "Clinical"
      ? "clinical"
      : course.category === "Regulatory" || course.category === "Free taster"
        ? "regulatory"
        : "business";

  // Schema.org Course markup. Per seo-audit.md Tier 1 — every course
  // page surfaces Course schema with provider, instructor, offers
  // (price + currency + availability), courseMode, and hasCourseInstance.
  // FAQPage and BreadcrumbList graph nodes are bundled into the same
  // JSON-LD payload so the page emits one structured-data block.
  const courseUrl = `https://${BRAND.domain}/courses/${course.slug}`;
  const courseImage = course.bgImage
    ? `https://${BRAND.domain}${course.bgImage}`
    : undefined;

  const courseNode: Record<string, unknown> = {
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: course.title,
    description: course.summary,
    url: courseUrl,
    provider: {
      "@type": "Organization",
      name: BRAND.name,
      url: `https://${BRAND.domain}`,
    },
    instructor: {
      "@type": "Person",
      name: FOUNDER.fullName,
      jobTitle: "Founder, Aesthetics Unlocked",
      honorificSuffix: FOUNDER.shortCredentials,
    },
    offers: {
      "@type": "Offer",
      price: course.price ?? 0,
      priceCurrency: "GBP",
      availability: isWaitlist
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      url: courseUrl,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.format,
    },
  };
  if (courseImage) courseNode.image = courseImage;

  // Breadcrumb — Home → Courses → [Course title].
  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${BRAND.domain}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `https://${BRAND.domain}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.title,
        item: courseUrl,
      },
    ],
  };

  // FAQPage — only emitted when the course has its own faqs array.
  const faqNode = course.faqs && course.faqs.length > 0
    ? {
        "@type": "FAQPage",
        mainEntity: course.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // Product schema — emitted when the course has a public price (paid
  // self-paced courses like Acne Decoded). Surfaces the price in
  // Google product-rich-results.
  const productNode = course.price !== undefined && !isWaitlist
    ? {
        "@type": "Product",
        name: course.title,
        description: course.summary,
        url: courseUrl,
        ...(courseImage ? { image: courseImage } : {}),
        brand: { "@type": "Brand", name: BRAND.name },
        offers: {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: courseUrl,
        },
      }
    : null;

  // Review schema — emitted only for testimonials marked as non-
  // placeholder (i.e. real, consented student feedback). Placeholders
  // never appear in structured data so search engines never see them
  // as marketing claims, even if they're visible during staging.
  const reviewNodes = courseTestimonials
    .filter((t) => !t.placeholder)
    .map((t) => ({
      "@type": "Review",
      "@id": `${courseUrl}#review-${t.id}`,
      itemReviewed: { "@id": `${courseUrl}#course` },
      author: {
        "@type": "Person",
        name: t.name,
        ...(t.role ? { jobTitle: t.role } : {}),
      },
      reviewBody: t.quote,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      courseNode,
      breadcrumbNode,
      ...(faqNode ? [faqNode] : []),
      ...(productNode ? [productNode] : []),
      ...reviewNodes,
    ],
  };

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO, cream, copy-led. Illustrated course mark floats
            top-right of the headline so the visitor sees the same
            visual identity they clicked on /courses; the stat strip
            below the title sits in a charcoal panel so it reads as
            its own object on the cream surface.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          {(() => {
            const heroMark = HERO_MARKS[course.slug];
            return (
              <>
                {heroMark && (
                  <div
                    className="float-right ml-4 sm:ml-5 -mr-1 mt-1 sm:mt-2 w-[64px] h-[64px] sm:w-[112px] sm:h-[112px] md:w-[140px] md:h-[140px]"
                    style={{ color: "var(--color-au-pink)" }}
                    aria-hidden="true"
                  >
                    <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
                      {heroMark}
                    </div>
                  </div>
                )}
                <ScrollReveal className="max-w-4xl">
                  <Eyebrow className="mb-6">
                    {course.category} · {course.format}
                    {isWaitlist && " · Waitlist"}
                  </Eyebrow>
                </ScrollReveal>
                <RevealHeadline
                  as="h1"
                  className="font-display font-black text-au-charcoal mb-8 sm:mb-10 [text-wrap:balance]"
                  style={{
                    // Slightly smaller scale than var(--text-poster) so
                    // long course names ("The Skin Specialist™ Programme",
                    // "From Regulation to Reputation™ — The RAG Pathway")
                    // don't clip on mobile when the hero mark sits to
                    // the right.
                    fontSize: "clamp(2.125rem, 7.2vw, 4.5rem)",
                    lineHeight: "var(--leading-poster)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                  lines={[<Fragment key="0">{course.title}</Fragment>]}
                />
              </>
            );
          })()}

          {/* Course facts panel, every paid + free course shows the
              same shape: scope · pace · price (+ commitment when set).
              Each cell is a label/value pair so the eye lands on the
              metric type first, then the number. Stays on a charcoal
              card so it reads as its own object on the cream hero. */}
          <ScrollReveal delay={0.1}>
            {(() => {
              const factCells: { label: string; value: string }[] = [];
              // course.stats already contains short readable strings —
              // map them into label/value pairs by ordinal position so
              // the layout is consistent across courses.
              const STAT_LABELS = ["Scope", "Pace", "Price"] as const;
              course.stats.forEach((value, i) => {
                factCells.push({
                  label: STAT_LABELS[i] ?? "",
                  value,
                });
              });
              if (course.weeklyHours) {
                factCells.push({
                  label: "Commitment",
                  value: course.weeklyHours,
                });
              }
              const cols =
                factCells.length >= 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-3";
              const maxW = factCells.length >= 4 ? "max-w-2xl" : "max-w-md";
              return (
                <dl
                  className={`bg-au-charcoal text-au-white rounded-[5px] grid ${cols} ${maxW} mb-8 clear-both divide-x divide-y md:divide-y-0 divide-au-white/10 overflow-hidden`}
                >
                  {factCells.map((cell) => (
                    <div
                      key={cell.label || cell.value}
                      className="flex flex-col gap-1 px-4 sm:px-5 py-3.5 sm:py-4 first:border-l-0"
                    >
                      <dt
                        className="font-section font-semibold uppercase tracking-[0.16em] text-[0.6rem] sm:text-[0.625rem] text-au-white/55 leading-none"
                      >
                        {cell.label}
                      </dt>
                      <dd
                        className="font-display font-bold leading-tight"
                        style={{
                          fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                          color: "var(--color-au-pink)",
                          letterSpacing: "var(--tracking-tight-display)",
                        }}
                      >
                        {cell.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              );
            })()}
          </ScrollReveal>

          {/* Promise, single-sentence answer to "why should I take
              this?" surfaced immediately under the hero so the visitor
              sees the outcome before the body copy. */}
          {course.promise && (
            <ScrollReveal delay={0.18}>
              <p
                className="max-w-2xl font-display font-black text-au-charcoal mb-6 leading-tight"
                style={{
                  fontSize: "clamp(1.125rem, 2.6vw, 1.5rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                <span style={{ color: "var(--color-au-pink)" }}>The promise.</span>{" "}
                {course.promise}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={0.22}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-8">
              {course.body}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3} className="flex flex-wrap gap-3 sm:gap-4">
            {/* Free tasters get a native AU-styled OptInForm rendered
                below; their primary "Get instant access" button just
                anchors down to it. Paid + waitlist courses still link
                to Kartra (course.kartraUrl) until Phase 5 wires Stripe. */}
            <Button
              href={
                course.price === undefined && !isWaitlist
                  ? "#opt-in"
                  : course.kartraUrl
              }
              variant="pink"
              size="sm"
              price={course.price}
            >
              {primaryCtaText}
            </Button>
            <Button href="#curriculum" variant="black" size="sm">
              See curriculum
            </Button>
          </ScrollReveal>

          {/* Reassurance grid, three calm tick rows that frame the
              click moment. Renders as a clean 3-column band on tablet+
              and a stacked tick list on mobile so the items have room
              to breathe. CPD chip drops below as its own labelled
              row. Paid courses only. */}
          {course.price !== undefined && !isWaitlist && (
            <ScrollReveal delay={0.34}>
              <div className="mt-6 sm:mt-7 max-w-2xl bg-au-white/60 border border-au-charcoal/10 rounded-[5px] p-4 sm:p-5">
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      title: "Lifetime access",
                      sub: "Self-paced, no expiry.",
                    },
                    {
                      title: "Updates included",
                      sub: "As guidance evolves.",
                    },
                    {
                      title: "Yours to keep",
                      sub: "One-off payment, no rebill.",
                    },
                  ].map((item) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-[3px] text-au-white mt-0.5"
                        style={{
                          backgroundColor: "var(--color-au-pink)",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="5 12 10 17 19 7" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-au-charcoal leading-tight text-[0.9375rem] sm:text-[1rem]">
                          {item.title}
                        </p>
                        <p className="text-[0.8125rem] sm:text-[0.8125rem] text-au-charcoal/65 leading-snug">
                          {item.sub}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {course.isCpdEvidence && (
                  <div className="mt-4 pt-4 border-t border-au-charcoal/10 flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-[3px] text-au-white mt-0.5"
                      style={{
                        backgroundColor: "var(--color-au-pink)",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="5 12 10 17 19 7" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-au-charcoal leading-tight text-[0.9375rem] sm:text-[1rem]">
                        CPD evidence · NMC revalidation
                      </p>
                      <p className="text-[0.8125rem] text-au-charcoal/65 leading-snug">
                        Certificate of Completion at the end. Suitable as
                        reflective practice for revalidation portfolios.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Single relevant testimonial, paid + waitlist courses
              that have a course-specific testimonial in
              lib/testimonials.ts. Renders directly under the
              reassurance row so the moment of decision sees a peer
              voice. Free tasters skip this, they have the opt-in
              form below. */}
          {course.price !== undefined &&
            courseTestimonials.length > 0 && (
              <ScrollReveal delay={0.4}>
                <figure className="mt-7 sm:mt-9 max-w-2xl bg-au-white border border-au-charcoal/12 rounded-[5px] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      aria-hidden="true"
                      className="font-display font-black leading-none"
                      style={{
                        fontSize: "2.5rem",
                        color: "var(--color-au-pink)",
                      }}
                    >
                      &ldquo;
                    </span>
                    <svg
                      viewBox="0 0 110 22"
                      role="img"
                      aria-label="5 star review"
                      className="shrink-0 w-[72px] h-auto mt-2"
                      style={{ color: "var(--color-au-pink)" }}
                    >
                      {[0, 22, 44, 66, 88].map((x) => (
                        <polygon
                          key={x}
                          points="11,2 13.4,8 19.8,8.6 14.9,12.9 16.4,19.2 11,15.8 5.6,19.2 7.1,12.9 2.2,8.6 8.6,8"
                          transform={`translate(${x}, 0)`}
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="0.6"
                          strokeLinejoin="round"
                        />
                      ))}
                    </svg>
                  </div>
                  <blockquote
                    className="text-au-charcoal/85 font-serif italic leading-relaxed mb-3"
                    style={{
                      fontFamily: "var(--font-spectral), serif",
                      fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
                    }}
                  >
                    {courseTestimonials[0].quote}
                  </blockquote>
                  <figcaption className="not-italic flex items-center gap-2 text-[0.75rem] sm:text-[0.8125rem]">
                    <span className="font-display font-bold text-au-charcoal">
                      {courseTestimonials[0].name}
                    </span>
                    <span className="text-au-charcoal/55">
                      · {courseTestimonials[0].role} ·{" "}
                      {courseTestimonials[0].location}
                    </span>
                  </figcaption>
                </figure>
              </ScrollReveal>
            )}

          {/* Value anchor, concrete, defensible context for the
              higher-priced courses. Reads as a proper section break
              with its own subhead so it carries weight rather than
              feeling like footnote text. */}
          {course.valueAnchor && course.valueAnchor.length > 0 && (
            <ScrollReveal delay={0.46}>
              <aside className="mt-9 sm:mt-12 max-w-2xl border-t border-au-charcoal/15 pt-7 sm:pt-8">
                <p
                  className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] mb-3"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  For context
                </p>
                <h3
                  className="font-display font-black text-au-charcoal mb-5 sm:mb-6 leading-[1.1]"
                  style={{
                    fontSize: "clamp(1.25rem, 3.2vw, 1.625rem)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  What this price actually buys.
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {course.valueAnchor.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 sm:gap-4 text-au-charcoal/85 leading-relaxed text-[0.9375rem] sm:text-[1rem]"
                    >
                      <span
                        aria-hidden="true"
                        className="shrink-0 mt-1 font-display font-black tabular-nums"
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-au-pink)",
                          letterSpacing:
                            "var(--tracking-tight-display)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </ScrollReveal>
          )}

          {/* ============================================================
              NATIVE OPT-IN FORM, only for free tasters. Posts to
              /api/subscribe which forwards to Kartra. User never sees
              a Kartra page; existing Kartra automation still fires.
              ============================================================ */}
          {course.price === undefined && !isWaitlist && (
            <ScrollReveal delay={0.4} className="mt-10 sm:mt-12">
              <div id="opt-in" className="scroll-mt-24">
                <p
                  className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-3"
                  style={{ color: "var(--color-au-pink)" }}
                >
                  Free instant access
                </p>
                <h2
                  className="font-display font-black text-au-charcoal mb-6"
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                    lineHeight: 1.1,
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  Tell me where to send it.
                </h2>
                <OptInForm
                  courseSlug={course.slug}
                  courseTitle={course.title}
                  submitLabel="Get instant access"
                />
              </div>
            </ScrollReveal>
          )}
        </PosterBlock>

        {/* ============================================================
            WHAT WILL CHANGE FOR YOU, before → after rail.
            Surfaces the transformation high up so visitors see the
            outcome immediately, per Giles' "they need to see what's
            going to change for them pretty much instantly" call.
            ============================================================ */}
        {course.transformations && course.transformations.length > 0 && (
          <PosterBlock tone="white" contained>
            <ScrollReveal className="max-w-4xl">
              <Eyebrow className="mb-6">The transformation</Eyebrow>
            </ScrollReveal>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">Before the course</Fragment>,
                <Fragment key="1">
                  <span style={{ color: "var(--color-au-pink)" }}>
                    &rarr; after the course.
                  </span>
                </Fragment>,
              ]}
            />
            <Transformations transformations={course.transformations} />
          </PosterBlock>
        )}

        {/* ============================================================
            TESTIMONIALS, student voices for this specific course.
            Hidden when no testimonials exist for the slug.
            ⚠️ Currently uses PLACEHOLDER entries, see
            lib/testimonials.ts for replacement protocol.
            ============================================================ */}
        {courseTestimonials.length > 0 && (
          <PosterBlock tone="white" contained>
            <TestimonialStrip
              testimonials={courseTestimonials}
              eyebrow={`From ${course.title} students`}
              headline={
                <>
                  What practitioners{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    take away
                  </span>
                  .
                </>
              }
              tone="white"
            />
          </PosterBlock>
        )}

        {/* ============================================================
            COURSE-VOICE QUOTE, pulled from inside the course itself.
            ============================================================ */}
        {course.voiceQuote && (
          <QuotePoster
            attribution="From inside the course"
            showSignature={false}
            tone="cream"
          >
            {course.voiceQuote}
          </QuotePoster>
        )}

        {/* ============================================================
            INSIDE THE LESSON, preview of the native lesson player so
            paid-course visitors can see what the inside-the-portal
            experience looks like before they enrol. Hidden on free
            tasters (they preview the work natively via the opt-in).
            ============================================================ */}
        {course.price !== undefined && !isWaitlist && (
          <PosterBlock tone="cream" contained>
            <LessonPreview courseTitle={course.title} />
          </PosterBlock>
        )}

        {/* ============================================================
            WHAT YOU'LL LEARN, outcome bullets.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">What you&rsquo;ll learn</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">The outcomes,</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>not just</span>{" "}
                the topics.
              </Fragment>,
            ]}
          />
          <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl">
            {course.bullets.map((b, i) => (
              <ScrollReveal key={b} delay={i * 0.06}>
                <li className="flex gap-4 items-start">
                  <span
                    aria-hidden="true"
                    className="font-display font-black shrink-0 leading-none"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--color-au-pink)",
                    }}
                  >
                    +
                  </span>
                  <span
                    className="text-au-charcoal leading-relaxed"
                    style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                  >
                    {b}
                  </span>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            CURRICULUM, black poster, parallax bg, module ledger.
            ============================================================ */}
        <PosterBlock
          tone="black"
          contained
          full
          id="curriculum"
          bgImage="/backgrounds/pink-grunge-deep.png"
          bgOverlay={0.72}
        >
          <ScrollReveal className="max-w-4xl mb-10 sm:mb-12">
            <Eyebrow color="pink">The curriculum</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-white mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">{course.modules.length} modules.</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>Built to</span>{" "}
                ship change.
              </Fragment>,
            ]}
          />
          <ul className="flex flex-col gap-7 sm:gap-9 max-w-3xl">
            {course.modules.map((m, i) => (
              <ScrollReveal key={m.num} delay={i * 0.06}>
                <li className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-9 items-start">
                  <div className="flex flex-col items-start gap-2 pt-1">
                    <span
                      className="font-display font-black leading-none"
                      style={{
                        fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                        color: "var(--color-au-pink)",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {m.num}
                    </span>
                    <span
                      aria-hidden="true"
                      className="block h-[2px] w-11"
                      style={{ backgroundColor: "var(--color-au-pink)" }}
                    />
                  </div>
                  <div>
                    <h3
                      className="leading-tight mb-2"
                      style={{
                        fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                        color: "var(--color-au-pink)",
                      }}
                    >
                      {m.title}
                    </h3>
                    <p
                      className="text-au-white/75 leading-relaxed mb-4"
                      style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                    >
                      {m.body}
                    </p>
                    {/* Module topics, the scope without giving away the
                        actual answers. Surfaces clinical depth so visitors
                        see what's covered before they pay. */}
                    {m.topics && m.topics.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 font-section font-semibold uppercase tracking-[0.15em] text-[0.625rem] sm:text-[0.6875rem] text-au-white/55">
                        {m.topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex items-baseline gap-2"
                          >
                            <span aria-hidden="true">+</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            WHY BERNADETTE TEACHES THIS, per-course authority strip.
            Specific paragraph anchoring her authority for THIS topic
            (not a generic about-the-founder block). Awards strip below
            keeps the credentials front and centre.
            ============================================================ */}
        <PosterBlock tone="pink" contained>
          <ScrollReveal>
            <Eyebrow color="black" className="mb-6">
              Why I teach this
            </Eyebrow>
            <h2
              className="font-display font-black text-au-black mb-4 sm:mb-5"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                letterSpacing: "var(--tracking-tight-display)",
                lineHeight: 1.1,
              }}
            >
              I&rsquo;m Bernadette Tobin, RN, MSc.
            </h2>
            <p className="text-au-black/90 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] leading-relaxed mb-3 sm:mb-4 max-w-3xl font-bold">
              Advanced Nurse Practitioner. Senior Lecturer. Head of Clinical
              Workforce, NHS Trust. Founder of Visage Aesthetics, Best
              Non-Surgical Aesthetics Clinic 2026. Educator of the Year 2026
              Nominee.
            </p>
            <p className="text-au-black/85 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] leading-relaxed mb-8 max-w-3xl">
              {course.whyBernadette ??
                "Twenty years on the ward, twelve in aesthetics. Every framework I teach here has been tested under real fee pressure inside my own clinic, Visage Aesthetics, winner of Best Non-Surgical Aesthetics Clinic 2026 (Essex)."}
            </p>
            <AwardsPanel variant="compact" tone="pink" />
            <div className="mt-8">
              <Button href="/about" variant="black" size="sm">
                Read more about Bernadette
              </Button>
            </div>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            WHAT'S INCLUDED, clear deliverables block. Built per the
            full-site review: practitioners deciding on a paid course
            want to see exactly what they get for their money.
            ============================================================ */}
        {course.includes && course.includes.length > 0 && (
          <PosterBlock tone="white" contained>
            <ScrollReveal className="max-w-4xl">
              <Eyebrow className="mb-6">What&rsquo;s included</Eyebrow>
            </ScrollReveal>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">Everything that</Fragment>,
                <Fragment key="1">
                  comes with{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    enrolment
                  </span>
                  .
                </Fragment>,
              ]}
            />
            <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-5 max-w-3xl">
              {course.includes.map((item, i) => (
                <ScrollReveal key={item} delay={i * 0.05}>
                  <li className="flex gap-3 items-start">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-au-pink)] text-au-black shrink-0 mt-0.5"
                      style={{ fontSize: "0.6875rem" }}
                    >
                      ✓
                    </span>
                    <span
                      className="text-au-charcoal leading-relaxed"
                      style={{ fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)" }}
                    >
                      {item}
                    </span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </PosterBlock>
        )}

        {/* ============================================================
            FAQ, course-specific questions and answers.
            ============================================================ */}
        {course.faqs && course.faqs.length > 0 && (
          <PosterBlock tone="cream" contained>
            <ScrollReveal className="max-w-4xl mb-8 sm:mb-10">
              <Eyebrow className="mb-6">Frequently asked</Eyebrow>
              <RevealHeadline
                className="font-display font-black text-au-charcoal"
                style={{
                  fontSize: "var(--text-poster)",
                  lineHeight: "var(--leading-poster)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
                lines={[
                  <Fragment key="0">Before you</Fragment>,
                  <Fragment key="1">
                    <span style={{ color: "var(--color-au-pink)" }}>
                      enrol
                    </span>
                    .
                  </Fragment>,
                ]}
              />
            </ScrollReveal>
            <div className="max-w-3xl">
              <FAQ items={course.faqs} />
            </div>
          </PosterBlock>
        )}

        {/* ============================================================
            STANDARDS WE TEACH AGAINST, context-aware authority strip.
            Clinical courses surface NICE/MHRA/NMC/RCN; regulatory courses
            surface JCCP/CPSA/MHRA/CQC/ASA; business surfaces ASA.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal>
            <StandardsStrip context={standardsContext} tone="light" />
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            QUOTE, Bernadette signature line (cream).
            ============================================================ */}
        <QuotePoster
          attribution={`${FOUNDER.fullName} ${FOUNDER.shortCredentials}`}
          showSignature
        >
          {course.category === "Regulatory" || course.slug === "free-2-day-rag" ? (
            <>
              Compliance gets you{" "}
              <span style={{ color: "var(--color-au-pink)" }}>open</span>.{" "}
              <span style={{ color: "var(--color-au-pink)" }}>Reputation</span>{" "}
              keeps you in business.
            </>
          ) : (
            <>
              The best aesthetic work is{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                the kind no one notices
              </span>
              . People should just{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                think you look well
              </span>
              .
            </>
          )}
        </QuotePoster>

        {/* ============================================================
            RELATED READING, surfaces blog posts whose topic relates
            to this course, so practitioners reading the curriculum
            can dip into supporting analysis without going hunting.
            Hidden when there are no relevant posts.
            ============================================================ */}
        {relatedPosts.length > 0 && (
          <PosterBlock tone="white" contained>
            <ScrollReveal className="max-w-3xl mb-8 sm:mb-10">
              <Eyebrow className="mb-5">Related reading</Eyebrow>
              <h2
                className="font-display font-black text-au-charcoal leading-[1.05]"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                From the journal,{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  on this topic.
                </span>
              </h2>
            </ScrollReveal>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl">
              {relatedPosts.map((p, i) => (
                <ScrollReveal key={p.slug} delay={i * 0.06}>
                  <li className="h-full">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block h-full bg-au-white border border-au-charcoal/12 rounded-[5px] p-5 sm:p-6 hover:border-[var(--color-au-pink)]/40 transition-colors"
                    >
                      <p
                        className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-3"
                        style={{ color: "var(--color-au-pink)" }}
                      >
                        {TOPIC_LABELS[p.topic]} ·{" "}
                        {formatPostDate(p.date)}
                      </p>
                      <h3
                        className="font-display font-bold text-au-charcoal leading-tight mb-3 group-hover:text-[var(--color-au-pink)] transition-colors"
                        style={{
                          fontSize: "1.0625rem",
                          letterSpacing:
                            "var(--tracking-tight-display)",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-[0.875rem] sm:text-[0.9375rem] text-au-charcoal/70 leading-relaxed line-clamp-3">
                        {p.excerpt}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 mt-4 text-[0.6875rem] font-section font-semibold uppercase tracking-[0.18em]"
                        style={{ color: "var(--color-au-pink)" }}
                      >
                        Read in {p.readingTimeMinutes} min{" "}
                        <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
            <ScrollReveal delay={0.3}>
              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
              >
                Browse the journal <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
          </PosterBlock>
        )}

        {/* ============================================================
            FINAL ENROL CTA, solid black.
            ============================================================ */}
        <CTAPoster
          eyebrow={
            isWaitlist
              ? "Doors aren't open yet"
              : course.price === undefined
                ? "Free instant access"
                : "Ready to enrol?"
          }
          headline={
            <>
              {course.title}{" "}
              <span style={{ color: "var(--color-au-pink)" }}>, </span>{" "}
              {priceLabel}
            </>
          }
          buttonText={primaryCtaText}
          buttonHref={course.kartraUrl}
          buttonPrice={course.price}
          tone="black"
        />
      </main>
      <Footer />

      {/* Mobile-only sticky enrol bar, keeps the price/CTA in
          eyeline once the hero scrolls out. Hidden on md+. */}
      <StickyEnrolBar
        title={course.title}
        price={course.price}
        href={
          course.price === undefined && !isWaitlist
            ? "#opt-in"
            : course.kartraUrl
        }
        ctaText={primaryCtaText}
        isWaitlist={isWaitlist}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
