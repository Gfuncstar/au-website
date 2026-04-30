/**
 * /for/[slug] — geo landing pages.
 *
 * Built per Giles' "geo landing pages" call. Backed by lib/locations.ts.
 * Eight pages live: four UK nations (England, Scotland, Wales, NI) plus
 * four cities (London, Manchester, Birmingham, Edinburgh).
 *
 * The point of these pages is *not* thin SEO bait — every one carries
 * tailored content about that location's regulatory landscape and
 * practitioner market. The nation pages in particular are unique
 * content because UK aesthetics regulation diverges by nation
 * (HIS / HIW / RQIA / CQC) and no UK aesthetics-education competitor
 * covers this comprehensively.
 *
 * Layout:
 *   1. Cream hero — eyebrow + headline + intro paragraph
 *   2. Regulators in [location] — strip + per-location notes
 *   3. Practitioner landscape — what's distinctive about practising here
 *   4. Recommended courses — CourseCard grid filtered by relatedCourseSlugs
 *   5. Final CTA — "Start with my courses"
 *
 * SEO:
 *   - JSON-LD: WebPage with `about: Place` (region + name) + Person
 *     (Bernadette as author) + BreadcrumbList
 *   - Per-page meta keywords pulled from the location's seoKeywords[]
 *   - Canonical to /for/[slug]
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
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
import { LOCATIONS, getLocation } from "@/lib/locations";
import { COURSES, getCourse } from "@/lib/courses";
import { getStandard } from "@/lib/standards";
import { BRAND, FOUNDER } from "@/lib/credentials";

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
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return { title: "Location not found" };

  const titleSuffix =
    location.kind === "nation"
      ? `Aesthetics regulation & education in ${location.name}`
      : `Aesthetics education for ${location.name} practitioners`;

  return {
    title: `${titleSuffix}, Aesthetics Unlocked®`,
    description: location.summary,
    alternates: { canonical: `/for/${location.slug}` },
    keywords: [...location.seoKeywords],
    openGraph: {
      title: `${titleSuffix}, Aesthetics Unlocked®`,
      description: location.summary,
      url: `/for/${location.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleSuffix}, Aesthetics Unlocked®`,
      description: location.summary,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const courses = location.relatedCourseSlugs
    .map((s) => getCourse(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const regulators = location.regulators
    .map((s) => getStandard(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const pageUrl = `https://${BRAND.domain}/for/${location.slug}`;
  const headlineLeadOut =
    location.kind === "nation"
      ? "regulation, decoded."
      : "practitioners.";
  const headlineEyebrow =
    location.kind === "nation"
      ? `For practitioners in ${location.name}`
      : `For ${location.name}`;

  // JSON-LD: WebPage about a Place + Author Person + Breadcrumb. Surfaces
  // each landing page as a real, geographically-anchored resource for
  // search engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${location.kind === "nation" ? "Aesthetics regulation in" : "Aesthetics education for"} ${location.name}`,
        description: location.summary,
        about: {
          "@type": "Place",
          name: location.name,
          containedInPlace: {
            "@type": "Country",
            name: "United Kingdom",
          },
          ...(location.kind === "city" && location.region !== "United Kingdom"
            ? {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: location.name,
                  addressRegion: location.region,
                  addressCountry: "GB",
                },
              }
            : {}),
        },
        author: {
          "@type": "Person",
          name: FOUNDER.fullName,
          jobTitle: "Founder, Aesthetics Unlocked",
          honorificSuffix: FOUNDER.shortCredentials,
        },
        publisher: {
          "@type": "Organization",
          name: BRAND.name,
          url: `https://${BRAND.domain}`,
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
            name: "For practitioners",
            item: `https://${BRAND.domain}/for`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: location.name,
            item: pageUrl,
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
            HERO, eyebrow + headline + intro.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">{location.eyebrow ?? headlineEyebrow}</Eyebrow>
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
              <Fragment key="0">{location.name}</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>
                  {headlineLeadOut}
                </span>
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              {location.intro}
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            REGULATORY NOTES, what differs here.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">Regulators in {location.name}</Eyebrow>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">
                  What I teach{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    against
                  </span>
                  .
                </Fragment>,
              ]}
            />
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed">
              The bodies that set the rules where you practise, and the points
              I flag in every course because they sit differently in {location.name}.
            </p>
          </ScrollReveal>

          {/* Regulator chips */}
          <ScrollReveal delay={0.1} className="mb-10 sm:mb-12">
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {regulators.map((r) => (
                <li
                  key={r.slug}
                  className="inline-flex items-baseline gap-2 px-3 py-2 border border-au-charcoal/15 rounded-[3px] text-au-charcoal/80"
                >
                  <span
                    className="font-display font-black"
                    style={{
                      fontSize: "0.875rem",
                      letterSpacing: "var(--tracking-tight-display)",
                      color: "var(--color-au-pink)",
                    }}
                  >
                    {r.abbrev}
                  </span>
                  <span className="text-[0.8125rem] sm:text-[0.875rem]">
                    {r.name}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Per-location regulatory notes */}
          <ScrollReveal delay={0.15}>
            <ul className="flex flex-col gap-5 sm:gap-6 max-w-3xl">
              {location.regulatoryNotes.map((note, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-5 items-baseline"
                >
                  <span
                    className="font-display font-black tabular-nums leading-none pt-[2px]"
                    style={{
                      fontSize: "1.125rem",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/80 leading-relaxed">
                    {note}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            PRACTITIONER LANDSCAPE.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">Practising in {location.name}</Eyebrow>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">
                  Where{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    you
                  </span>{" "}
                  sit.
                </Fragment>,
              ]}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ul className="flex flex-col gap-4 sm:gap-5 max-w-3xl">
              {location.practitionerLandscape.map((point, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 text-[1rem] sm:text-[1.0625rem] text-au-charcoal/85 leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="font-display font-black shrink-0 leading-none"
                    style={{
                      fontSize: "1.125rem",
                      color: "var(--color-au-pink)",
                    }}
                  >
                    +
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            RECOMMENDED COURSES, relevant for practitioners here.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-3xl mb-10 sm:mb-12">
            <Eyebrow className="mb-6">Where to start</Eyebrow>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">
                  My recommended path for{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    {location.name}
                  </span>
                  .
                </Fragment>,
              ]}
            />
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed">
              The courses I&rsquo;d steer you toward first, same content as
              the rest of the UK, but ordered for what {location.name}{" "}
              practitioners typically need most.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {courses.map((c) => (
              <CourseCard
                key={c.slug}
                eyebrow={c.eyebrow}
                title={c.title}
                bullets={[...c.bullets]}
                stats={[...c.stats]}
                price={c.price}
                ctaText={c.ctaText}
                tone={c.tone}
                href={`/courses/${c.slug}`}
                bgImage={c.bgImage}
                mark={COURSE_MARKS[c.slug]}
              />
            ))}
          </div>
        </PosterBlock>

        {/* ============================================================
            FINAL CTA.
            ============================================================ */}
        <CTAPoster
          eyebrow={`For ${location.name} practitioners`}
          headline={
            <>
              Compliance keeps you{" "}
              <span style={{ color: "var(--color-au-pink)" }}>legal</span>.
              <br />
              <span style={{ color: "var(--color-au-pink)" }}>Reputation</span>{" "}
              keeps you in business.
            </>
          }
          buttonText="Start with my courses"
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

void COURSES;
