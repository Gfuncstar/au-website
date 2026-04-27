/**
 * robots.txt — generated at build time.
 *
 * Per seo-audit.md Tier 1: a real robots.txt is essential before launch.
 * Replaces Kartra's missing robots.txt (which returned the homepage HTML).
 */

import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/credentials";

const SITE_URL = `https://${BRAND.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
