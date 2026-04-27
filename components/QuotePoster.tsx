/**
 * QuotePoster — Bernadette pull-quote, full-bleed poster block.
 *
 * Per design-direction.md:
 *   - Spectral italic in Brand Pink
 *   - Sized clamp(1.375rem, 3vw, 1.75rem)
 *   - Sits flush after each hero
 *   - Optionally signed with the Bernadette signature image
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { PosterBlock } from "./PosterBlock";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  children: ReactNode;
  /** "Bernadette Tobin RN MSc" or similar */
  attribution?: string;
  /** Render the handwritten signature image below the quote? */
  showSignature?: boolean;
  tone?: "cream" | "white" | "pink";
};

export function QuotePoster({
  children,
  attribution,
  showSignature = false,
  tone = "white",
}: Props) {
  // White-tone default site-wide per Giles' "white background site wide on
  // quotes" call. Quote text now renders in CHARCOAL by default, with the
  // children expected to highlight key phrases via pink / black spans
  // ("change up black and pink to highlight key points").
  const sigSrc = "/brand/bernadette-signature-black.png";

  // Quote body colour. Charcoal on white/cream, black on pink.
  const quoteColor = tone === "pink" ? "var(--color-au-black)" : "var(--color-au-charcoal)";

  return (
    <PosterBlock tone={tone} contained centered>
      <ScrollReveal as="blockquote" className="relative max-w-3xl mx-auto text-center">
        <p
          className="font-display font-black"
          style={{
            fontSize: "var(--text-quote)",
            color: quoteColor,
            lineHeight: 1.15,
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          “{children}”
        </p>
        {(attribution || showSignature) && (
          <footer className="mt-8 flex flex-col items-center gap-3">
            {showSignature && (
              <Image
                src={sigSrc}
                alt={attribution ?? "Bernadette Tobin"}
                width={180}
                height={70}
                className="h-12 sm:h-14 w-auto opacity-90"
              />
            )}
            {attribution && (
              <cite
                className="not-italic font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] sm:text-[0.75rem] text-au-charcoal"
              >
                {attribution}
              </cite>
            )}
          </footer>
        )}
      </ScrollReveal>
    </PosterBlock>
  );
}
