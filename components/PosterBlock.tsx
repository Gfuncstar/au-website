/**
 * PosterBlock — the modular "editorial poster" wrapper used to compose pages.
 *
 * Each page is a vertical stack of poster blocks alternating colour pairings.
 * Hard rules from design-direction.md:
 *   - Never two black posters in a row
 *   - Never two pink posters in a row
 *   - Cream and white are the connectors
 *
 * Mobile-first padding; full-bleed by default (sympathetic to the inspiration).
 */

import type { ReactNode } from "react";
import { ParallaxBackdrop } from "./ParallaxBackdrop";

type Tone = "cream" | "black" | "white" | "pink";

type Props = {
  tone?: Tone;
  /** Adds extra vertical breathing room — used for hero / dramatic blocks. */
  full?: boolean;
  /** Constrain inner content to a column? Default false (flush to viewport). */
  contained?: boolean;
  /** Centre inner content horizontally and vertically. */
  centered?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Render as <section> for landmarks (default true). */
  asSection?: boolean;
  /**
   * Optional parallax backdrop image. /public path (e.g.
   * "/backgrounds/pink-grunge-deep.png"). Renders behind the content
   * with a dark overlay so type stays readable. Used to replace flat
   * black sections with editorial textured backgrounds.
   */
  bgImage?: string;
  /** Overlay opacity 0–1 when `bgImage` is set. Default 0.65. */
  bgOverlay?: number;
  /** CSS gradient string to use as overlay instead of flat black. */
  bgOverlayGradient?: string;
};

const toneMap: Record<Tone, string> = {
  // Cream tone — solid cream colour replaced site-wide with the
  // cream-soft.png paper-grain backdrop at 70% opacity (30% transparent)
  // per Giles' "I really don't like this cream — use this background
  // image with a 30% transparency, site-wide" call. The image renders
  // as a separate layer in the JSX below so it can be properly
  // opacity-controlled.
  cream: "bg-au-white text-au-charcoal",
  black: "bg-au-black text-au-white",
  // White tone — flat white surface; the halftone-dot backdrop renders
  // as a separate opacity-controlled layer (see render below).
  white: "bg-au-white text-au-charcoal",
  pink: "bg-[var(--color-au-pink)] text-au-black",
};

/**
 * Per-tone decorative background overlay. Renders an absolutely-positioned
 * div behind the content with the chosen image at the chosen opacity.
 * Allows light-tone PosterBlocks to carry editorial paper-grain texture
 * without fighting the type.
 */
const toneOverlay: Partial<Record<Tone, { image: string; opacity: string }>> = {
  cream: {
    image: "/backgrounds/cream-soft.png",
    // Reduced 70% → 50% per Giles' "reduce again by 20% transparency,
    // site wide" call. Image now 50% visible / 50% transparent.
    opacity: "opacity-50",
  },
};

export function PosterBlock({
  tone = "white",
  full = false,
  contained = false,
  centered = false,
  children,
  className = "",
  id,
  asSection = true,
  bgImage,
  bgOverlay,
  bgOverlayGradient,
}: Props) {
  const tag = asSection ? "section" : "div";
  const Tag = tag as keyof React.JSX.IntrinsicElements;

  // Horizontal padding set to 35px on mobile per Giles' "more 35" call.
  // Vertical halved on mobile from the original generous defaults, then
  // reduced ~33% further site-wide per Giles' "reduce padding site wide"
  // call. Tightens the rhythm between every poster section.
  const padding = full
    ? "py-7 sm:py-20 md:py-24"
    : "py-5 sm:py-14 md:py-16";
  const layout = centered ? "flex flex-col items-center justify-center" : "";
  const inner = contained
    ? "mx-auto max-w-7xl px-[35px] sm:px-10 md:px-14"
    : "px-[35px] sm:px-10 md:px-14";

  const overlay = toneOverlay[tone];

  return (
    <Tag id={id} className={`relative overflow-hidden ${toneMap[tone]} ${className}`}>
      {/* Per-tone decorative texture overlay (e.g. cream-soft on cream).
          Renders behind content at controlled opacity. */}
      {overlay && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${overlay.opacity} pointer-events-none bg-cover bg-center`}
          style={{ backgroundImage: `url('${overlay.image}')` }}
        />
      )}
      {/* Parallax backdrop — optional. Sits behind content, in front of
          the tone bg colour. The wrapping inner div has `relative z-10`
          so it sits above the backdrop. */}
      {bgImage && (
        <ParallaxBackdrop
          imageUrl={bgImage}
          overlay={bgOverlay}
          overlayGradient={bgOverlayGradient}
        />
      )}
      <div className={`relative z-10 ${padding} ${inner} ${layout}`}>{children}</div>
    </Tag>
  );
}
