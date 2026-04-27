/**
 * /faqs — site-wide frequently asked questions.
 *
 * Built per Giles' "add Q and A's" call. General FAQ groups live in
 * lib/faqs.ts. Course-specific FAQs are surfaced on each course detail
 * page.
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAPoster } from "@/components/CTAPoster";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";
import { FAQ } from "@/components/FAQ";
import { GENERAL_FAQS } from "@/lib/faqs";
import { BRAND } from "@/lib/credentials";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you might be wondering about Aesthetics Unlocked — courses, payments, certificates, NMC revalidation, refunds, and more.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Frequently Asked Questions — Aesthetics Unlocked®",
    description:
      "Common questions about Aesthetics Unlocked courses, eligibility, certification, refunds, and Bernadette Tobin's teaching approach.",
    url: "/faqs",
    type: "website",
  },
};

export default function FAQsPage() {
  // FAQPage JSON-LD — flatten every group's items into one mainEntity
  // array so Google can surface the questions as rich-result accordions.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GENERAL_FAQS.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <Nav forceLight />
      <main className="pt-16 sm:pt-20">
        {/* HERO */}
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">Frequently asked</Eyebrow>
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
              <Fragment key="0">The questions</Fragment>,
              <Fragment key="1">
                worth{" "}
                <span style={{ color: "var(--color-au-pink)" }}>asking</span>.
              </Fragment>,
            ]}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed">
              If something isn&rsquo;t answered below, email{" "}
              <a
                href={`mailto:${BRAND.email}`}
                className="underline decoration-[var(--color-au-pink)] underline-offset-4 hover:text-[var(--color-au-pink)] transition-colors"
              >
                {BRAND.email}
              </a>{" "}
              and I&rsquo;ll come back within one working day.
            </p>
          </ScrollReveal>
        </PosterBlock>

        {/* FAQ GROUPS */}
        {GENERAL_FAQS.map((group, gi) => (
          <PosterBlock
            key={group.heading}
            tone={gi % 2 === 0 ? "white" : "cream"}
            contained
          >
            <ScrollReveal className="max-w-4xl mb-8 sm:mb-10">
              <Eyebrow className="mb-4">{group.heading}</Eyebrow>
              <RevealHeadline
                className="font-display font-black text-au-charcoal"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  lineHeight: 1.05,
                  letterSpacing: "var(--tracking-tight-display)",
                }}
                lines={[<Fragment key="0">{group.heading}.</Fragment>]}
              />
            </ScrollReveal>
            <div className="max-w-3xl">
              <FAQ items={group.items} />
            </div>
          </PosterBlock>
        ))}

        <CTAPoster
          eyebrow="Still got questions?"
          headline={
            <>
              Email us{" "}
              <span style={{ color: "var(--color-au-pink)" }}>directly</span>.
            </>
          }
          buttonText={`Email ${BRAND.email}`}
          buttonHref={`mailto:${BRAND.email}`}
          tone="black"
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
