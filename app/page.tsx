/**
 * Home page — Aesthetics Unlocked®
 *
 * Restructured per Giles' "homepage needs to introduce her, what she stands
 * for, what she does, her authority" call. Mobile-first.
 *
 * Flow:
 *   1. Hero — typographic poster + Bernadette video
 *   2. Meet Bernadette — authority block (NEW): portrait + bio + stat strip
 *   3. The framework — three pillars (black, parallax bg)
 *   4. This is for you if… (white)
 *   5. The courses — six cards, sourced from lib/courses.ts (white)
 *   6. Quote — Bernadette pull-quote (cream)
 *   7. Final CTA (solid black)
 *
 * Course copy + curriculum live in `lib/courses.ts` so this page stays a
 * structural document; copy iteration happens in one place.
 */

import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { QuotePoster } from "@/components/QuotePoster";
import { CTAPoster } from "@/components/CTAPoster";
import Link from "next/link";
import { CourseListCompact } from "@/components/CourseListCompact";
import { HeroAnimated } from "@/components/HeroAnimated";
import { ThreePillars } from "@/components/ThreePillars";
import { WhoThisIsFor } from "@/components/WhoThisIsFor";
import { MeetBernadette } from "@/components/MeetBernadette";
import { EducationalApproach } from "@/components/EducationalApproach";
import { StandardsStrip } from "@/components/StandardsStrip";
import { PressStrip } from "@/components/PressStrip";
import { BookSection } from "@/components/BookSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import {
  PillarsIllustration,
  AudienceIllustration,
  CoursesIllustration,
} from "@/components/SectionIllustration";
import { BRAND, AWARDS, PERSON_AWARDS_JSONLD } from "@/lib/credentials";
import { Fragment } from "react";

export const metadata: Metadata = {
  title:
    "Aesthetics Unlocked® — UK Aesthetics Education · Educator of the Year 2026 Nominee",
  description:
    "Where clinical confidence meets a business that actually works. The only UK education platform built and taught by a working clinician, NHS leader, and clinic owner — for practitioners who want to grow safely, ethically, and on their own terms.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `https://${BRAND.domain}/#organization`,
        name: BRAND.name,
        url: `https://${BRAND.domain}`,
        email: BRAND.email,
        award: AWARDS.find((a) => a.business === "Aesthetics Unlocked")?.long,
        founder: { "@id": `https://${BRAND.domain}/#person` },
      },
      {
        "@type": "Person",
        "@id": `https://${BRAND.domain}/#person`,
        name: "Bernadette Tobin",
        honorificSuffix: "RN, MSc",
        jobTitle: "Founder, Aesthetics Unlocked",
        worksFor: { "@id": `https://${BRAND.domain}/#organization` },
        award: PERSON_AWARDS_JSONLD,
      },
    ],
  };

  return (
    <>
      <Nav />
      {/* No top padding on main — the transparent nav floats over the
          full-bleed dark hero. */}
      <main>
        {/* ============================================================
            HERO — typographic editorial poster + Bernadette video bg.
            ============================================================ */}
        <HeroAnimated />

        {/* PressStrip removed per Giles' "remove" call — the trust signals
            (NMC PIN, RCN registration, MSc) now live exclusively in the
            Footer trust strip and the Nav drawer credential block. */}

        {/* ============================================================
            MEET BERNADETTE — authority section.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <MeetBernadette />
        </PosterBlock>

        {/* ============================================================
            THE BOOK — "She literally wrote the book on it."
            Surfaces Bernadette's published reference (Regulation to
            Reputation, Amazon UK) as a tangible authority signal.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <BookSection />
        </PosterBlock>

        {/* ============================================================
            HOW AU TEACHES — educational philosophy (NEW).
            Surfaces the mentor-not-enforcement teaching stance + the
            three principles every course is anchored to. Anchored with
            verbatim quotes from inside the actual courses.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <EducationalApproach />
        </PosterBlock>

        {/* ============================================================
            THE FRAMEWORK — three pillars, black poster with parallax.
            ============================================================ */}
        <PosterBlock
          tone="black"
          contained
          full
          bgImage="/backgrounds/pink-grunge-deep.png"
          bgOverlay={0.72}
        >
          {/* Pillars illustration — float-right so the eyebrow, headline
              lines, and intro paragraph wrap around it. Lives at the top
              of the section so it draws first as the user scrolls in. */}
          <PillarsIllustration
            className="float-right ml-4 sm:ml-6 -mt-1 w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] md:w-[152px] md:h-[152px]"
          />
          <ScrollReveal className="max-w-4xl mb-8">
            <Eyebrow color="pink">The framework</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-white mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">Three pillars.</Fragment>,
              <Fragment key="1">One framework that</Fragment>,
              <Fragment key="2">
                <span style={{ color: "var(--color-au-pink)" }}>holds up.</span>
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-white/85 leading-relaxed mb-12 sm:mb-14">
              At the regulator&rsquo;s office, the bank, and the consultation
              room. Three lenses every AU course teaches through —{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                clinical identity, regulatory safety, and profit & systems
              </span>
              .
            </p>
          </ScrollReveal>
          <ThreePillars />
        </PosterBlock>

        {/* ============================================================
            "THIS IS FOR YOU IF…" — audience qualification.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <WhoThisIsFor />
        </PosterBlock>

        {/* ============================================================
            COURSES — compact professional list (replaces the big card
            grid per Giles' "too big and too salesy for a landing page"
            call). The image-backed CourseCard grid lives on /courses
            where the marketing depth belongs.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          {/* Six course-card grid illustration — echo of the actual six
              courses listed below. */}
          <CoursesIllustration
            className="float-right ml-4 sm:ml-5 -mt-1 w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] md:w-[132px] md:h-[132px]"
          />
          <ScrollReveal className="max-w-3xl mb-10 sm:mb-12">
            <Eyebrow className="mb-6">The courses</Eyebrow>
            <RevealHeadline
              className="font-display font-black text-au-charcoal mb-6 sm:mb-7"
              style={{
                fontSize: "var(--text-poster)",
                lineHeight: "var(--leading-poster)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
              lines={[
                <Fragment key="0">Six courses.</Fragment>,
                <Fragment key="1">
                  One{" "}
                  <span style={{ color: "var(--color-au-pink)" }}>
                    framework
                  </span>
                  .
                </Fragment>,
              ]}
            />
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed">
              Two free tasters, two NICE-aligned clinical decoders, the 4-week
              regulatory pathway, and the 12-week business programme. Click
              any line for the full curriculum.
            </p>
          </ScrollReveal>

          <CourseListCompact />

          <ScrollReveal delay={0.4} className="mt-10 sm:mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors"
            >
              See all courses in detail{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            STANDARDS WE TEACH AGAINST — authority strip.
            Surfaces NICE, JCCP, MHRA, NMC, RCN, ASA, CPSA, CQC. Pulled
            verbatim from the AU course content (RAG 2-Day Module 2 in
            particular namedrops every relevant UK regulator).
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <StandardsStrip context="all" tone="light" />
        </PosterBlock>

        {/* ============================================================
            QUOTE — Bernadette pull-quote, cross-business signature line.
            ============================================================ */}
        <QuotePoster
          attribution="Bernadette Tobin RN, MSc"
          showSignature
        >
          The best aesthetic work is{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            the kind no one notices
          </span>
          . People should just{" "}
          <span style={{ color: "var(--color-au-pink)" }}>
            think you look well
          </span>
          .
        </QuotePoster>

        {/* ============================================================
            FINAL CTA — solid black, AU primary.
            ============================================================ */}
        <CTAPoster
          eyebrow="Ready when you are"
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
