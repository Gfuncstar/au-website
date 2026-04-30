/**
 * Per-post Open Graph image, generated at build time.
 *
 * Why this exists: when a Journal post is shared on LinkedIn, Twitter,
 * WhatsApp, or Slack, the preview card should show *that piece*, with
 * its topic eyebrow, title, byline and read time, in the Aesthetics
 * Unlocked editorial palette. Without a per-post OG image the share
 * card defaults to bare text, which kills click-through and signals
 * a thin SEO surface.
 *
 * Generated dynamically per slug via `generateImageMetadata` (one PNG
 * per post). Sized 1200x630 (LinkedIn / Twitter summary_large_image).
 *
 * Visual language matches the per-course OG card, swapping the price
 * tile for a topic eyebrow and reading-time pill so the editorial
 * surface reads as Journal, not catalogue.
 */

import { ImageResponse } from "next/og";
import { getPostBySlug, TOPIC_LABELS } from "@/lib/blog";

// Node runtime required because generateImageMetadata is not supported
// on the edge runtime per Next 16. Same image quality, slightly slower
// cold-start, fine for OG cards rendered once per deploy.
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

// Dynamic route: must return only the entry matching `params.slug`,
// otherwise Next uses the first array element's id + alt for every
// post page (so every post would advertise the most recent post's
// image alt text on social shares).
//
// Next 16 contract (asymmetric, see Next docs):
//   - generateImageMetadata receives `params` as a SYNC object.
//   - The default Image function receives `params` and `id` as
//     Promises that must be awaited.
export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return [];
  return [
    {
      id: post.slug,
      alt: `${post.title}, Aesthetics Unlocked Journal`,
      contentType,
      size,
    },
  ];
}

const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";

type Props = {
  params: Promise<{ slug: string }>;
  id: Promise<string>;
};

export default async function BlogOG({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
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
          Aesthetics Unlocked Journal
        </div>
      ),
      { ...size },
    );
  }

  const topicLabel = TOPIC_LABELS[post.topic];
  const readTime = `${post.readingTimeMinutes} min read`;
  const dateLabel = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            Aesthetics Unlocked Journal
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
            {topicLabel}
          </div>
        </div>

        {/* Middle, post title + excerpt */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 1050,
          }}
        >
          <div
            style={{
              fontSize: post.title.length > 56 ? 64 : post.title.length > 36 ? 80 : 96,
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: -2,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.35,
              color: CREAM,
              opacity: 0.78,
              maxWidth: 950,
              fontWeight: 400,
              // Satori (next/og) does not support `display: -webkit-box`
              // or `WebkitLineClamp`, so we hard-cap the excerpt length
              // at the frontmatter level (160 chars) and let it wrap
              // naturally inside the 950px maxWidth.
              display: "flex",
            }}
          >
            {post.excerpt}
          </div>
        </div>

        {/* Bottom, byline + read time + date */}
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
              gap: 6,
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: CREAM,
              opacity: 0.7,
            }}
          >
            <div style={{ color: PINK, fontWeight: 700 }}>{readTime}</div>
            <div>{dateLabel}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
