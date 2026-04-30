/**
 * Per-location Open Graph image for the geo landing pages.
 *
 * When /for/london or /for/scotland is shared, the preview card now
 * shows the location name + tailored framing instead of the generic
 * homepage card. Eight images generated (one per slug).
 *
 * Node runtime — required because generateImageMetadata isn't supported
 * on the edge runtime in Next 16.
 */

import { ImageResponse } from "next/og";
import { LOCATIONS, getLocation } from "@/lib/locations";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

// Dynamic route: must return only the entry matching `params.slug`,
// otherwise Next uses the first array element's id + alt for every page.
export function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const location = LOCATIONS.find((l) => l.slug === params.slug);
  if (!location) return [];
  return [
    {
      id: location.slug,
      alt: `Aesthetics education for ${location.name}, Aesthetics Unlocked`,
      contentType,
      size,
    },
  ];
}

const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";

type Props = {
  params: { slug: string };
  id: string;
};

export default async function LocationOG({ params }: Props) {
  const location = getLocation(params.slug);

  if (!location) {
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

  const subtitle =
    location.kind === "nation"
      ? `${location.name} regulation, decoded`
      : `For ${location.name} practitioners`;

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
          {location.kind === "nation" ? "UK Nation" : `City · ${location.region}`}
        </div>

        {/* Middle, location name + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 132,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -3,
            }}
          >
            {location.name}
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: -1,
              color: PINK,
            }}
          >
            {subtitle}.
          </div>
        </div>

        {/* Bottom, author strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
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
            By Bernadette Tobin RN, MSc · Aesthetics Unlocked
          </div>
          <div
            style={{
              fontSize: 17,
              opacity: 0.7,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Educator of the Year 2026 Nominee · NICE-aligned · JCCP-aware
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
