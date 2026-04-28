/**
 * lib/blog.ts (server-only).
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
 *
 * IMPORTANT: this module pulls in `node:fs` and CANNOT be imported
 * from a client component. Browser-safe types and helpers live in
 * `lib/blog-types.ts` — re-exported below for backwards compatibility.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import type { PostMeta, Source, Topic } from "./blog-types";

export type { PostMeta, Source, Topic } from "./blog-types";
export { TOPIC_LABELS, RELATED_LINKS_BY_TOPIC, formatPostDate } from "./blog-types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type Post = PostMeta & {
  /** Rendered HTML body (markdown → HTML, GFM-enabled). */
  html: string;
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
    const { data, content } = matter(raw);
    const wordCount = countWords(content);
    return {
      slug: (data.slug as string | undefined) ?? fileToSlug(file),
      title: (data.title as string) ?? "Untitled",
      date: (data.date as string) ?? "1970-01-01",
      excerpt: (data.excerpt as string) ?? "",
      topic: ((data.topic as Topic) ?? "other"),
      sources: (data.sources as Source[]) ?? [],
      author: (data.author as string) ?? "Bernadette Tobin RN, MSc",
      wordCount,
      readingTimeMinutes: readingTime(wordCount),
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
