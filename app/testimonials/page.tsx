/**
 * /testimonials — what practitioners say.
 *
 * Single surface that consolidates every entry in lib/testimonials.ts.
 * Grouped by course so a visitor weighing one course over another can
 * see the relevant student voices side-by-side, then click straight
 * through to that course's sales page.
 *
 * Drives:
 *   - "Insights & answers → What practitioners say" in the burger menu
 *   - SEO surface for student-voice queries
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { CTAPoster } from "@/components/CTAPoster";
import { TESTIMONIALS } from "@/lib/testimonials";
import { COURSES, getCourse } from "@/lib/courses";
import { BRAND } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "Our reviews",
  description:
    "Aesthetics Unlocked reviews, grouped by course. What UK aesthetic nurses, doctors and clinic owners say about each programme by Bernadette Tobin RN MSc, Educator of the Year 2026 Nominee at the Beauty & Aesthetics Awards.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title:
      "Our reviews, Aesthetics Unlocked® · Educator of the Year 2026 Nominee",
    description:
      "What UK aesthetic practitioners say about each course by Educator of the Year 2026 Nominee Bernadette Tobin RN MSc.",
    url: "/testimonials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our reviews, Aesthetics Unlocked®",
    description:
      "What UK aesthetic practitioners say about each Aesthetics Unlocked course. By Educator of the Year 2026 Nominee Bernadette Tobin RN MSc.",
  },
};

export default function TestimonialsPage() {
  // Group testimonials by course slug, then walk COURSES in catalogue
  // order so the page reads like a tour of the catalogue. Drops courses
  // that have no testimonials yet so we never render an empty heading.
  const byCourse = new Map<string, typeof TESTIMONIALS>();
  for (const t of TESTIMONIALS) {
    const arr = byCourse.get(t.courseSlug);
    if (arr) {
      (arr as unknown as typeof TESTIMONIALS[number][]).push(t);
    } else {
      byCourse.set(t.courseSlug, [t] as unknown as typeof TESTIMONIALS);
    }
  }
  const groupedCourses = COURSES.filter((c) => byCourse.has(c.slug));
  const siteUrl = `https://${BRAND.domain}`;

  // Review-rich CollectionPage. Every published testimonial becomes a
  // structured Review attached to its Course, so the snippet can show
  // alongside individual course pages in search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/testimonials#page`,
    name: "Aesthetics Unlocked reviews",
    url: `${siteUrl}/testimonials`,
    description:
      "Reviews from UK aesthetic practitioners on each Aesthetics Unlocked course.",
    mainEntity: {
      "@type": "ItemList",
      name: "Practitioner reviews",
      numberOfItems: TESTIMONIALS.length,
      itemListElement: TESTIMONIALS.map((t, i) => {
        const course = getCourse(t.courseSlug);
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Review",
            reviewBody: t.quote,
            author: {
              "@type": "Person",
              name: t.name,
              jobTitle: t.role,
              ...(t.location ? { address: t.location } : {}),
            },
            itemReviewed: {
              "@type": "Course",
              name: course?.title ?? t.courseSlug,
              url: `${siteUrl}/courses/${t.courseSlug}`,
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: 5,
              bestRating: 5,
              worstRating: 1,
            },
          },
        };
      }),
    },
  };

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">From the cohort</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            as="h1"
            className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">What practitioners</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>say.</span>
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              Aesthetic nurses, doctors and clinic owners who took the
              work forward. Grouped by course so you can read what the
              cohort says about whichever programme you&apos;re weighing
              up, then go straight to the curriculum.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            GROUPED TESTIMONIALS, one block per course that has them.
            Each block: course title (linked) + the entries below.
            ============================================================ */}
        {groupedCourses.map((c, i) => {
          const items = byCourse.get(c.slug) ?? [];
          return (
            <PosterBlock
              key={c.slug}
              tone={i % 2 === 0 ? "white" : "cream"}
              contained
            >
              <ScrollReveal>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-8 sm:mb-10 max-w-5xl">
                  <div>
                    <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] text-[var(--color-au-pink)] mb-2">
                      On {c.category}{" "}
                      {c.price === undefined
                        ? "· Free"
                        : `· £${c.price.toLocaleString("en-GB")}`}
                    </p>
                    <h2
                      className="font-display font-black text-au-charcoal leading-[1.05]"
                      style={{
                        fontSize: "clamp(1.625rem, 4.5vw, 2.5rem)",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {c.title}
                    </h2>
                  </div>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.75rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors shrink-0"
                  >
                    See the course <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </ScrollReveal>

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl">
                {items.map((t, j) => (
                  <ScrollReveal key={t.id} delay={j * 0.06}>
                    <li
                      className="relative bg-au-white border border-au-charcoal/12 rounded-[5px] p-6 sm:p-7 h-full flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span
                          aria-hidden="true"
                          className="font-display font-black leading-none"
                          style={{
                            fontSize: "3.5rem",
                            color: "var(--color-au-pink)",
                          }}
                        >
                          &ldquo;
                        </span>
                        {/* 5-star review mark */}
                        <svg
                          viewBox="0 0 110 22"
                          role="img"
                          aria-label="Review"
                          className="shrink-0 w-[88px] sm:w-[96px] h-auto mt-2"
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
                        className="text-au-charcoal/85 font-serif italic leading-relaxed mb-6 flex-1"
                        style={{
                          fontFamily: "var(--font-spectral), serif",
                          fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
                        }}
                      >
                        {t.quote}
                      </blockquote>

                      <cite className="not-italic flex flex-col gap-0.5">
                        <span
                          className="font-display font-bold text-au-charcoal"
                          style={{
                            fontSize: "0.9375rem",
                            letterSpacing: "var(--tracking-tight-display)",
                          }}
                        >
                          {t.name}
                        </span>
                        <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] text-au-charcoal/65">
                          {t.role} · {t.location}
                        </span>
                      </cite>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
            </PosterBlock>
          );
        })}

        {/* ============================================================
            EMPTY STATE, only renders if there are zero testimonials in
            the catalogue (e.g. before any are seeded). Keeps the page
            from rendering as a blank canvas.
            ============================================================ */}
        {groupedCourses.length === 0 && (
          <PosterBlock tone="white" contained>
            <p className="max-w-xl text-au-charcoal/75 text-[1.0625rem] leading-relaxed">
              The first round of practitioner reviews is being collected
              now. Check back shortly, or{" "}
              <Link
                href="/courses"
                className="text-[var(--color-au-pink)] underline-offset-4 hover:underline"
              >
                browse the courses
              </Link>{" "}
              in the meantime.
            </p>
          </PosterBlock>
        )}

        {/* ============================================================
            CTA, back to the catalogue
            ============================================================ */}
        <CTAPoster
          eyebrow="Find your next course"
          headline={
            <>
              Pick the programme that fits{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                where you are.
              </span>
            </>
          }
          buttonText="Browse the courses"
          buttonHref="/courses"
          tone="black"
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
