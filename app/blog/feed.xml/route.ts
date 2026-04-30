/**
 * /blog/feed.xml — RSS 2.0 feed of every Notebook post.
 *
 * Generated at build time. Feed readers and aggregators (Feedly, Inoreader,
 * etc.) hit this URL and pick up new posts as the agent commits them.
 */

import { getAllPosts } from "@/lib/blog";
import { BRAND } from "@/lib/credentials";

const SITE_URL = `https://${BRAND.domain}`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(BRAND.name)} · Journal</title>
    <link>${SITE_URL}/blog</link>
    <description>A clinical journal for UK aesthetic practitioners. Three pieces a week from Bernadette Tobin RN, MSc.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
