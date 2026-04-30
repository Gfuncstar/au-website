/**
 * /courses — index of every AU course.
 *
 * Renders every course in lib/courses.ts as a CourseCard tile, grouped
 * by category (Free taster / Clinical / Regulatory / Business). The
 * catalogue is intentionally future-proof — adding a course to
 * lib/courses.ts is enough; nothing in this page hard-codes a count.
 *
 * Layout (mobile-first):
 *   1. Light hero — eyebrow + line-by-line headline + opener
 *   2. Tile grid (one per course, brand-colour cards, marks top-right)
 *   3. Final CTA
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAPoster } from "@/components/CTAPoster";
import { CoursesCatalog } from "@/components/CoursesCatalog";
import {
  NicheMark,
  TrafficLightMark,
  HexMark,
  BarrierMark,
  ProfitBarsMark,
} from "@/components/CourseMarks";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { COURSES } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Strategic education for UK aesthetic practitioners by Bernadette Tobin RN, MSc, free tasters, NICE-aligned clinical decoders, regulatory and business programmes. A growing catalogue from an Educator of the Year 2026 Nominee.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Courses, Aesthetics Unlocked®",
    description:
      "Every course, one framework. Free tasters, NICE-aligned clinical decoders, regulatory and business programmes, a growing catalogue.",
    url: "/courses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses, Aesthetics Unlocked®",
    description:
      "Strategic education for UK aesthetic practitioners by Bernadette Tobin RN, MSc, Educator of the Year 2026 Nominee.",
  },
};

/**
 * Mark lookup keyed by course slug. Lives here (not in lib/courses.ts) because
 * the marks are JSX components — keeping them out of the data file lets the
 * data layer stay free of React imports.
 */
const MARKS: Record<string, React.ReactNode> = {
  "free-3-day-startup": NicheMark,
  "free-2-day-rag": TrafficLightMark,
  "free-clinical-audit": TrafficLightMark,
  "free-acne-decoded": HexMark,
  "free-rosacea-beyond-redness": BarrierMark,
  "free-skin-specialist-mini": HexMark,
  "acne-decoded": HexMark,
  "rosacea-beyond-redness": BarrierMark,
  "skin-specialist-programme": HexMark,
  "rag-pathway": TrafficLightMark,
  "5k-formula": ProfitBarsMark,
};

export default function CoursesIndexPage() {
  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">The courses</Eyebrow>
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
              <Fragment key="0">Pick the course</Fragment>,
              <Fragment key="1">
                that fits{" "}
                <span style={{ color: "var(--color-au-pink)" }}>where you are</span>
                .
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              Free tasters to start. NICE-aligned clinical decoders. A 4-week
              regulatory pathway. A 12-week business programme. And more on
              the way as the catalogue grows. Built and taught by Bernadette
              Tobin RN, MSc, Educator of the Year 2026 Nominee.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            COURSE CATALOG, subject tabs + search + filtered grid
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <CoursesCatalog courses={COURSES} marks={MARKS} />
        </PosterBlock>

        {/* ============================================================
            CTA
            ============================================================ */}
        <CTAPoster
          eyebrow="Not sure where to start?"
          headline={
            <>
              Try the{" "}
              <span style={{ color: "var(--color-au-pink)" }}>free tasters</span>{" "}
              first.
            </>
          }
          buttonText="Get the 5K+ Mini"
          buttonHref="/courses/free-3-day-startup"
          tone="black"
        />
      </main>
      <Footer />
    </>
  );
}
