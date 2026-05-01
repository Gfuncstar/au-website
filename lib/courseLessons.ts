/**
 * lib/courseLessons.ts
 *
 * Loads lesson markdown from `content/courses/<slug>/NN-lesson-slug.md`
 * and turns each file into a typed `Lesson` the native course player
 * routes can render. Mirrors the pattern in `lib/blog.ts` so adding a
 * new lesson only requires dropping a new .md file in the course folder.
 *
 * v1: only `acne-decoded` has content. Other courses still hand off to
 * Kartra from the launchpad — see `app/members/courses/page.tsx`.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

export type LessonMeta = {
  /** URL slug derived from filename — `01-introduction.md` → `01-introduction`. */
  slug: string;
  /** 1-based order index from frontmatter. */
  order: number;
  /** Lesson title shown in the player chrome and chapter strip. */
  title: string;
  /** Short read-time hint, e.g. "8 min". */
  duration: string;
  /** One-sentence summary used on the course overview page. */
  summary: string;
  /** Marks the final lesson as the certificate step. */
  isCertificate?: boolean;
  /** Name from the LessonIcon library — see content/courses/README.md
   *  for the catalog. Missing/unknown values fall back to a generic
   *  numbered circle. */
  icon?: string;
  /** Optional path to a Bernadette audio intro (m4a/mp3) served from
   *  /public, e.g. `/audio/lessons/ACNE_M01_Introduction_AUDIO_intro17s.m4a`.
   *  When set, AudioIntroPill renders a real, playable pill. When
   *  unset, it falls back to the "Coming soon" placeholder. */
  audioIntro?: string;
  /** Optional path to the lesson video (mp4) served from /public,
   *  e.g. `/video/lessons/ACNE_M07_TreatmentPathways_LESSON_acne75.mp4`.
   *  When set, VideoPlaceholder renders the real video player. When
   *  unset, it keeps the editorial "Video coming soon" placeholder. */
  videoSrc?: string;
};

/** A "Part" — editorial divider rendered before its `startOrder`
 *  lesson on the course overview ledger. Loaded from the per-course
 *  `course.json` so authoring stays at one source of truth. */
export type CoursePart = {
  eyebrow: string;
  title: string;
  body?: string;
  startOrder: number;
};

export type Lesson = LessonMeta & {
  /** Rendered HTML body (markdown → HTML via remark). */
  html: string;
};

function readDir(courseSlug: string): string[] {
  const dir = path.join(COURSES_DIR, courseSlug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function fileToLessonSlug(file: string): string {
  return file.replace(/\.md$/, "");
}

async function renderMarkdown(md: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(md);
  return enrichLessonHtml(String(file));
}

/**
 * Lift bold-prefixed paragraphs (`**Clinical relevance:** ...`) out of
 * the running prose into semantic callout boxes the lesson stylesheet
 * paints as charcoal pull-out boxes with pink eyebrow + icon.
 *
 * Three callout types are recognised; each maps to one of the icon
 * variants painted by the .callout--<kind> CSS in globals.css:
 *   - clinical : "Clinical relevance", "Clinical tip"
 *   - key      : "Key point", "Best practice"
 *   - warning  : "Important", "Important clarification", "NICE emphasis",
 *                "Why this matters", "Red flags"
 *
 * Anything else falls back to a generic `key` callout.
 */
/**
 * Wrap raw `<table>` in a horizontal-scroll shell AND inject
 * `data-label="<header>"` on every `<td>` so the stylesheet can flip
 * tables into a card-stacked layout on narrow viewports without
 * losing column context. Both behaviours combined: wide tables look
 * editorial on desktop, readable on mobile.
 */
function transformTables(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (_m: string, inner: string) => {
    const headerSection = inner.match(/<thead>([\s\S]*?)<\/thead>/);
    const bodySection = inner.match(/<tbody>([\s\S]*?)<\/tbody>/);
    if (!headerSection || !bodySection) {
      return `<div class="lesson-body__table-wrap"><table>${inner}</table></div>`;
    }
    const headers: string[] = [];
    const thMatches = headerSection[1].match(/<th[^>]*>([\s\S]*?)<\/th>/g);
    if (thMatches) {
      for (const th of thMatches) {
        const m = th.match(/<th[^>]*>([\s\S]*?)<\/th>/);
        if (m)
          headers.push(
            m[1]
              .replace(/<[^>]+>/g, "")
              .replace(/&amp;/g, "&")
              .trim(),
          );
      }
    }
    const newBody = bodySection[1].replace(
      /<tr>([\s\S]*?)<\/tr>/g,
      (_t: string, row: string) => {
        let i = 0;
        const newRow = row.replace(/<td(\s[^>]*)?>/g, (open) => {
          const label = headers[i % Math.max(headers.length, 1)] ?? "";
          i++;
          const safe = label.replace(/"/g, "&quot;");
          // Preserve any pre-existing attributes, then append data-label.
          return open.replace(
            /^<td(\s[^>]*)?>$/,
            `<td$1 data-label="${safe}">`,
          );
        });
        return `<tr>${newRow}</tr>`;
      },
    );
    const newInner = inner.replace(bodySection[1], newBody);
    return `<div class="lesson-body__table-wrap"><table>${newInner}</table></div>`;
  });
}

/**
 * Promote major sections inside a lesson into charcoal poster bands so
 * each lesson reads as a sequence of editorial sections rather than a
 * wall of similar headings — same visual family as the "Part" dividers
 * on the chapter ledger.
 *
 * Three tiers:
 *   - <h2>            → charcoal poster band (full width, pink eyebrow)
 *   - <h3>N. ...</h3> → small charcoal pill + bold title (step-head sm)
 *   - <p><strong>N. ...</strong></p> → mid step-head
 *
 * Numbered h2s get a "SECTION 0N" eyebrow drawn from the leading number;
 * non-numbered h2s render the heading text as the title with no eyebrow
 * number.
 */
function transformStepHeadings(html: string): string {
  // <p><strong>N. ...</strong></p> → mid-weight step (mini-heading)
  let out = html.replace(
    /<p><strong>(\d{1,2})\.\s+([\s\S]*?)<\/strong><\/p>/g,
    (_m: string, num: string, title: string) => {
      const cleanTitle = title.replace(/<[^>]+>/g, "").trim();
      return `<div class="step-head step-head--mid"><span class="step-head__num">${String(num).padStart(2, "0")}</span><h4 class="step-head__title">${cleanTitle}</h4></div>`;
    },
  );

  // <h2>...</h2> → charcoal poster section band, regardless of number.
  // Unnumbered h2s get auto-numbered in document order so the eyebrows
  // read as a sequence ("SECTION 01" / "02" / "03") instead of a row of
  // identical "SECTION" labels. Each band gets an id so the
  // on-this-page nav can scroll to it.
  let autoCounter = 0;
  out = out.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m: string, raw: string) => {
    const text = raw.replace(/<[^>]+>/g, "").trim();
    const numberMatch = text.match(/^(\d{1,2})\.\s+(.+)$/);
    const num = numberMatch ? numberMatch[1] : null;
    const title = numberMatch ? numberMatch[2] : text;
    autoCounter += 1;
    const sectionNum = num ?? String(autoCounter);
    const eyebrow = `Section ${sectionNum.padStart(2, "0")}`;
    const id = `section-${sectionNum.padStart(2, "0")}`;
    return `<aside class="section-band" id="${id}"><div class="section-band__inner"><p class="section-band__eyebrow">${eyebrow}</p><h2 class="section-band__title">${title}</h2></div></aside>`;
  });

  // <h3>N. ...</h3> → small step (h3-equivalent)
  out = out.replace(
    /<h3>\s*(\d{1,2})\.\s+([\s\S]*?)<\/h3>/g,
    (_m: string, num: string, title: string) => {
      const cleanTitle = title.replace(/<[^>]+>/g, "").trim();
      return `<div class="step-head step-head--sm"><span class="step-head__num">${String(num).padStart(2, "0")}</span><h3 class="step-head__title">${cleanTitle}</h3></div>`;
    },
  );

  return out;
}

function enrichLessonHtml(html: string): string {
  const KIND_BY_LABEL: Record<
    string,
    "clinical" | "key" | "warning" | "definition"
  > = {
    "Clinical relevance": "clinical",
    "Clinical tip": "clinical",
    "Key point": "key",
    "Best practice": "key",
    "Key teaching points": "key",
    Important: "warning",
    "Important clarification": "warning",
    "NICE emphasis": "warning",
    "Why this matters": "warning",
    "Red flags": "warning",
    "Common mistakes": "warning",
    Definition: "definition",
    "Definition of Acne": "definition",
  };
  const labels = Object.keys(KIND_BY_LABEL)
    .map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  // Pattern A: inline label + body in the same paragraph.
  //   <p><strong>Clinical relevance:</strong> Hormonal acne...</p>
  const inlineRe = new RegExp(
    `<p><strong>(${labels})\\s*[:：]\\s*<\\/strong>\\s*([\\s\\S]*?)<\\/p>`,
    "g",
  );
  // Pattern B: label-only paragraph immediately followed by a body
  // paragraph. Catches `**Definition**\n\nAcne (medically termed...)`.
  const splitRe = new RegExp(
    `<p><strong>(${labels})<\\/strong><\\/p>\\s*<p>([\\s\\S]*?)<\\/p>`,
    "g",
  );
  const wrap = (label: string, body: string) => {
    const kind = KIND_BY_LABEL[label] ?? "key";
    return `<aside class="callout callout--${kind}"><p class="callout__label">${label}</p><div class="callout__body">${body.trim()}</div></aside>`;
  };
  const withCallouts = html
    .replace(inlineRe, (_m: string, label: string, body: string) => wrap(label, body))
    .replace(splitRe, (_m: string, label: string, body: string) => wrap(label, body));
  const withSteps = transformStepHeadings(withCallouts);
  return transformTables(withSteps);
}

export function getCourseLessonsMeta(courseSlug: string): LessonMeta[] {
  const files = readDir(courseSlug);
  const lessons = files.map((file) => {
    const raw = fs.readFileSync(
      path.join(COURSES_DIR, courseSlug, file),
      "utf8",
    );
    const { data } = matter(raw);
    return {
      slug: fileToLessonSlug(file),
      order: (data.order as number) ?? 0,
      title: (data.title as string) ?? "Untitled",
      duration: (data.duration as string) ?? "",
      summary: (data.summary as string) ?? "",
      isCertificate: (data.isCertificate as boolean) ?? false,
      icon: data.icon as string | undefined,
      audioIntro: data.audioIntro as string | undefined,
      videoSrc: data.videoSrc as string | undefined,
    } satisfies LessonMeta;
  });
  lessons.sort((a, b) => a.order - b.order);
  return lessons;
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string,
): Promise<Lesson | null> {
  const files = readDir(courseSlug);
  const match = files.find((f) => fileToLessonSlug(f) === lessonSlug);
  if (!match) return null;
  const raw = fs.readFileSync(path.join(COURSES_DIR, courseSlug, match), "utf8");
  const { data, content } = matter(raw);
  const html = await renderMarkdown(content);
  return {
    slug: fileToLessonSlug(match),
    order: (data.order as number) ?? 0,
    title: (data.title as string) ?? "Untitled",
    duration: (data.duration as string) ?? "",
    summary: (data.summary as string) ?? "",
    isCertificate: (data.isCertificate as boolean) ?? false,
    icon: data.icon as string | undefined,
    audioIntro: data.audioIntro as string | undefined,
    videoSrc: data.videoSrc as string | undefined,
    html,
  };
}

/** Auto-discover every course slug that has at least one lesson md
 *  file. Used by `generateStaticParams()` so adding a new course
 *  folder Just Works. */
export function getNativeCourseSlugs(): string[] {
  if (!fs.existsSync(COURSES_DIR)) return [];
  return fs
    .readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => readDir(slug).length > 0);
}

/** Read the per-course `course.json` and return the editorial Part
 *  groupings used by the chapter-ledger dividers. Returns an empty
 *  array if the file isn't present (course renders as a flat list). */
export function getCoursePartsConfig(courseSlug: string): CoursePart[] {
  const file = path.join(COURSES_DIR, courseSlug, "course.json");
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as { parts?: CoursePart[] };
    return parsed.parts ?? [];
  } catch {
    return [];
  }
}

/** Extract h2 section titles from rendered lesson HTML for use in the
 *  on-this-page nav. Each entry's id matches the `id` attribute the
 *  transformStepHeadings pass injects on the section-band wrapper. */
export function getLessonSections(
  html: string,
): { id: string; label: string; eyebrow: string }[] {
  const out: { id: string; label: string; eyebrow: string }[] = [];
  const re =
    /<aside class="section-band" id="([^"]+)"><div class="section-band__inner"><p class="section-band__eyebrow">([^<]+)<\/p><h2 class="section-band__title">([^<]+)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({ id: m[1], eyebrow: m[2], label: m[3] });
  }
  return out;
}

export function hasNativeCourse(courseSlug: string): boolean {
  return readDir(courseSlug).length > 0;
}

/** Find the previous and next lessons in order — used by the player nav. */
export function getLessonNeighbours(
  lessons: LessonMeta[],
  currentSlug: string,
): { prev: LessonMeta | null; next: LessonMeta | null; index: number } {
  const i = lessons.findIndex((l) => l.slug === currentSlug);
  return {
    prev: i > 0 ? lessons[i - 1] : null,
    next: i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : null,
    index: i,
  };
}
