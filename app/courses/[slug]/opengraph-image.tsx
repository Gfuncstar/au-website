/**
 * Per-course Open Graph image, generated at the edge.
 *
 * Why this exists: when a course page is shared on Twitter/LinkedIn/
 * WhatsApp, the preview card should show *that course* — title, price,
 * duration, AU brand strip — not the generic homepage card. Big social
 * SEO win because each course page now has its own visual identity in
 * the SERP and on social.
 *
 * Generated dynamically per slug via `generateImageMetadata` (one PNG
 * per course). Sized 1200×630 (LinkedIn / Twitter summary_large_image).
 */

import { ImageResponse } from "next/og";
import { COURSES, getCourse } from "@/lib/courses";

// Node runtime required because generateImageMetadata isn't supported
// on the edge runtime per Next 16. Same image quality, slightly slower
// cold-start — fine for OG cards.
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export function generateImageMetadata() {
  return COURSES.map((c) => ({
    id: c.slug,
    alt: `${c.title}, Aesthetics Unlocked`,
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

export default async function CourseOG({ params }: Props) {
  const course = getCourse(params.slug);

  if (!course) {
    // Fallback — shouldn't happen because generateImageMetadata only
    // produces ids for valid course slugs.
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

  const priceLabel =
    course.availability === "waitlist"
      ? "Waitlist"
      : course.price === undefined
        ? "Free"
        : `£${course.price.toLocaleString("en-GB")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: CHARCOAL,
          color: CREAM,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top, eyebrow strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 20,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: PINK,
              fontWeight: 700,
            }}
          >
            <div style={{ width: 56, height: 3, background: PINK }} />
            Aesthetics Unlocked
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: CREAM,
              opacity: 0.7,
              fontWeight: 600,
            }}
          >
            {course.eyebrow}
          </div>
        </div>

        {/* Middle, course title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: course.title.length > 28 ? 84 : 112,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -2,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {course.title}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.3,
              color: CREAM,
              opacity: 0.8,
              maxWidth: 900,
              fontWeight: 400,
            }}
          >
            {course.summary}
          </div>
        </div>

        {/* Bottom, price + author + credentials */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 18,
              color: CREAM,
              opacity: 0.85,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontSize: 20,
              }}
            >
              <span style={{ color: PINK }}>★</span>{" "}
              By Bernadette Tobin RN, MSc
            </div>
            <div style={{ fontSize: 17, opacity: 0.7 }}>
              Educator of the Year 2026 Nominee · Beauty &amp; Aesthetics Awards
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: PINK,
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              {priceLabel}
            </div>
            <div
              style={{
                fontSize: 16,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: CREAM,
                opacity: 0.6,
              }}
            >
              {course.format}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
