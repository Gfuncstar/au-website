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
import { TestimonialStrip } from "@/components/TestimonialStrip";
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
      title: `${course.title} — Aesthetics Unlocked®`,
      description: course.summary,
      url: `/courses/${course.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} — Aesthetics Unlocked®`,
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
            HERO — cream, copy-led.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">
              {course.category} · {course.format}
              {isWaitlist && " · Waitlist"}
            </Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            as="h1"
            className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[<Fragment key="0">{course.title}</Fragment>]}
          />

          {/* Stat strip — duration / format / price. */}
          <ScrollReveal delay={0.1}>
            <dl className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mb-8 border-t border-au-charcoal/15 pt-5">
              {course.stats.map((stat) => (
                <div key={stat} className="flex flex-col">
                  <dt
                    className="font-display font-bold leading-none mb-1"
                    style={{
                      fontSize: "clamp(1rem, 2.4vw, 1.25rem)",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {stat}
                  </dt>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          {/* Promise — single-sentence answer to "why should I take
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
            <Button
              href={course.kartraUrl}
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
        </PosterBlock>

        {/* ============================================================
            WHAT WILL CHANGE FOR YOU — before → after rail.
            Surfaces the transformation high up so visitors see the
            outcome immediately, per Giles' "they need to see what's
            going to change for them pretty much instantly" call.
            ============================================================ */}
        {course.transformations && course.transformations.length > 0 && (
          <PosterBlock tone="white" contained>
            <ScrollReveal className="max-w-4xl">
              <Eyebrow className="mb-6">What will change for you</Eyebrow>
            </ScrollReveal>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">Where you are now</Fragment>,
                <Fragment key="1">
                  &rarr; where you&rsquo;ll{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>be</span>.
                </Fragment>,
              ]}
            />
            <Transformations transformations={course.transformations} />
          </PosterBlock>
        )}

        {/* ============================================================
            TESTIMONIALS — student voices for this specific course.
            Hidden when no testimonials exist for the slug.
            ⚠️ Currently uses PLACEHOLDER entries — see
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
            COURSE-VOICE QUOTE — pulled from inside the course itself.
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
            WHAT YOU'LL LEARN — outcome bullets.
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
            CURRICULUM — black poster, parallax bg, module ledger.
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
                    {/* Module topics — the scope without giving away the
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
            WHY BERNADETTE TEACHES THIS — per-course authority strip.
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
              I&rsquo;m Bernadette Tobin — RN, MSc.
            </h2>
            <p className="text-au-black/90 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] leading-relaxed mb-3 sm:mb-4 max-w-3xl font-bold">
              Advanced Nurse Practitioner. Senior Lecturer. Head of Clinical
              Workforce, NHS Trust. Founder of Visage Aesthetics — Best
              Non-Surgical Aesthetics Clinic 2026. Educator of the Year 2026
              Nominee.
            </p>
            <p className="text-au-black/85 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] leading-relaxed mb-8 max-w-3xl">
              {course.whyBernadette ??
                "Twenty years on the ward, twelve in aesthetics. Every framework I teach here has been tested under real fee pressure inside my own clinic — Visage Aesthetics, winner of Best Non-Surgical Aesthetics Clinic 2026 (Essex)."}
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
            WHAT'S INCLUDED — clear deliverables block. Built per the
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
            FAQ — course-specific questions and answers.
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
            STANDARDS WE TEACH AGAINST — context-aware authority strip.
            Clinical courses surface NICE/MHRA/NMC/RCN; regulatory courses
            surface JCCP/CPSA/MHRA/CQC/ASA; business surfaces ASA.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal>
            <StandardsStrip context={standardsContext} tone="light" />
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            QUOTE — Bernadette signature line (cream).
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
            FINAL ENROL CTA — solid black.
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
              <span style={{ color: "var(--color-au-pink)" }}>—</span>{" "}
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

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
