/**
 * Per-standard Open Graph image.
 *
 * Eight images generated (one per UK regulator). When a /standards/[slug]
 * page is shared, the preview shows the regulator's abbrev + name + a
 * one-line summary, not the generic homepage card.
 *
 * Node runtime — generateImageMetadata isn't supported on edge in Next 16.
 */

import { ImageResponse } from "next/og";
import { STANDARDS, getStandard } from "@/lib/standards";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export function generateImageMetadata() {
  return STANDARDS.map((s) => ({
    id: s.slug,
    alt: `${s.abbrev}, ${s.name}`,
    contentType,
    size,
  }));
}

const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";

type Props = {
  params: { slug: string };
  id: string;
};

export default async function StandardOG({ params }: Props) {
  const standard = getStandard(params.slug);

  if (!standard) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: CHARCOAL,
            color: CREAM,
            fontSize: 64,
            fontFamily: "sans-serif",
          }}
        >
          Aesthetics Unlocked
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: CHARCOAL,
          color: CREAM,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top, eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: PINK,
            fontWeight: 700,
          }}
        >
          <div style={{ width: 64, height: 3, background: PINK }} />
          Standards I teach against
        </div>

        {/* Middle, abbrev (huge) + full name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 188,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: -4,
              color: PINK,
            }}
          >
            {standard.abbrev}
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            {standard.name}
          </div>
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.35,
              opacity: 0.75,
              maxWidth: 940,
              fontWeight: 400,
            }}
          >
            {standard.what}
          </div>
        </div>

        {/* Bottom, author */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 20,
            color: CREAM,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: PINK }}>★</span>
            Aesthetics Unlocked · Bernadette Tobin RN, MSc
          </div>
          <div
            style={{
              fontSize: 17,
              opacity: 0.7,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Educator of the Year 2026 Nominee
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
