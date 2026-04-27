/**
 * About — Bernadette's bio, in her own voice.
 *
 * Restructured to surface authority + story per Giles' "homepage needs to
 * introduce her, what she stands for" call (and to give the about page
 * the same treatment in its full form).
 *
 * Layout (mobile-first):
 *   1. Cream hero — eyebrow + line-by-line headline + opener
 *   2. Portrait + opening paragraphs (NEW — "I started nursing at 17…")
 *   3. Why I built AU — second paragraph block (cream, with a quote)
 *   4. Awards strip (pink) — 1-2 USP punch
 *   5. The journey — numbered ledger of her career path
 *   6. Credentials grid — verified, public-record marks (solid black)
 *   7. Press / accreditation row
 *   8. Quote — pull-quote with signature
 *   9. Final CTA
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAPoster } from "@/components/CTAPoster";
import { QuotePoster } from "@/components/QuotePoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { AwardsPanel } from "@/components/AwardsPanel";
import { FOUNDER, AWARDS } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "About Bernadette Tobin — Educator of the Year 2026 Nominee",
  description:
    "I started nursing at 17 and never really stopped. Twenty years on, I lead the clinical workforce for an NHS Trust, run a busy aesthetics clinic, lecture postgraduate clinicians, and write about how to build a practice that doesn't burn the practitioner alive.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Bernadette Tobin — Educator of the Year 2026 Nominee",
    description:
      "Bernadette Tobin RN, MSc — founder of Aesthetics Unlocked, Best Non-Surgical Aesthetics Clinic 2026 (Essex), and Educator of the Year 2026 Nominee.",
    url: "/about",
    type: "profile",
  },
};

const STATS = [
  { num: "20+", label: "Years nursing" },
  { num: "12", label: "Years in aesthetics" },
  { num: "MSc", label: "Advanced Practice (L7)" },
  { num: "NMC", label: "Registered RN" },
] as const;

const JOURNEY = [
  {
    num: "01",
    head: "Acute medical & community nursing",
    body: "Started nursing at 17. Twenty years on the ward, in homes, and across community trusts. The clinical instinct that makes every consultation safer.",
  },
  {
    num: "02",
    head: "MSc Advanced Practice (Level 7)",
    body: "Postgraduate clinical reasoning. The training behind every NICE-aligned course AU teaches.",
  },
  {
    num: "03",
    head: "Founder, Visage Aesthetics",
    body: "A working clinic in Essex — Best Non-Surgical Aesthetics Clinic 2026 (Health, Beauty & Wellness Awards). Where every framework AU teaches has been tested under real fee pressure.",
  },
  {
    num: "04",
    head: "Head of Clinical Workforce, NHS Trust",
    body: "Governance, development, and strategic oversight of over 1,000 nurses. The leadership lens that shapes how AU teaches scope of practice and risk.",
  },
  {
    num: "05",
    head: "Senior Lecturer & author",
    body: "Postgraduate teaching at a UK university. Author of Regulation to Reputation. Featured in Cosmopolitan magazine.",
  },
  {
    num: "06",
    head: "Educator of the Year 2026 Nominee",
    body: "Beauty & Aesthetics Awards. The teaching axis recognised — not just the practice.",
  },
] as const;

const CREDENTIALS = [
  {
    head: "Registered Nurse (NMC)",
    sub: "Member of the Royal College of Nursing. Verifiable on the NMC public register.",
  },
  {
    head: "MSc Advanced Practice (Level 7)",
    sub: "The highest academic level a nurse can hold. Postgraduate clinical reasoning.",
  },
  {
    head: "20+ years clinical, 12 in aesthetics",
    sub: "Acute medical → community → advanced practice → aesthetics.",
  },
  {
    head: "CPD Certified across all treatments",
    sub: "Continuing Professional Development verified across the regulated product ranges (Allergan, Galderma, IBSA).",
  },
  {
    head: "Safeguarding trained",
    sub: "Patient welfare and informed consent — the non-negotiable foundation of every consultation.",
  },
  {
    head: "Featured in Cosmopolitan",
    sub: "Editorial recognition for shaping UK aesthetics standards.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <Nav forceLight />
      <main className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO — light, type-led.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">About Aesthetics Unlocked</Eyebrow>
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
              <Fragment key="0">Built by a clinician.</Fragment>,
              <Fragment key="1">
                Taught with{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  the receipts
                </span>
                .
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              Aesthetics Unlocked is the only UK education platform built and
              taught by a working clinician, NHS leader, and clinic owner —
              for practitioners who want to grow{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                safely, ethically, and on their own terms
              </span>
              .
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            PORTRAIT + OPENING PARAGRAPHS — "I started nursing at 17…"
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <div className="grid md:grid-cols-[5fr_7fr] gap-10 sm:gap-12 md:gap-16 items-start">
            <ScrollReveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[5px] bg-au-cream">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 z-10 h-[3px] w-16"
                  style={{ backgroundColor: "var(--color-au-pink)" }}
                />
                {/* High-res editorial studio portrait — blue blazer,
                    arms folded, white studio backdrop with negative
                    space. Per Giles' "update to this image" call. */}
                <Image
                  src="/brand/bernadette-3.jpg"
                  alt="Bernadette Tobin — RN, MSc Advanced Practice, founder of Aesthetics Unlocked"
                  fill
                  className="object-cover object-[75%_center]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  quality={95}
                  priority
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <Eyebrow className="mb-5">In her own words</Eyebrow>
              <h2
                className="font-display font-black text-au-charcoal mb-6"
                style={{
                  fontSize: "clamp(1.75rem, 4.4vw, 2.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                I&rsquo;m{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  Bernadette Tobin
                </span>
                .
              </h2>
              <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed mb-5">
                I started nursing at 17 and never really stopped. Twenty years
                on, I lead the clinical workforce for an NHS Trust, run a busy
                aesthetics clinic, lecture postgraduate clinicians, and write
                about how to build a practice that doesn&rsquo;t burn the
                practitioner alive.
              </p>
              <p className="text-[1rem] sm:text-[1.0625rem] text-au-charcoal/85 leading-relaxed">
                Aesthetics Unlocked is what I wish someone had handed me when
                I started.
              </p>
            </ScrollReveal>
          </div>
        </PosterBlock>

        {/* ============================================================
            WHY I BUILT AU — quote-style block (cream).
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-3xl">
            <Eyebrow className="mb-6">Why I built it</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">The gap I saw</Fragment>,
              <Fragment key="1">
                wasn&rsquo;t{" "}
                <span style={{ color: "var(--color-au-pink)" }}>clinical</span>
                .
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15} className="max-w-2xl">
            <p className="text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-5">
              The practitioners I knew were technically excellent. They were
              just{" "}
              <strong className="font-bold">
                exhausted, undercharging, and quietly unsure if they were
                actually compliant.
              </strong>
            </p>
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed mb-5">
              The programme pulls together everything I&rsquo;ve spent twenty
              years building — clinical authority, academic rigour, NHS
              leadership, real business strategy, and the psychology of
              confident, ethical practice — into something you can actually
              use.
            </p>
            <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/80 leading-relaxed">
              The point isn&rsquo;t to grow at any cost. It&rsquo;s to grow{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                without losing the version of yourself you got into this work
                for
              </span>
              .
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            AWARDS — pink poster, 1-2 USP punch.
            ============================================================ */}
        <PosterBlock tone="pink" contained>
          <ScrollReveal>
            <Eyebrow color="black" className="mb-6">
              Recognised by the industry
            </Eyebrow>
            <AwardsPanel variant="compact" tone="pink" />
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            JOURNEY — numbered ledger.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">The journey</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-charcoal mb-12 sm:mb-14"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">From the ward</Fragment>,
              <Fragment key="1">
                to a{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  national education platform
                </span>
                .
              </Fragment>,
            ]}
          />

          <ul className="flex flex-col gap-7 sm:gap-9 max-w-3xl">
            {JOURNEY.map((row, i) => (
              <ScrollReveal key={row.num} delay={i * 0.08}>
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
                      {row.num}
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
                      {row.head}
                    </h3>
                    <p
                      className="text-au-charcoal/75 leading-relaxed"
                      style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                    >
                      {row.body}
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </PosterBlock>

        {/* ============================================================
            CREDENTIALS GRID + STAT STRIP — solid black, AU primary.
            ============================================================ */}
        <PosterBlock tone="black" contained full>
          <ScrollReveal className="max-w-4xl mb-10 sm:mb-12">
            <Eyebrow color="pink">Credentials, in full</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            className="font-display font-black text-au-white mb-10 sm:mb-12"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={[
              <Fragment key="0">Verified.</Fragment>,
              <Fragment key="1">
                On the{" "}
                <span style={{ color: "var(--color-au-pink)" }}>
                  public record
                </span>
                .
              </Fragment>,
            ]}
          />

          {/* Stat strip — top-line numbers. */}
          <ScrollReveal delay={0.1}>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-14 border-t border-au-white/15 pt-8 sm:pt-10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt
                    className="font-display font-black leading-none mb-2"
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3rem)",
                      color: "var(--color-au-pink)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {s.num}
                  </dt>
                  <dd className="font-section font-semibold uppercase tracking-[0.18em] text-[0.75rem] sm:text-[0.8125rem] text-au-white/65">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          {/* Credentials list — verified facts only. */}
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
            {CREDENTIALS.map((item, i) => (
              <ScrollReveal key={item.head} delay={i * 0.06}>
                <article>
                  <h3
                    className="leading-tight mb-1"
                    style={{
                      fontSize: "clamp(1.0625rem, 2.4vw, 1.25rem)",
                      color: "var(--color-au-pink)",
                    }}
                  >
                    {item.head}
                  </h3>
                  <p className="text-au-white/70 text-[0.9375rem] leading-relaxed">
                    {item.sub}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4} className="mt-10">
            <p className="text-au-white/55 text-[0.8125rem] uppercase tracking-[0.18em] font-section font-semibold">
              NMC Pin · {FOUNDER.nmcPin} · verifiable on nmc.org.uk
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            QUOTE
            ============================================================ */}
        <QuotePoster
          attribution={`${FOUNDER.fullName} ${FOUNDER.shortCredentials}`}
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
            CTA
            ============================================================ */}
        <CTAPoster
          eyebrow="When you're ready"
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
    </>
  );
}

void AWARDS;
