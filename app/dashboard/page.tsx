/**
 * /dashboard — public marketing surface for the members' portal.
 *
 * Sells the post-enrolment experience to visitors who haven't bought
 * yet. Distinct from /members (the actual logged-in dashboard). Uses
 * the shared DashboardPreview at the top, then unfolds further into
 * specific feature blocks honest to what's actually in the portal:
 *   • Lesson-by-lesson progress tracking (Continue learning)
 *   • At-a-glance status strip
 *   • Recent purchases / billing history
 *   • Native lesson player (audio intros, keyboard nav, scroll progress)
 *   • Recommendations (non-pushy upsell)
 *
 * Voice rules respected:
 *   • "Aesthetics Unlocked" written in full
 *   • Reader-facing copy throughout
 *   • Crisp 5px corners, no rounded-full
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
import { DashboardPreview } from "@/components/DashboardPreview";

export const metadata: Metadata = {
  title: "Your members' area",
  description:
    "User-friendly access to everything you own. Every enrolled course, every lesson, every certificate, in one place, on any device, with lifetime access.",
  alternates: { canonical: "/dashboard" },
  openGraph: {
    title: "Your members' area, Aesthetics Unlocked®",
    description:
      "One easy place for every course, every lesson, every certificate. Lifetime access, any device.",
    url: "/dashboard",
    type: "website",
  },
};

type Block = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: readonly string[];
  tone: "cream" | "white" | "pink-soft";
};

const FEATURE_BLOCKS: readonly Block[] = [
  {
    eyebrow: "Lesson by lesson",
    title: "Pick up exactly where you left off.",
    body: "Aesthetics Unlocked tracks your progress lesson by lesson, not module by module. The next lesson is always one click from the homepage. No remembering which video you were on, no scrolling through a curriculum to find your spot. The bookkeeping is done for you; the work is yours.",
    bullets: [
      "Continue-learning button on the dashboard homepage",
      "Per-lesson progress tracking (not just course-level)",
      "Up-next card so the next move is obvious",
      "Lesson-level scroll progress and keyboard navigation",
    ],
    tone: "white",
  },
  {
    eyebrow: "Built for the way you study",
    title: "Editorial lessons, not generic e-learning.",
    body: "Lessons are written like editorial, clean typography, audio intros where they help you understand the framing, keyboard navigation for desk-time, mobile-first layout when you're catching up between consultations. Built by Bernadette for the way working practitioners actually learn, without the bloat that makes most CPD platforms unbearable.",
    bullets: [
      "Audio intros so the framing lands before the work",
      "Mobile-first layout that works on phone, tablet, laptop",
      "Keyboard navigation for desk study (j / k / ←  / →)",
      "View tracking so re-reads pick up where they left off",
    ],
    tone: "cream",
  },
  {
    eyebrow: "Lifetime access",
    title: "Once you enrol, you keep the course.",
    body: "Sign in from your laptop in clinic. Finish the lesson on your phone on the train. Your progress syncs. New material released for that course, NICE updates, regulatory changes, fresh case studies, is automatically yours, no re-purchase, no upsell. Aesthetics Unlocked treats clinical education as something that should compound, not expire.",
    bullets: [
      "Any device, any time, phone, tablet, laptop",
      "Future updates included (NICE, regulatory, clinical)",
      "No expiring access, no re-enrol fees",
      "Certificate of Completion downloadable on request",
    ],
    tone: "white",
  },
  {
    eyebrow: "Your record",
    title: "Everything you own, on a single page.",
    body: "Recent purchases. Your Aesthetics Unlocked profile tags. Recommended next steps based on what you've taken. All listed clearly on one page, no sales pop-ups, no upsell modals interrupting a lesson. Your record, your way.",
    bullets: [
      "Clean billing history, every purchase, dated and clear",
      "Your profile tags from your learning journey",
      "Subtle recommendations, never blocking, never modal",
      "One-page navigation: home, courses, billing, account",
    ],
    tone: "cream",
  },
];

const toneClass = {
  white: "white",
  cream: "cream",
  "pink-soft": "cream",
} as const;

export default function DashboardLandingPage() {
  return (
    <>
      <Nav forceLight />
      <main id="main" className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">Your members&apos; area</Eyebrow>
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
              <Fragment key="0">Your courses.</Fragment>,
              <Fragment key="1">Your progress.</Fragment>,
              <Fragment key="2">
                <span style={{ color: "var(--color-au-pink)" }}>
                  Instant access.
                </span>
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              When you enrol with Aesthetics Unlocked, every course you own,
              every lesson you&apos;ve completed, every purchase you&apos;ve
              made, is in one place. Built by a working clinician for
              working clinicians, so you can find what you need fast and
              get back to the work.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25} className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href="/courses"
              className="group inline-flex items-center justify-center gap-2 bg-au-charcoal hover:bg-[var(--color-au-pink)] text-au-white font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 sm:px-7 py-3.5 min-h-[48px] text-[0.875rem] sm:text-[0.9375rem] transition-colors"
            >
              <span>Browse the courses</span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <p className="text-[0.875rem] text-au-charcoal/65">
              Already enrolled?{" "}
              <Link
                href="/login"
                className="text-[var(--color-au-pink)] hover:text-au-charcoal underline-offset-4 hover:underline transition-colors"
              >
                Sign in
              </Link>
              .
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            DASHBOARD PREVIEW, three core features at a glance.
            Same component the homepage uses.
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <DashboardPreview />
        </PosterBlock>

        {/* ============================================================
            FEATURE BLOCKS, alternating cream / white, deeper into
            specific features so the visitor knows exactly what they
            get.
            ============================================================ */}
        {FEATURE_BLOCKS.map((b, i) => (
          <PosterBlock key={b.title} tone={toneClass[b.tone]} contained>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <ScrollReveal>
                  <Eyebrow className="mb-5">{b.eyebrow}</Eyebrow>
                </ScrollReveal>
                <ScrollReveal delay={0.05}>
                  <h2
                    className="font-display font-black text-au-charcoal mb-5 sm:mb-6 leading-[1.05]"
                    style={{
                      fontSize: "clamp(1.875rem, 5.5vw, 3.25rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {b.title}
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <p className="text-[1rem] sm:text-[1.0625rem] md:text-[1.125rem] text-au-charcoal/85 leading-relaxed max-w-2xl">
                    {b.body}
                  </p>
                </ScrollReveal>
              </div>
              <div className="lg:col-span-5">
                <ScrollReveal delay={0.15}>
                  <ul className="bg-au-white/70 border border-au-charcoal/10 rounded-[5px] divide-y divide-au-charcoal/8 overflow-hidden">
                    {b.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="px-5 py-4 flex items-start gap-3"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-flex items-center justify-center shrink-0 w-6 h-6 rounded-[3px] text-au-white text-[0.75rem] font-bold leading-none mt-[2px]"
                          style={{ backgroundColor: "var(--color-au-pink)" }}
                        >
                          ✓
                        </span>
                        <span className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </div>
            </div>
            <span className="sr-only">Block {i + 1}</span>
          </PosterBlock>
        ))}

        {/* ============================================================
            AFTER YOU ENROL, 3-step timeline so visitors know exactly
            what happens between clicking Enrol and starting Lesson 1.
            Removes the "did the order go through?" anxiety.
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-3xl mb-8 sm:mb-10">
            <Eyebrow className="mb-5">After you enrol</Eyebrow>
            <h2
              className="font-display font-black text-au-charcoal leading-[1.05]"
              style={{
                fontSize: "clamp(1.625rem, 4.5vw, 2.5rem)",
                letterSpacing: "var(--tracking-tight-display)",
              }}
            >
              Three small steps. Then{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                straight to the work.
              </span>
            </h2>
          </ScrollReveal>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl">
            {[
              {
                num: "01",
                eyebrow: "Within seconds",
                title: "Welcome email lands.",
                body: "A single email confirms your purchase, sets your password, and links you straight to the sign-in page. No drip sequence, no marketing detour.",
              },
              {
                num: "02",
                eyebrow: "Within two minutes",
                title: "You sign in.",
                body: "One click from the welcome email. The portal recognises you, loads every course you've enrolled in, and cues up the first lesson on the homepage.",
              },
              {
                num: "03",
                eyebrow: "Same evening, if you like",
                title: "Lesson 1 starts.",
                body: "Open the portal on phone, tablet, or laptop. Press play. The portal tracks where you got to, so when you come back tomorrow the next lesson is one tap away.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.08}>
                <li className="bg-au-white border border-au-charcoal/10 rounded-[5px] p-6 sm:p-7 h-full">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span
                      aria-hidden="true"
                      className="font-display font-black leading-none"
                      style={{
                        fontSize: "clamp(1.75rem, 4.2vw, 2.25rem)",
                        color: "var(--color-au-pink)",
                        letterSpacing: "var(--tracking-tight-display)",
                      }}
                    >
                      {step.num}
                    </span>
                    <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] text-au-charcoal/55">
                      {step.eyebrow}
                    </span>
                  </div>
                  <h3
                    className="font-display font-black text-au-charcoal leading-tight mb-3"
                    style={{
                      fontSize: "clamp(1.125rem, 2.6vw, 1.375rem)",
                      letterSpacing: "var(--tracking-tight-display)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[0.9375rem] sm:text-[1rem] text-au-charcoal/75 leading-relaxed">
                    {step.body}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
          <ScrollReveal delay={0.3}>
            <p className="mt-8 sm:mt-10 max-w-2xl text-[0.9375rem] text-au-charcoal/70 leading-relaxed">
              No live cohort dates to wait for. No "course unlocks on
              Monday." Once your payment clears, your courses are
              yours, start the same hour you enrol if it suits you.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            FINAL CTA, cream → black contrast, primary route is to
            /courses (where enrolment lives), secondary to /login for
            existing members.
            ============================================================ */}
        <CTAPoster
          eyebrow="Ready to start?"
          headline={
            <>
              Enrol on a course.{" "}
              <span style={{ color: "var(--color-au-pink)" }}>
                Sign in.
              </span>{" "}
              Keep going.
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
