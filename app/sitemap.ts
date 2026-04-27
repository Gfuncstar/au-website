/**
 * sitemap.xml — generated at build time.
 *
 * Per seo-audit.md Tier 1: a real sitemap is essential before launch.
 * Replaces Kartra's missing sitemap (which returned the homepage HTML).
 *
 * Includes every static route plus every dynamic /courses/[slug] and
 * /standards/[slug] page, sourced from lib/courses.ts and lib/standards.ts
 * so the sitemap stays in lockstep with the actual content.
 */

import type { MetadataRoute } from "next";
import { COURSES } from "@/lib/courses";
import { STANDARDS } from "@/lib/standards";
import { BRAND } from "@/lib/credentials";

const SITE_URL = `https://${BRAND.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/standards`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = COURSES.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const standardRoutes: MetadataRoute.Sitemap = STANDARDS.map((s) => ({
    url: `${SITE_URL}/standards/${s.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...courseRoutes, ...standardRoutes];
}
