/**
 * lib/blog-types.ts
 *
 * Browser-safe slice of the blog module. Holds the type aliases,
 * topic-label constants, related-links map, and pure helpers that
 * client components need to import without dragging in `node:fs` (the
 * publishing-side `lib/blog.ts` reads the filesystem and can't be
 * bundled for the client).
 *
 * Server-side code (`getAllPosts`, `getPostBySlug`) lives in
 * `lib/blog.ts` and re-exports from here for backwards compatibility.
 */

export type Topic =
  | "ingredient-science"
  | "treatments"
  | "regulation"
  | "studies"
  | "myths"
  | "other";

export const TOPIC_LABELS: Record<Topic, string> = {
  "ingredient-science": "Ingredient science",
  treatments: "Treatments",
  regulation: "Regulation",
  studies: "Studies",
  myths: "Myth, corrected",
  other: "Editorial",
};

export type Source = {
  /** Display title of the source (e.g. journal article, body statement). */
  title: string;
  /** URL pointing to the primary source. */
  url: string;
  /** Publisher / outlet (e.g. JAAD, MHRA, Aesthetics Journal). */
  publisher: string;
};

export type PostMeta = {
  /** URL slug — derived from filename if not set in frontmatter. */
  slug: string;
  /** Headline. */
  title: string;
  /** ISO date — drives ordering. */
  date: string;
  /** One-sentence summary used on the index and OG cards. */
  excerpt: string;
  /** Topic — drives the eyebrow label and topic filtering later. */
  topic: Topic;
  /** Reputable sources cited in the post (minimum two for any claim). */
  sources: Source[];
  /** Author byline. Defaults to Bernadette. */
  author: string;
  /** Word count of the body (frontmatter excluded). */
  wordCount: number;
  /** Estimated reading time in minutes at 225 wpm. */
  readingTimeMinutes: number;
};

/**
 * Suggested internal links per topic — surfaced at the foot of every
 * post under "Continue your reading" to send readers (and Google) into
 * the deeper site. Keep these in lockstep with the actual routes that
 * exist in `app/`.
 */
export const RELATED_LINKS_BY_TOPIC: Record<
  Topic,
  ReadonlyArray<{ href: string; label: string }>
> = {
  "ingredient-science": [
    { href: "/courses/acne-decoded", label: "Acne Decoded — the NICE-aligned acne course" },
    { href: "/courses/rosacea-beyond-redness", label: "Rosacea Beyond Redness" },
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
  ],
  treatments: [
    { href: "/courses/rag-pathway", label: "The RAG Pathway — the four-week regulation programme" },
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
    { href: "/courses", label: "All Aesthetics Unlocked courses" },
  ],
  regulation: [
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
    { href: "/courses/rag-pathway", label: "The RAG Pathway — the four-week regulation programme" },
    { href: "/standards", label: "The eight regulators we teach against" },
  ],
  studies: [
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
    { href: "/courses/rag-pathway", label: "The RAG Pathway — the four-week regulation programme" },
    { href: "/about", label: "About Bernadette Tobin RN, MSc" },
  ],
  myths: [
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
    { href: "/standards", label: "The eight regulators we teach against" },
    { href: "/courses", label: "All Aesthetics Unlocked courses" },
  ],
  other: [
    { href: "/courses", label: "All Aesthetics Unlocked courses" },
    { href: "/regulation", label: "UK aesthetics regulation, decoded" },
    { href: "/about", label: "About Bernadette Tobin RN, MSc" },
  ],
};

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
