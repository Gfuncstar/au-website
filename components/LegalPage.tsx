/**
 * LegalPage — shared template for /privacy, /terms, /cookies.
 *
 * Same hero treatment as the other inner pages (cream PosterBlock with
 * line-by-line headline reveal). Body content lives as a structured
 * sections array so each legal page just supplies the copy.
 *
 * NOTE: The bodies on each page are PLACEHOLDER copy. Replace with
 * solicitor-reviewed text before launch.
 */

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PosterBlock } from "@/components/PosterBlock";
import { Eyebrow } from "@/components/Eyebrow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RevealHeadline } from "@/components/RevealHeadline";

export type LegalSection = {
  heading: string;
  body: string;
};

type Props = {
  eyebrow: string;
  headline: React.ReactNode[];
  intro: string;
  /** "Last updated 27 April 2026" or similar. */
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  headline,
  intro,
  lastUpdated,
  sections,
}: Props) {
  return (
    <>
      <Nav forceLight />
      <main className="pt-16 sm:pt-20">
        <PosterBlock tone="cream" contained>
          <ScrollReveal className="max-w-4xl">
            <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          </ScrollReveal>
          <RevealHeadline
            as="h1"
            className="font-display font-black text-au-charcoal mb-8 sm:mb-10"
            style={{
              fontSize: "var(--text-poster)",
              lineHeight: "var(--leading-poster)",
              letterSpacing: "var(--tracking-tight-display)",
            }}
            lines={headline}
          />
          <ScrollReveal delay={0.15}>
            <p className="max-w-2xl text-[1.0625rem] sm:text-[1.125rem] md:text-[1.25rem] text-au-charcoal/85 leading-relaxed mb-3">
              {intro}
            </p>
            <p className="text-au-charcoal/55 text-[0.8125rem] uppercase tracking-[0.18em] font-section font-semibold">
              {lastUpdated}
            </p>
          </ScrollReveal>
        </PosterBlock>

        <PosterBlock tone="white" contained>
          <div className="max-w-3xl flex flex-col gap-10 sm:gap-12">
            {sections.map((s, i) => (
              <ScrollReveal key={s.heading} delay={i * 0.06}>
                <article>
                  <h2
                    className="leading-tight mb-3"
                    style={{
                      fontSize: "clamp(1.25rem, 3vw, 1.625rem)",
                      color: "var(--color-au-pink)",
                    }}
                  >
                    {s.heading}
                  </h2>
                  <p
                    className="text-au-charcoal/85 leading-relaxed whitespace-pre-line"
                    style={{ fontSize: "clamp(1rem, 2.2vw, 1.125rem)" }}
                  >
                    {s.body}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </PosterBlock>
      </main>
      <Footer />
    </>
  );
}
