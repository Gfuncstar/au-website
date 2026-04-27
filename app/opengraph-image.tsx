/**
 * Default Open Graph image for the site, generated at build time.
 *
 * Per seo-audit.md: "produce an OG card for the homepage and About that
 * includes the nominee badge baked in." This component runs at the edge
 * via Next's ImageResponse and is referenced automatically by Next as
 * the fallback OG/Twitter image for any page that doesn't define its
 * own opengraph-image.
 *
 * 1200×630 is the canonical OG size (matches LinkedIn and Twitter
 * `summary_large_image`).
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt =
  "Aesthetics Unlocked — UK Aesthetics Education · Educator of the Year 2026 Nominee";

const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";

export default async function OGImage() {
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
        {/* Top — eyebrow */}
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
          <div
            style={{
              width: 64,
              height: 3,
              background: PINK,
            }}
          />
          Aesthetics Unlocked
        </div>

        {/* Middle — headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            Strategy injected.
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: -2,
              color: PINK,
            }}
          >
            Aesthetics unlocked.
          </div>
        </div>

        {/* Bottom — credentials strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontSize: 22,
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
            Educator of the Year 2026 Nominee · Beauty &amp; Aesthetics Awards
          </div>
          <div
            style={{
              fontSize: 18,
              opacity: 0.7,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Bernadette Tobin RN, MSc · NICE-aligned · Evidence-led
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
