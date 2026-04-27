/**
 * /contact — single-purpose contact page.
 *
 * No form yet (will hook into Kartra/email later); current build surfaces
 * the email + a brand statement. Keeps the page from 404'ing while the
 * form pipeline is being decided.
 *
 * Layout (mobile-first):
 *   1. Light hero — eyebrow + headline + opener
 *   2. Contact details — email, support hours, GDPR note
 *   3. CTA
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { CTAPoster } from "@/components/CTAPoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { BRAND } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "Contact — Aesthetics Unlocked®",
  description:
    "Get in touch with Aesthetics Unlocked — the strategic education platform for UK aesthetic practitioners. Email hello@aunlock.co.uk.",
};

export default function ContactPage() {
  return (
    <>
      <Nav forceLight />
      <main className="pt-16 sm:pt-20">
        {/* ============================================================
            HERO
            ============================================================ */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">Get in touch</Eyebrow>
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
              <Fragment key="0">Talk to us.</Fragment>,
              <Fragment key="1">
                <span style={{ color: "var(--color-au-pink)" }}>One inbox</span>
                , one human.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              Course questions, partnership enquiries, press, speaking. Email
              the team and we&rsquo;ll come back to you within two working days.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* ============================================================
            CONTACT DETAILS
            ============================================================ */}
        <PosterBlock tone="white" contained>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-4xl">
            <ScrollReveal>
              <Eyebrow className="mb-4">Email</Eyebrow>
              <a
                href={`mailto:${BRAND.email}`}
                className="font-display font-black text-au-charcoal hover:text-[var(--color-au-pink)] transition-colors block break-all"
                style={{
                  fontSize: "clamp(1.5rem, 4.5vw, 2.25rem)",
                  letterSpacing: "var(--tracking-tight-display)",
                }}
              >
                {BRAND.email}
              </a>
              <p className="text-au-charcoal/70 mt-3 leading-relaxed">
                The fastest route. We read every message.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <Eyebrow className="mb-4">Members area</Eyebrow>
              <p
                className="text-au-charcoal leading-relaxed mb-4"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
              >
                Already enrolled? Log in to your courses on the AU members
                portal.
              </p>
              <Button
                href={`https://${BRAND.membersDomain}`}
                variant="pink"
                size="sm"
              >
                Members log in
              </Button>
            </ScrollReveal>

            <ScrollReveal delay={0.24}>
              <Eyebrow className="mb-4">Hours</Eyebrow>
              <p
                className="text-au-charcoal leading-relaxed"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
              >
                Monday–Friday, 09:00–17:30 GMT. We&rsquo;re a small team — out
                of hours, the inbox waits and we reply first thing.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.36}>
              <Eyebrow className="mb-4">Privacy</Eyebrow>
              <p className="text-au-charcoal/75 leading-relaxed text-[0.9375rem]">
                We&rsquo;re GDPR-compliant. Your details are used only to
                respond to your message — never sold, never passed on. See our{" "}
                <a
                  href="/privacy"
                  className="underline decoration-[var(--color-au-pink)] underline-offset-4 hover:text-[var(--color-au-pink)] transition-colors"
                >
                  privacy policy
                </a>
                .
              </p>
            </ScrollReveal>
          </div>
        </PosterBlock>

        {/* ============================================================
            CTA
            ============================================================ */}
        <CTAPoster
          eyebrow="Or skip ahead"
          headline={
            <>
              Browse the{" "}
              <span style={{ color: "var(--color-au-pink)" }}>courses</span>.
            </>
          }
          buttonText="See all courses"
          buttonHref="/courses"
          tone="black"
        />
      </main>
      <Footer />
    </>
  );
}
