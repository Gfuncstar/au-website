/**
 * /regulation — pillar page for UK aesthetics regulation.
 *
 * Built per the competitor-research recommendation: no UK aesthetics-
 * education brand owns the topic-level "UK aesthetics regulation"
 * query comprehensively. /standards covers each regulator individually;
 * /for/[slug] covers each location individually; /regulation sits ABOVE
 * both as the canonical landing page for the topic itself.
 *
 * The intent: a practitioner Googling "UK aesthetics regulation" lands
 * here, gets the lay of the land in 90 seconds, then clicks through to
 * the right deeper resource — a specific regulator (/standards/[slug]),
 * their nation (/for/[nation]), or the relevant course.
 *
 * Voice: first person, Bernadette speaking. Quietly upsell the courses
 * via "where I'd start" recommendations.
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { CTAPoster } from "@/components/CTAPoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { STANDARDS } from "@/lib/standards";
import { LOCATIONS, getLocationsByKind } from "@/lib/locations";
import { BRAND, FOUNDER } from "@/lib/credentials";
import { TESTIMONIALS } from "@/lib/testimonials";
import { TestimonialQuote } from "@/components/TestimonialQuote";

export const metadata: Metadata = {
  title:
    "UK aesthetics regulation 2026, JCCP, MHRA, CQC, licensing, decoded",
  description:
    "A clear UK aesthetics regulation guide for practitioners by Bernadette Tobin RN, MSc, the licensing scheme, JCCP / CPSA / MHRA / CQC / NICE / NMC / RCN / ASA, devolved nation rules, and where to start. Educator of the Year 2026 Nominee.",
  alternates: { canonical: "/regulation" },
  keywords: [
    "UK aesthetics regulation",
    "aesthetics regulation 2026",
    "aesthetics licensing scheme England",
    "JCCP-aligned training",
    "CPSA aesthetics standards",
    "MHRA aesthetics",
    "CQC aesthetic clinic",
    "NICE aesthetics",
    "NMC aesthetics",
    "Health and Care Act aesthetics",
    "aesthetics regulation course UK",
    "aesthetic practitioner compliance UK",
  ],
  openGraph: {
    title:
      "UK aesthetics regulation 2026, decoded by Bernadette Tobin RN, MSc",
    description:
      "The licensing scheme, the eight regulators, the devolved-nation rules, and where to start. A clear UK aesthetics regulation guide by an Educator of the Year 2026 Nominee.",
    url: "/regulation",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "UK aesthetics regulation 2026, decoded",
    description:
      "JCCP, CPSA, MHRA, CQC, NICE, NMC, RCN, ASA, and the licensing scheme. The map, in one place. By Bernadette Tobin RN, MSc.",
  },
};

const TOC = [
  { href: "#landscape", label: "The landscape, why it's tangled" },
  { href: "#licensing-scheme", label: "England's licensing scheme" },
  { href: "#regulators", label: "The eight regulators" },
  { href: "#devolved", label: "Devolved nation differences" },
  { href: "#where-to-start", label: "Where I'd start" },
];

// Two-line intro per regulator, written in first person. Pulled out of
// the standards lib's longer `about` field so this page reads as a
// topic guide, not a duplicate of /standards.
const REG_INTRO: Record<string, string> = {
  jccp:
    "The voluntary register and competence framework most insurers and complaint reviewers already work to. If you're not on it, the question is why.",
  cpsa:
    "The body that publishes the standards JCCP enforces. The most important regulator nobody talks about.",
  mhra:
    "Owns the medicines side. If you supply a Schedule 4 / POM, you live under MHRA. Most unintentional breaches I see are here.",
  cqc:
    "Regulates independent clinics in England that meet the regulated-activity thresholds. Many pure-aesthetics clinics don't register; many should.",
  nice:
    "Sets the evidence-based clinical guidance the NHS uses. Every clinical course I teach is built on the NICE pathway.",
  nmc:
    "My statutory regulator as a nurse. Verifiable on the public register. The credibility floor of any nurse-led clinic.",
  rcn:
    "Sets the professional guidance I follow as an Advanced Nurse Practitioner. The clinical-conduct backbone of my courses.",
  asa:
    "Polices what aesthetic practitioners can claim in marketing. Most enforcement in 2026 starts on Instagram, not in clinic.",
};

export default function RegulationPage() {
  const nations = getLocationsByKind("nation");
  const pageUrl = `https://${BRAND.domain}/regulation`;

  // JSON-LD — Article + Person author + Breadcrumb. Adds an `about`
  // mainEntity referencing the regulators so search engines link this
  // page topically to each body.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline:
          "UK aesthetics regulation 2026, JCCP, MHRA, CQC, licensing, decoded",
        description:
          "A clear UK aesthetics regulation guide for practitioners, the licensing scheme, the eight regulators, devolved-nation differences, and where to start.",
        url: pageUrl,
        author: {
          "@type": "Person",
          "@id": `https://${BRAND.domain}/#person`,
          name: FOUNDER.fullName,
          honorificSuffix: FOUNDER.shortCredentials,
          jobTitle: "Founder, Aesthetics Unlocked",
        },
        publisher: {
          "@type": "Organization",
          name: BRAND.name,
          url: `https://${BRAND.domain}`,
        },
        about: STANDARDS.map((s) => ({
          "@type": "Organization",
          name: s.name,
          alternateName: s.abbrev,
          url: s.url,
        })),
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
            name: "UK aesthetics regulation",
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
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">UK Aesthetics Regulation</Eyebrow>
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
              <Fragment key="0">UK aesthetics</Fragment>,
              <Fragment key="1">
                regulation,{" "}
                <span style={{ color: "var(--color-au-pink)" }}>decoded</span>.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-6">
              I teach this for a living and I&rsquo;ve still spent twelve
              years untangling it. Eight bodies, four UK nations, and the
              new licensing scheme arriving in stages. This is the layout.
              Where you sit on it depends on your registration, your
              services, and your nation, I&rsquo;ve flagged each below.
            </p>
            <p className="max-w-2xl text-[0.9375rem] sm:text-[1rem] text-au-charcoal/70 leading-relaxed mb-8">
              Authored by{" "}
              <Link
                href="/about"
                className="underline decoration-[var(--color-au-pink)] underline-offset-4 hover:text-[var(--color-au-pink)] transition-colors"
              >
                Bernadette Tobin RN, MSc
              </Link>
              , Educator of the Year 2026 Nominee · Founder of Visage
              Aesthetics, Best Non-Surgical Aesthetics Clinic 2026 (Essex).
            </p>
          </ScrollReveal>

          {/* TOC */}
          <ScrollReveal delay={0.25}>
            <nav aria-label="On this page" className="max-w-2xl">
              <p
                className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-3"
                style={{ color: "var(--color-au-pink)" }}
              >
                On this page
              </p>
              <ul className="flex flex-col gap-2">
                {TOC.map((t) => (
                  <li key={t.href}>
                    <a
                      href={t.href}
                      className="font-section font-semibold text-[0.875rem] text-au-charcoal/85 hover:text-[var(--color-au-pink)] transition-colors"
                    >
                      → {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            THE LANDSCAPE
            ============================================================ */}
        <PosterBlock tone="white" contained id="landscape">
          <ScrollReveal className="max-w-3xl mb-8">
            <Eyebrow className="mb-6">The landscape</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Why it&rsquo;s{" "}
              <span style={{ color: "var(--color-au-pink)" }}>tangled</span>,               and what to do about it.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="max-w-3xl flex flex-col gap-5 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed">
              <p>
                There&rsquo;s no single &ldquo;Aesthetics Regulator&rdquo;
                in the UK. What you actually have is{" "}
                <strong>three overlapping layers</strong>: a professional
                regulator (your NMC, GMC or GDC registration), a clinical
                regulator (CQC in England, HIS in Scotland, HIW in Wales,
                RQIA in Northern Ireland), and a practice-standards layer
                (JCCP, CPSA). On top of that sit the medicines regulator
                (MHRA), the clinical-evidence body (NICE), and the
                advertising regulator (ASA).
              </p>
              <p>
                Most practitioners I teach have never had this drawn out
                for them, which is why so many of them feel exposed despite
                doing nothing wrong. The first thing I do in any course is
                place the practitioner on this map. Once you can see your
                position, the next decisions become a lot calmer.
              </p>
              <p>
                And then there&rsquo;s the new piece:{" "}
                <Link
                  href="#licensing-scheme"
                  className="text-[var(--color-au-pink)] hover:underline"
                >
                  the licensing scheme
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            LICENSING SCHEME
            ============================================================ */}
        <PosterBlock tone="cream" contained id="licensing-scheme">
          <ScrollReveal className="max-w-3xl mb-8">
            <Eyebrow className="mb-6">The new licensing scheme</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              The{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                Health and Care Act
              </span>{" "}
              changed the game.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="max-w-3xl flex flex-col gap-5 text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed">
              <p>
                The{" "}
                <strong>Health and Care Act 2022, Part 5, Section 180</strong>{" "}
                gave the Secretary of State power to introduce a licensing
                scheme for non-surgical cosmetic procedures in England.
                Consultation closed in 2023; implementation is rolling out
                in stages. When fully active, certain procedures will
                require a local-authority licence in addition to your
                professional registration.
              </p>
              <p>
                <strong>What this means in practice:</strong> the floor is
                rising. The procedures most likely to be brought into
                scope are the higher-risk injectables and energy-based
                devices. If your scope of practice includes those,
                you&rsquo;ll need both a JCCP-aligned competence record
                and a local-authority licence. The CPSA risk-based
                framework is the one most likely to drive how categories
                are defined.
              </p>
              <p>
                <strong>Scotland, Wales and Northern Ireland:</strong> the
                devolved positions are still developing. Expect divergence.
                See the{" "}
                <Link
                  href="#devolved"
                  className="text-[var(--color-au-pink)] hover:underline"
                >
                  devolved nation section
                </Link>
                {" "}below.
              </p>
              <p>
                <strong>What I do about it:</strong> I designed the{" "}
                <Link
                  href="/courses/rag-pathway"
                  className="text-[var(--color-au-pink)] hover:underline"
                >
                  RAG Pathway
                </Link>{" "}
                so that wherever the licensing thresholds finally land,
                the practitioner has already done the underlying work.
                Scope-of-practice clarity, documented competence, defensible
                consent, and the marketing posture to match.
              </p>
            </div>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            STUDENT VOICE, single anchored testimonial mid-pillar.
            Pulls a regulation-relevant testimonial (RAG Pathway).
            ⚠️ PLACEHOLDER content, see lib/testimonials.ts.
            ============================================================ */}
        {(() => {
          const ragTestimonial = TESTIMONIALS.find(
            (t) => t.courseSlug === "rag-pathway",
          );
          return ragTestimonial ? (
            <PosterBlock tone="white" contained>
              <TestimonialQuote
                testimonial={ragTestimonial}
                eyebrow="From a RAG Pathway student"
              />
            </PosterBlock>
          ) : null;
        })()}

        {/* ============================================================
            THE EIGHT REGULATORS
            ============================================================ */}
        <PosterBlock tone="white" contained id="regulators">
          {/* Tone stays white. Two whites in a row (testimonial + this)
              are acceptable here because the testimonial uses a much
              tighter centred composition that reads visually distinct. */}
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">The eight regulators</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Eight bodies. One{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                defensible
              </span>{" "}
              practice.
            </h2>
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed">
              The bodies you&rsquo;re actually working under as a UK
              aesthetic practitioner. Click any name for a full read-out
              of who they are, what they regulate, and how I teach against
              them.
            </p>
          </ScrollReveal>
          <ul className="flex flex-col gap-4 sm:gap-5 max-w-4xl">
            {STANDARDS.map((s) => (
              <li
                key={s.slug}
                className="border border-au-charcoal/15 rounded-[5px] hover:border-[var(--color-au-pink)] transition-colors"
              >
                <Link
                  href={`/standards/${s.slug}`}
                  className="block p-5 sm:p-6 grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-baseline"
                >
                  <span
                    className="font-display font-black leading-none"
                    style={{
                      fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {s.abbrev}
                  </span>
                  <div>
                    <h3
                      className="font-display font-bold text-au-charcoal mb-1"
                      style={{ fontSize: "1.0625rem" }}
                    >
                      {s.name}
                    </h3>
                    <p className="text-[0.9375rem] text-au-charcoal/75 leading-relaxed">
                      {REG_INTRO[s.slug] ?? s.what}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            DEVOLVED NATIONS
            ============================================================ */}
        <PosterBlock tone="cream" contained id="devolved">
          <ScrollReveal className="max-w-3xl mb-10">
            <Eyebrow className="mb-6">Devolved nations</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Four nations,{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                four rulebooks
              </span>
              .
            </h2>
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed">
              Healthcare regulation is devolved. The clinical regulator,
              the licensing-scheme implementation, and the supporting
              guidance bodies all differ by nation. The UK-wide bodies
              (NMC, MHRA, JCCP, CPSA, ASA) overlay all four. Pick your
              nation for a tailored read-out.
            </p>
          </ScrollReveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
            {nations.map((n) => (
              <li
                key={n.slug}
                className="border border-au-charcoal/15 rounded-[5px] bg-au-white hover:border-[var(--color-au-pink)] transition-colors"
              >
                <Link href={`/for/${n.slug}`} className="block p-6 sm:p-7">
                  <p
                    className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-2"
                    style={{ color: "var(--color-au-pink)" }}
                  >
                    Nation
                  </p>
                  <h3
                    className="font-display font-black text-au-charcoal mb-3"
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 1.875rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {n.name}
                  </h3>
                  <p className="text-[0.9375rem] text-au-charcoal/75 leading-relaxed">
                    {n.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            WHERE TO START
            ============================================================ */}
        <PosterBlock tone="white" contained id="where-to-start">
          <ScrollReveal className="max-w-3xl mb-8">
            <Eyebrow className="mb-6">Where I&rsquo;d start</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal mb-6"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              The order I&rsquo;d{" "}
              <span style={{ color: "var(--color-au-pink)" }}>send you</span>{" "}
              through.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ol className="max-w-3xl flex flex-col gap-6">
              <li className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-start">
                <span
                  className="font-display font-black leading-none pt-1"
                  style={{
                    fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                    color: "var(--color-au-pink)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  01
                </span>
                <div>
                  <h3
                    className="font-display font-bold text-au-charcoal mb-2"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Free 2-day reality check
                  </h3>
                  <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/80 leading-relaxed mb-3">
                    Start with the{" "}
                    <Link
                      href="/courses/free-2-day-rag"
                      className="text-[var(--color-au-pink)] hover:underline"
                    >
                      RAG 2-Day Mini
                    </Link>
                    , free. Two days, the honest read on where you sit
                    today, framed around the Traffic Light System I teach.
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-start">
                <span
                  className="font-display font-black leading-none pt-1"
                  style={{
                    fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                    color: "var(--color-au-pink)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  02
                </span>
                <div>
                  <h3
                    className="font-display font-bold text-au-charcoal mb-2"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Pick your nation
                  </h3>
                  <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/80 leading-relaxed mb-3">
                    Open the{" "}
                    <Link
                      href="/for"
                      className="text-[var(--color-au-pink)] hover:underline"
                    >
                      for-practitioners page
                    </Link>{" "}
                    for England, Scotland, Wales or Northern Ireland, the
                    rulebook genuinely differs.
                  </p>
                </div>
              </li>
              <li className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-start">
                <span
                  className="font-display font-black leading-none pt-1"
                  style={{
                    fontSize: "clamp(1.875rem, 4.4vw, 2.5rem)",
                    color: "var(--color-au-pink)",
                    letterSpacing: "var(--tracking-tight-display)",
                  }}
                >
                  03
                </span>
                <div>
                  <h3
                    className="font-display font-bold text-au-charcoal mb-2"
                    style={{ fontSize: "1.125rem" }}
                  >
                    The 4-week RAG Pathway
                  </h3>
                  <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/80 leading-relaxed mb-3">
                    When you&rsquo;re ready for the full programme, the{" "}
                    <Link
                      href="/courses/rag-pathway"
                      className="text-[var(--color-au-pink)] hover:underline"
                    >
                      RAG Pathway
                    </Link>{" "}
                    is the structured 4-week walkthrough I designed to land
                    practitioners aligned with JCCP / CPSA / MHRA expectations
                    before the licensing scheme tightens.
                  </p>
                  <Button
                    href="/courses/rag-pathway"
                    variant="black"
                    size="sm"
                  >
                    See the RAG Pathway
                  </Button>
                </div>
              </li>
            </ol>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            CTA
            ============================================================ */}
        <CTAPoster
          eyebrow="Built for practitioners"
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

void LOCATIONS;
