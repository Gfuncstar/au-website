/**
 * scripts/build-kartra-emails.ts
 *
 * Converts every Kartra email draft from markdown to HTML, in the
 * Aesthetics Unlocked brand template. Bernadette pastes the resulting
 * HTML straight into Kartra's email body editor; no manual styling
 * needed beyond confirming the subject + preheader + trigger.
 *
 * Why: the .md files are the canonical drafts (review, voice audit,
 * version control). Kartra's email editor only accepts HTML or
 * rich text. This script bridges that gap so editing a draft is one
 * file, one re-run, one paste.
 *
 * Run with:
 *   npm run build-kartra-emails
 *
 * Output: each `kartra-emails/<funnel>/E0X-<topic>.md` produces a
 * sibling `kartra-emails/<funnel>/E0X-<topic>.html`. The HTML file
 * opens with a comment block listing the subject, preheader, trigger
 * tag, delay, and sender so Bernadette can configure those fields in
 * Kartra without re-opening the .md.
 *
 * The HTML email shell mirrors the magic-link template (charcoal
 * header strip, white card body, pink CTA button, footer) but is
 * tuned for letter-style sequence content: no poster headline, no
 * OTP block, just Bernadette's voice with one CTA button per email.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ROOT = path.join(process.cwd(), "kartra-emails");

const PINK = "#e697b7";
const CHARCOAL = "#212121";
const CREAM = "#f5f1ec";

type Frontmatter = {
  sequence?: string;
  position?: number;
  day?: number;
  "delay-from-previous"?: string;
  "trigger-tag"?: string;
  sender?: string;
  "cta-url"?: string;
  "cta-url-token"?: string;
  status?: string;
};

type ParsedEmail = {
  subject: string;
  preheader: string;
  bodyMarkdown: string;
};

/**
 * Pull subject, preheader and body out of the markdown content
 * (everything below the YAML frontmatter).
 */
function parseEmailContent(content: string): ParsedEmail {
  const subjectMatch = content.match(/\*\*Subject:\*\*\s*`([^`]+)`/);
  const preheaderMatch = content.match(/\*\*Preheader:\*\*\s*`([^`]+)`/);
  const bodyMatch = content.match(/##\s*Body\s*\n([\s\S]*?)$/);

  const body = (bodyMatch?.[1] ?? "").trim();

  return {
    subject: subjectMatch?.[1] ?? "(missing subject)",
    preheader: preheaderMatch?.[1] ?? "(missing preheader)",
    bodyMarkdown: body,
  };
}

/**
 * Strip the markdown signature block at the very end so we can render
 * Bernadette's signature in proper HTML rather than as plain text.
 *
 * The convention every email follows:
 *
 *   Bernadette
 *
 *   *Bernadette - Aesthetics Unlocked*
 *   *hello@aunlock.co.uk · aestheticsunlocked.co.uk*       (sometimes)
 */
function splitBodyAndSignature(bodyMarkdown: string): {
  bodyMd: string;
  signatureLines: string[];
} {
  const lines = bodyMarkdown.split("\n");

  // Walk back from the end, collecting lines that are part of the
  // signature: italic blocks, the lone "Bernadette" line, blank lines.
  let cutIndex = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (
      line === "" ||
      line === "Bernadette" ||
      line.startsWith("*Bernadette") ||
      line.startsWith("*hello@") ||
      line.startsWith("*Aesthetics Unlocked")
    ) {
      cutIndex = i;
    } else {
      break;
    }
  }

  return {
    bodyMd: lines.slice(0, cutIndex).join("\n").trimEnd(),
    signatureLines: lines.slice(cutIndex).map((l) => l.trim()).filter(Boolean),
  };
}

/**
 * Replace the CTA marker pattern `**[ Text → ]**` followed by a URL
 * with a placeholder token that we can substitute for a styled
 * <a> button after the markdown → HTML conversion. Doing it in two
 * passes keeps remark out of the inline button HTML.
 */
const CTA_PATTERN =
  /\*\*\[\s*([^\n\]]+?)\s*\]\*\*\s*\n+\s*(https?:\/\/\S+|\{[A-Za-z0-9_]+\})/g;

function extractCtas(bodyMd: string): {
  bodyWithTokens: string;
  ctas: Array<{ token: string; text: string; url: string }>;
} {
  const ctas: Array<{ token: string; text: string; url: string }> = [];
  let i = 0;
  const bodyWithTokens = bodyMd.replace(CTA_PATTERN, (_, text: string, url: string) => {
    // No underscores: leading/trailing `__` would trigger markdown's
    // bold-text parser inside remark, mangling the token. Capital
    // letters and digits only stay inert through remark.
    const token = `AUCTAMARK${i}AUCTAEND`;
    // Drop the trailing "→" arrow if present, we render our own arrow.
    const cleanText = text.replace(/\s*[→>]+\s*$/u, "").trim();
    ctas.push({ token, text: cleanText, url: url.trim() });
    i++;
    return token;
  });
  return { bodyWithTokens, ctas };
}

async function markdownToHtml(md: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(md);
  return String(file);
}

function ctaButtonHtml(text: string, url: string): string {
  return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0;">
        <tr>
          <td style="background-color: ${PINK}; border-radius: 5px;">
            <a href="${url}" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; line-height: 1; letter-spacing: 0.04em; color: ${CHARCOAL}; text-decoration: none; border-radius: 5px;">
              ${escapeHtml(text)} &rarr;
            </a>
          </td>
        </tr>
      </table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderShell(args: {
  filename: string;
  fm: Frontmatter;
  parsed: ParsedEmail;
  bodyHtml: string;
}): string {
  const { filename, fm, parsed, bodyHtml } = args;
  const triggerLine =
    fm.day === 0
      ? `Trigger tag: ${fm["trigger-tag"] ?? "(set in README)"}`
      : `Delay from previous email: ${fm["delay-from-previous"] ?? "(set in README)"}`;

  return `<!--
============================================================
KARTRA-READY EMAIL: ${filename}

Configure these fields in Kartra (Sequence → Email):

  Subject:    ${parsed.subject}
  Preheader:  ${parsed.preheader}
  Sender:     ${fm.sender ?? "Bernadette - Aesthetics Unlocked <hello@aunlock.co.uk>"}
  ${triggerLine}

Then paste the contents of <body> below into Kartra's HTML editor.
The brand styling (charcoal header, pink CTA, footer) is baked in.
============================================================
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(parsed.subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${CREAM}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: ${CHARCOAL};">
  <!-- Hidden preheader, shows in inbox preview -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; visibility: hidden; mso-hide: all;">
    ${escapeHtml(parsed.preheader)}
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${CREAM}; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 5px; overflow: hidden;">

          <!-- Charcoal header strip with pink eyebrow -->
          <tr>
            <td style="background-color: ${CHARCOAL}; padding: 20px 40px;">
              <p style="margin: 0; font-size: 11px; line-height: 1; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: ${PINK};">
                Aesthetics Unlocked
              </p>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 16px; line-height: 1.6; color: ${CHARCOAL};">
${bodyHtml}
              </div>

              <!-- Sign-off -->
              <p style="margin: 28px 0 4px 0; font-size: 16px; line-height: 1.55; color: ${CHARCOAL};">Bernadette</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.55; color: #888888; font-style: italic;">
                Bernadette &middot; Aesthetics Unlocked<br />
                hello@aunlock.co.uk &middot; aestheticsunlocked.co.uk
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #eeeeee; padding: 20px 40px; background-color: #ffffff;">
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #999999; letter-spacing: 0.06em;">
                Aesthetics Unlocked &middot; Educator-led training for UK aesthetic practitioners.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; line-height: 1.5; color: #999999;">
                Need help? Email
                <a href="mailto:hello@aunlock.co.uk" style="color: #555555; text-decoration: underline;">hello@aunlock.co.uk</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

async function buildOne(mdPath: string): Promise<{
  mdPath: string;
  htmlPath: string;
  subject: string;
} | null> {
  const raw = fs.readFileSync(mdPath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;
  const parsed = parseEmailContent(content);

  // Skip files that don't look like draftable emails (e.g. malformed)
  if (parsed.subject === "(missing subject)") {
    console.warn(`  ⚠ ${mdPath}: missing Subject line, skipping`);
    return null;
  }

  // Strip signature, then extract CTAs into placeholder tokens, render
  // markdown → HTML, then substitute the styled buttons back in.
  const { bodyMd } = splitBodyAndSignature(parsed.bodyMarkdown);
  const { bodyWithTokens, ctas } = extractCtas(bodyMd);

  let bodyHtml = await markdownToHtml(bodyWithTokens);
  for (const cta of ctas) {
    bodyHtml = bodyHtml.replace(
      new RegExp(`<p>\\s*${cta.token}\\s*</p>`, "g"),
      ctaButtonHtml(cta.text, cta.url),
    );
    bodyHtml = bodyHtml.replace(cta.token, ctaButtonHtml(cta.text, cta.url));
  }

  const htmlPath = mdPath.replace(/\.md$/, ".html");
  const html = renderShell({
    filename: path.basename(mdPath),
    fm,
    parsed,
    bodyHtml,
  });
  fs.writeFileSync(htmlPath, html, "utf8");

  return { mdPath, htmlPath, subject: parsed.subject };
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`No kartra-emails directory at ${ROOT}`);
    process.exit(1);
  }

  const sequenceDirs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => !d.name.startsWith("_"))
    .map((d) => path.join(ROOT, d.name));

  const built: Array<{ mdPath: string; htmlPath: string; subject: string }> = [];

  for (const dir of sequenceDirs) {
    const mdFiles = fs
      .readdirSync(dir)
      .filter((f) => /^E\d+-.+\.md$/.test(f))
      .map((f) => path.join(dir, f));

    for (const mdPath of mdFiles) {
      const result = await buildOne(mdPath);
      if (result) built.push(result);
    }
  }

  console.log(`\nBuilt ${built.length} Kartra-ready HTML emails:\n`);
  for (const b of built) {
    const rel = path.relative(process.cwd(), b.htmlPath);
    console.log(`  ${rel}`);
    console.log(`    Subject: ${b.subject}`);
  }
  console.log(`\nDone. Bernadette pastes each .html into Kartra's email body editor.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
