/**
 * CTAPoster — single-headline, single-button block. Used to close every page.
 *
 * Per design-direction.md: black tone by default, one CTA only, no other
 * decoration. Cheap to build, sets the closing rhythm of every page.
 */

import type { ReactNode } from "react";
import { PosterBlock } from "./PosterBlock";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  buttonText: string;
  buttonHref: string;
  /** Show the price on the CTA button (e.g. 79 → "GET INSTANT ACCESS — £79"). */
  buttonPrice?: number | string;
  tone?: "black" | "cream" | "pink";
  buttonVariant?: "pink" | "black";
  /** Optional parallax background — passes through to PosterBlock. */
  bgImage?: string;
  bgOverlay?: number;
  bgOverlayGradient?: string;
};

export function CTAPoster({
  eyebrow,
  headline,
  buttonText,
  buttonHref,
  buttonPrice,
  tone = "black",
  buttonVariant,
  bgImage,
  bgOverlay,
  bgOverlayGradient,
}: Props) {
  // If we're on a black block, default to pink button. On cream/pink, default to black.
  const variant = buttonVariant ?? (tone === "black" ? "pink" : "black");

  return (
    <PosterBlock
      tone={tone}
      full
      contained
      centered
      bgImage={bgImage}
      bgOverlay={bgOverlay}
      bgOverlayGradient={bgOverlayGradient}
    >
      <div className="text-center">
        {eyebrow && (
          <Eyebrow
            color={tone === "black" ? "white" : "pink"}
            className="mb-6"
          >
            {eyebrow}
          </Eyebrow>
        )}
        <h2
          className="font-display font-black mx-auto max-w-4xl mb-10 sm:mb-12"
          style={{
            fontSize: "var(--text-poster)",
            lineHeight: "var(--leading-poster)",
            letterSpacing: "var(--tracking-tight-display)",
            color: tone === "black" ? "#ffffff" : "#000000",
          }}
        >
          {headline}
        </h2>
        {/* Size dropped from lg → sm per Giles' "all buttons follow this
            site wide" call. Matches the hero CTA footprint so every page
            button on AU now reads at the same scale. */}
        <Button
          href={buttonHref}
          variant={variant}
          size="sm"
          price={buttonPrice}
        >
          {buttonText}
        </Button>
      </div>
    </PosterBlock>
  );
}
