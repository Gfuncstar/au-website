/**
 * /courses — index of every AU course.
 *
 * Lists all 5 courses using the same CourseCard pattern as the homepage,
 * grouped by category (Free taster / Clinical / Business). Each tile
 * links through to `/courses/[slug]` for the full sales page.
 *
 * Layout (mobile-first):
 *   1. Light hero — eyebrow + line-by-line headline + opener
 *   2. Tile grid (5 courses, brand-colour cards, marks in top-right)
 *   3. Final CTA
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAPoster } from "@/components/CTAPoster";
import { CourseCard } from "@/components/CourseCard";
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
  title: "Courses — Aesthetics Unlocked®",
  description:
    "All AU courses — free tasters, clinical (NICE-aligned), and the 12-week business programme. Education for UK aesthetic practitioners by Bernadette Tobin RN, MSc.",
};

/**
 * Mark lookup keyed by course slug. Lives here (not in lib/courses.ts) because
 * the marks are JSX components — keeping them out of the data file lets the
 * data layer stay free of React imports.
 */
const MARKS: Record<string, React.ReactNode> = {
  "free-3-day-startup": NicheMark,
  "free-2-day-rag": TrafficLightMark,
  "acne-decoded": HexMark,
  "rosacea-beyond-redness": BarrierMark,
  "5k-formula": ProfitBarsMark,
};

export default function CoursesIndexPage() {
  return (
    <>
      <Nav forceLight />
      <main className="pt-16 sm:pt-20">
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
              Five courses. Two free tasters, two NICE-aligned clinical
              decoders, and the 12-week business programme. Built and taught by
              Bernadette Tobin RN, MSc — Educator of the Year 2026 Nominee.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            COURSE GRID
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {COURSES.map((c, i) => {
              // Stats derived from the course data — duration / cadence /
              // price. Keeps the rail short and consistent across cards.
              const formatParts = c.format.split("·").map((s) => s.trim());
              const stats: string[] = [
                ...formatParts,
                c.price === undefined ? "Free" : `£${c.price.toLocaleString("en-GB")}`,
              ];
              return (
                <ScrollReveal key={c.slug} delay={i * 0.08}>
                  <CourseCard
                    tone={c.tone}
                    eyebrow={c.eyebrow}
                    title={c.title}
                    stats={stats}
                    bullets={c.bullets}
                    mark={MARKS[c.slug]}
                    href={`/courses/${c.slug}`}
                    ctaText={c.ctaText}
                    price={c.price}
                  />
                </ScrollReveal>
              );
            })}
          </div>
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
