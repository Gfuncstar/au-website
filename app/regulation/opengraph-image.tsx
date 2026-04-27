/**
 * /regulation Open Graph image.
 *
 * The regulation pillar page is the single highest-leverage SEO asset on
 * the site (per the competitor research — no UK aesthetics-education
 * brand owns the topic). When the URL is shared, the preview card has
 * to land. This generates a tailored 1200×630 PNG with the page's own
 * headline + the credibility strip.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt =
  "UK aesthetics regulation 2026 — JCCP, MHRA, CQC, licensing, decoded";

const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";

export default async function RegulationOG() {
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
          <div style={{ width: 64, height: 3, background: PINK }} />
          UK Aesthetics Regulation
        </div>

        {/* Middle — headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            UK aesthetics
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            regulation,{" "}
            <span style={{ color: PINK }}>decoded</span>.
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 24,
              lineHeight: 1.3,
              opacity: 0.8,
              maxWidth: 920,
            }}
          >
            JCCP, CPSA, MHRA, CQC, NICE, NMC, RCN, ASA — and the new licensing
            scheme. The map, in one place.
          </div>
        </div>

        {/* Bottom — author */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
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
            By Bernadette Tobin RN, MSc
          </div>
          <div
            style={{
              fontSize: 18,
              opacity: 0.7,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Educator of the Year 2026 Nominee · Founder, Visage Aesthetics
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
