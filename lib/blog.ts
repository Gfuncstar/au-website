/**
 * lib/blog.ts
 *
 * Loads markdown posts from `content/blog/*.md` (the Aesthetics Unlocked
 * Journal) and turns them into typed `Post` objects the routes can
 * render. Frontmatter shape is documented in `content/blog/README.md`.
 *
 * Every post is server-rendered — we read the filesystem at build time
 * (or on-demand during dev), so adding a new .md file and pushing is
 * the only step the publishing agent has to take. Vercel rebuilds and
 * the post is live.
 *
 * The agent never edits this file. It only writes new .md files into
 * `content/blog/` and lets `getAllPosts()` pick them up.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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
};

export type Post = PostMeta & {
  /** Rendered HTML body (markdown → HTML, GFM-enabled). */
  html: string;
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

function readDir(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  // Posts must follow `YYYY-MM-DD-slug.md`. Anything else (README,
  // drafts prefixed with `_`, stray files) is ignored.
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f));
}

function fileToSlug(file: string): string {
  // 2026-04-29-welcome.md → welcome
  // Drop the leading YYYY-MM-DD- prefix if present so URLs stay clean.
  const base = file.replace(/\.md$/, "");
  const m = /^\d{4}-\d{2}-\d{2}-(.+)$/.exec(base);
  return m ? m[1] : base;
}

async function renderMarkdown(md: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(md);
  return String(file);
}

function countWords(md: string): number {
  // Strip code fences, frontmatter-leftovers, then split on whitespace.
  const stripped = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function readingTime(words: number): number {
  return Math.max(1, Math.ceil(words / 225));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = readDir();
  const posts: PostMeta[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    return {
      slug: (data.slug as string | undefined) ?? fileToSlug(file),
      title: (data.title as string) ?? "Untitled",
      date: (data.date as string) ?? "1970-01-01",
      excerpt: (data.excerpt as string) ?? "",
      topic: ((data.topic as Topic) ?? "other"),
      sources: (data.sources as Source[]) ?? [],
      author: (data.author as string) ?? "Bernadette Tobin RN, MSc",
    };
  });
  // Newest first.
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = readDir();
  const match = files.find((f) => fileToSlug(f) === slug);
  if (!match) return null;
  const raw = fs.readFileSync(path.join(BLOG_DIR, match), "utf8");
  const { data, content } = matter(raw);
  const html = await renderMarkdown(content);
  const wordCount = countWords(content);
  return {
    slug: (data.slug as string | undefined) ?? fileToSlug(match),
    title: (data.title as string) ?? "Untitled",
    date: (data.date as string) ?? "1970-01-01",
    excerpt: (data.excerpt as string) ?? "",
    topic: ((data.topic as Topic) ?? "other"),
    sources: (data.sources as Source[]) ?? [],
    author: (data.author as string) ?? "Bernadette Tobin RN, MSc",
    html,
    wordCount,
    readingTimeMinutes: readingTime(wordCount),
  };
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
