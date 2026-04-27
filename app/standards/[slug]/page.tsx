/**
 * /standards/[slug] — dedicated page per regulator / professional body.
 *
 * Built per Giles' "each one of them has its page and how aesthetics
 * unlocked works with the standards they teach against" call.
 *
 * Layout:
 *   1. Cream hero — abbreviation + full name + about paragraph
 *   2. What this body does — responsibilities (white)
 *   3. How AU teaches against it — methodology + courses (cream)
 *   4. Related courses — CourseCard tiles (white)
 *   5. Final CTA (solid black)
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { CTAPoster } from "@/components/CTAPoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { CourseCard } from "@/components/CourseCard";
import {
  NicheMark,
  TrafficLightMark,
  HexMark,
  BarrierMark,
  ProfitBarsMark,
} from "@/components/CourseMarks";
import { STANDARDS, getStandard, getRelatedCourses } from "@/lib/standards";
import { BRAND } from "@/lib/credentials";

const COURSE_MARKS: Record<string, React.ReactNode> = {
  "free-3-day-startup": NicheMark,
  "free-2-day-rag": TrafficLightMark,
  "acne-decoded": HexMark,
  "rosacea-beyond-redness": BarrierMark,
  "rag-pathway": TrafficLightMark,
  "5k-formula": ProfitBarsMark,
};

type Params = { slug: string };

export function generateStaticParams() {
  return STANDARDS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const standard = getStandard(slug);
  if (!standard) return { title: "Standard not found" };

  return {
    title: `${standard.abbrev} — ${standard.name}`,
    description: standard.what,
    alternates: { canonical: `/standards/${standard.slug}` },
    openGraph: {
      title: `${standard.abbrev} — ${standard.name}`,
      description: standard.what,
      url: `/standards/${standard.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${standard.abbrev} — ${standard.name}`,
      description: standard.what,
    },
  };
}

export default async function StandardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const standard = getStandard(slug);
  if (!standard) notFound();

  const relatedCourses = getRelatedCourses(standard);

  // JSON-LD — describes the regulator/professional body as a referenced
  // Organization plus a Breadcrumb (Home → Standards → [Body]). Boosts
  // E-E-A-T by surfacing the regulator AU is teaching against as a
  // first-class entity Google can resolve to its real Wikidata page.
  const standardUrl = `https://${BRAND.domain}/standards/${standard.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${standardUrl}#article`,
        headline: `${standard.abbrev} — ${standard.name}`,
        description: standard.what,
        url: standardUrl,
        author: {
          "@type": "Organization",
          name: BRAND.name,
          url: `https://${BRAND.domain}`,
        },
        about: {
          "@type": "Organization",
          name: standard.name,
          alternateName: standard.abbrev,
          url: standard.url,
        },
      },
      {
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
            name: "Standards",
            item: `https://${BRAND.domain}/standards`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: standard.abbrev,
            item: standardUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO — abbreviation as the giant poster headline.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">Standards we teach against</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            as="h1"
            className="font-display font-black text-au-charcoal mb-6 sm:mb-8"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">
                <span style={{ color: "var(--color-au-pink)" }}>
                  {standard.abbrev}
                </span>
                .
              </Fragment>,
              <Fragment key="1">{standard.name}.</Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-8">
              {standard.about}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25} className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href={standard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
            >
              {standard.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            WHAT THIS BODY DOES — responsibilities (white).
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">What {standard.abbrev} does</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">The actual</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>remit</span>.
              </Fragment>,
            ]}
          />
          <ul className="flex flex-col gap-5 sm:gap-6 max-w-3xl">
            {standard.responsibilities.map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <li className="flex gap-4 items-start">
                  <span
                    aria-hidden="true"
                    className="font-display font-black shrink-0 leading-none pt-1"
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
                    {r}
                  </span>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            HOW AU TEACHES AGAINST IT — cream poster.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">How I teach against it</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">Where {standard.abbrev}</Fragment>,
              <Fragment key="1">
                shows up in the{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  curriculum
                </span>
                .
              </Fragment>,
            ]}
          />
          <div className="max-w-3xl flex flex-col gap-6 sm:gap-7">
            {standard.howAU.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <p
                  className="text-au-charcoal/85 leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                >
                  {p}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </PosterBlock>

        {/* ============================================================
            RELATED COURSES — only render if there are any.
            ============================================================ */}
        {relatedCourses.length > 0 && (
          <PosterBlock tone="white" contained>
            <ScrollReveal className="max-w-4xl mb-10 sm:mb-12">
              <Eyebrow className="mb-6">
                AU courses that reference {standard.abbrev}
              </Eyebrow>
              <RevealHeadline
                className="font-display font-black text-au-charcoal"
                style={{
                  fontSize: "var(--text-poster)",
                  lineHeight: "var(--leading-poster)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
                lines={[
                  <Fragment key="0">Where to start</Fragment>,
                  <Fragment key="1">
                    <span style={{ color: "var(--color-au-pink)" }}>
                      learning
                    </span>
                    .
                  </Fragment>,
                ]}
              />
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {relatedCourses.map((c, i) => (
                <ScrollReveal key={c.slug} delay={i * 0.08}>
                  <CourseCard
                    tone={c.tone}
                    eyebrow={c.eyebrow}
                    title={c.title}
                    stats={c.stats}
                    bullets={c.bullets}
                    mark={COURSE_MARKS[c.slug]}
                    bgImage={c.bgImage}
                    href={`/courses/${c.slug}`}
                    ctaText={c.ctaText}
                    price={c.price}
                  />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4} className="mt-12">
              <Link
                href="/standards"
                className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
              >
                See all standards{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
          </PosterBlock>
        )}

        {/* ============================================================
            FINAL CTA
            ============================================================ */}
        <CTAPoster
          eyebrow="Education that holds up"
          headline={
            <>
              Compliance keeps you{" "}
              <span style={{ color: "var(--color-au-pink)" }}>legal</span>.
              <br />
              <span style={{ color: "var(--color-au-pink)" }}>Reputation</span>{" "}
              keeps you in business.
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

void Button;
