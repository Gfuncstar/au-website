/**
 * scripts/build-kartra-emails.ts
 *
 * Converts every Kartra email draft from markdown to HTML, using the
 * Aesthetics Unlocked broadcast design template as the visual shell.
 *
 * The design language is the same one used for AU - Welcome - Free
 * Taster, AU - Broadcast (base), and the other reusable Kartra
 * templates living one folder up at
 * `clone-aesthetics-unlocked/kartra-emails/01-06.html`. That keeps
 * every email Bernadette sends, whether it's a sequence step, a
 * broadcast, or a receipt, visually consistent inside the inbox.
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
 * Visual structure of each generated email:
 *
 *   1. Charcoal header bar (#212121) with a 48x3px pink accent rule
 *      and the AU pink-on-dark logo image
 *   2. Hero block: Oswald uppercase eyebrow ("Welcome", "Day 4", etc.)
 *      then Montserrat 900 hero headline (the email's subject)
 *   3. Body paragraphs in Lato 17px with line-height 1.65
 *   4. Pink CTA button (Montserrat 700 uppercase, square 5px corners)
 *      where the markdown had **[ TEXT → ]** + a URL
 *   5. Sign-off: "Bernadette" in Georgia italic pink + Oswald credential line
 *   6. Charcoal footer with brand line, postal placeholder,
 *      unsubscribe / privacy / homepage links
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ROOT = path.join(process.cwd(), "kartra-emails");

// AU brand palette (matches the design template + OG images)
const PINK = "#EE5A8E";
const CHARCOAL = "#212121";
const CREAM = "#FAF6F1";
const WHITE = "#FFFFFF";

// SITE_URL is the brand-facing domain used for body links + footer
// (homepage, /privacy, /courses/<slug>). Visible to recipients when
// they click; should match the brand. Resolves to Vercel post-DNS-flip.
const SITE_URL = "https://aestheticsunlocked.co.uk";

// LOGO_URL is the static-asset URL for the email header wordmark. We
// deliberately use the Vercel holding subdomain instead of SITE_URL
// for two reasons:
//   1. It works today (DNS still on Kartra means the brand domain
//      doesn't yet serve /brand/* assets).
//   2. It continues to work after DNS flips, because Vercel keeps
//      the project's holding URL alive permanently alongside any
//      added custom domain.
// Recipients never see this URL in the visible UI; it only appears
// in <img src>. Using the holding subdomain is the most reliable
// path with no rebuild needed at launch.
const LOGO_URL =
  "https://au-website-one.vercel.app/brand/au-logo-pink-on-dark.png";

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

/** Pull the `# E1 — Topic (Day 0)` heading apart so we can produce a
 *  short editorial eyebrow per email position. */
function parsePositionHeading(content: string): {
  position: number | null;
  topic: string | null;
  day: number | null;
} {
  const match = content.match(/^#\s*E(\d+)\s*[—–-]\s*([^(]+?)\s*(?:\(Day\s*(\d+)\))?\s*$/m);
  if (!match) return { position: null, topic: null, day: null };
  return {
    position: parseInt(match[1], 10),
    topic: match[2].trim(),
    day: match[3] ? parseInt(match[3], 10) : null,
  };
}

/** Pull subject, preheader and body out of the markdown content. */
function parseEmailContent(content: string): ParsedEmail {
  const subjectMatch = content.match(/\*\*Subject:\*\*\s*`([^`]+)`/);
  const preheaderMatch = content.match(/\*\*Preheader:\*\*\s*`([^`]+)`/);
  const bodyMatch = content.match(/##\s*Body\s*\n([\s\S]*?)$/);

  return {
    subject: subjectMatch?.[1] ?? "(missing subject)",
    preheader: preheaderMatch?.[1] ?? "(missing preheader)",
    bodyMarkdown: (bodyMatch?.[1] ?? "").trim(),
  };
}

/**
 * Strip the markdown signature block at the very end so we can render
 * Bernadette's signature in proper HTML in the sign-off panel rather
 * than as plain text in the body. The convention every draft follows:
 *
 *   Bernadette
 *
 *   *Bernadette - Aesthetics Unlocked*
 *   *hello@aunlock.co.uk · aestheticsunlocked.co.uk*  (sometimes)
 */
function stripSignature(bodyMarkdown: string): string {
  const lines = bodyMarkdown.split("\n");
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
  return lines.slice(0, cutIndex).join("\n").trimEnd();
}

/**
 * Strip the leading "Hi {first_name}," paragraph so it doesn't appear
 * twice when the hero already greets the reader. The drafts open with
 * "Hi {first_name}," which we keep in the body for warmth, but the
 * preheader / hero combination already establishes presence. Decision:
 * keep the greeting in the body. This function is left for future use
 * if the design ever wants the hero to carry the greeting.
 */
// (intentionally not used; placeholder for design alternatives)

/** Replace the CTA marker pattern `**[ Text → ]**` followed by a URL
 *  with a placeholder token that we substitute after the markdown to
 *  HTML conversion. The token avoids underscores so remark doesn't
 *  treat it as bold. */
const CTA_PATTERN =
  /\*\*\[\s*([^\n\]]+?)\s*\]\*\*\s*\n+\s*(https?:\/\/\S+|\{[A-Za-z0-9_]+\})/g;

function extractCtas(bodyMd: string): {
  bodyWithTokens: string;
  ctas: Array<{ token: string; text: string; url: string }>;
} {
  const ctas: Array<{ token: string; text: string; url: string }> = [];
  let i = 0;
  const bodyWithTokens = bodyMd.replace(CTA_PATTERN, (_, text: string, url: string) => {
    const token = `AUCTAMARK${i}AUCTAEND`;
    const cleanText = text.replace(/\s*[→>]+\s*$/u, "").trim();
    ctas.push({ token, text: cleanText, url: url.trim() });
    i++;
    return token;
  });
  return { bodyWithTokens, ctas };
}

async function markdownToHtml(md: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(md);
  return String(file);
}

/** Re-style every <p> in the rendered body markdown so the inline
 *  styles match the design template's body-p class (Lato 17px, 1.65
 *  line-height, charcoal). */
function styleBodyParagraphs(html: string): string {
  return html.replace(
    /<p>/g,
    `<p class="body-p" style="margin:0 0 20px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:17px;line-height:1.65;color:${CHARCOAL};">`,
  );
}

function ctaButtonHtml(text: string, url: string): string {
  return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="${PINK}" style="border-radius:5px;">
                    <a href="${url}" target="_blank"
                       style="display:inline-block;padding:14px 28px;font-family:'Montserrat',Helvetica,Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.5px;text-transform:uppercase;color:${WHITE};text-decoration:none;border-radius:5px;">
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

/** Pick a short editorial eyebrow per email position. The hero h1 is
 *  the subject, which already carries the substance; the eyebrow is
 *  just a progress marker. */
function eyebrowFor(args: {
  position: number | null;
  day: number | null;
  isPaidWelcome: boolean;
}): string {
  if (args.isPaidWelcome) return "Welcome";
  if (args.position === 1) return "Welcome";
  if (args.day != null) return `Day ${args.day}`;
  if (args.position != null) return `Email ${args.position}`;
  return "Aesthetics Unlocked";
}

/** True for files inside any `*-paid/` directory, which carry
 *  post-purchase welcomes (single email per paid course). */
function isPaidWelcome(mdPath: string): boolean {
  const dir = path.basename(path.dirname(mdPath));
  return dir.endsWith("-paid");
}

function renderShell(args: {
  filename: string;
  fm: Frontmatter;
  parsed: ParsedEmail;
  bodyHtml: string;
  ctaHtml: string | null;
  eyebrow: string;
}): string {
  const { filename, fm, parsed, bodyHtml, ctaHtml, eyebrow } = args;
  const triggerLine =
    fm.day === 0 || fm["delay-from-previous"] === "trigger"
      ? `Trigger tag:               ${fm["trigger-tag"] ?? "(set in README)"}`
      : `Delay from previous email: ${fm["delay-from-previous"] ?? "(set in README)"}`;

  const ctaBlock = ctaHtml
    ? `
          <!-- CTA -->
          <tr>
            <td align="left" style="padding:0 40px 40px 40px;" class="px">${ctaHtml}
            </td>
          </tr>
`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<!--
  ============================================================
  KARTRA-READY EMAIL: ${filename}
  ============================================================
  Configure these fields in Kartra (Sequence step or Broadcast):

    Subject:    ${parsed.subject}
    Preheader:  ${parsed.preheader}
    Sender:     ${fm.sender ?? "Bernadette - Aesthetics Unlocked <hello@aunlock.co.uk>"}
    ${triggerLine}

  Then paste the contents of this file (from <html> to </html>)
  into Kartra → Email step → HTML editor. The brand styling is
  baked in: charcoal header, pink CTA, sign-off, footer. Don't
  switch to visual editor mode after pasting; Kartra will
  rewrite the inline styles and break the layout.
  ============================================================
-->
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(parsed.subject)}</title>

  <!-- Web fonts. Won't render in Outlook desktop; system fallbacks
       are inlined on every text element. -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Lato:wght@400;700&family=Oswald:wght@500;600&display=swap" rel="stylesheet" />

  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-h1 { font-size: 28px !important; line-height: 1.1 !important; }
      .body-p { font-size: 16px !important; line-height: 1.6 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};font-family:'Lato',Helvetica,Arial,sans-serif;color:${CHARCOAL};-webkit-font-smoothing:antialiased;">

  <!-- Preheader: shows in inbox preview, hidden in body. -->
  <div style="display:none;font-size:1px;color:${CREAM};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(parsed.preheader)}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CREAM};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width:600px;max-width:600px;background-color:${WHITE};border-radius:5px;overflow:hidden;">

          <!-- HEADER: pink accent rule + AU wordmark -->
          <tr>
            <td style="background-color:${CHARCOAL};padding:32px 40px 28px 40px;" class="px">
              <div style="width:48px;height:3px;background-color:${PINK};margin-bottom:18px;line-height:3px;font-size:0;">&nbsp;</div>
              <a href="${SITE_URL}" target="_blank" style="display:inline-block;text-decoration:none;border:0;">
                <img src="${LOGO_URL}"
                     width="180"
                     height="65"
                     alt="Aesthetics Unlocked"
                     style="display:block;border:0;outline:none;text-decoration:none;height:65px;width:180px;max-width:180px;line-height:100%;-ms-interpolation-mode:bicubic;" />
              </a>
            </td>
          </tr>

          <!-- HERO: eyebrow + headline -->
          <tr>
            <td style="padding:48px 40px 24px 40px;" class="px">
              <p style="margin:0 0 18px 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:${PINK};line-height:1;">
                ${escapeHtml(eyebrow)}
              </p>
              <h1 class="hero-h1" style="margin:0;font-family:'Montserrat',Helvetica,Arial,sans-serif;font-weight:900;font-size:32px;line-height:1.1;letter-spacing:-1px;color:${CHARCOAL};">
                ${escapeHtml(parsed.subject)}
              </h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:0 40px 24px 40px;" class="px">
${bodyHtml}
            </td>
          </tr>
${ctaBlock}
          <!-- SIGN-OFF -->
          <tr>
            <td style="padding:8px 40px 48px 40px;" class="px">
              <p style="margin:0;font-family:Georgia,'Spectral',serif;font-style:italic;font-size:24px;line-height:1.2;color:${PINK};">
                Bernadette
              </p>
              <p style="margin:6px 0 0 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${CHARCOAL};opacity:0.65;">
                Bernadette Tobin RN, MSc &middot; Aesthetics Unlocked
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:${CHARCOAL};padding:32px 40px;" class="px">
              <p style="margin:0 0 12px 0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${PINK};line-height:1.4;">
                Aesthetics Unlocked&reg;
              </p>
              <p style="margin:0 0 14px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${WHITE};opacity:0.8;">
                Education for UK aesthetic practitioners by Bernadette Tobin
                RN, MSc. Educator of the Year 2026 Nominee, Beauty &amp;
                Aesthetics Awards.
              </p>
              <p style="margin:0 0 12px 0;font-family:'Lato',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${WHITE};opacity:0.55;">
                Aesthetics Unlocked, 17a Friars Lane, Braintree, Essex CM7 9BL<br />
                Replies welcome at
                <a href="mailto:hello@aunlock.co.uk" style="color:${WHITE};text-decoration:underline;">hello@aunlock.co.uk</a>.
              </p>
              <p style="margin:0;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${WHITE};opacity:0.55;">
                <a href="{unsubscribe_link}" style="color:${WHITE};text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/privacy" style="color:${WHITE};text-decoration:underline;">Privacy</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}" style="color:${WHITE};text-decoration:underline;">aestheticsunlocked.co.uk</a>
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

  if (parsed.subject === "(missing subject)") {
    console.warn(`  ⚠ ${mdPath}: missing Subject line, skipping`);
    return null;
  }

  // Identify the email's position so we can pick a short eyebrow.
  // Prefer frontmatter; fall back to the H1 line in the markdown.
  const heading = parsePositionHeading(content);
  const position = fm.position ?? heading.position;
  const day = fm.day ?? heading.day;
  const eyebrow = eyebrowFor({
    position,
    day,
    isPaidWelcome: isPaidWelcome(mdPath),
  });

  // Strip signature, then extract CTAs into placeholder tokens, render
  // markdown to HTML, restyle paragraphs, then substitute the styled
  // CTA buttons back in. CTA may not exist (some emails don't have a
  // single button), in which case we omit the CTA block entirely.
  const bodyMd = stripSignature(parsed.bodyMarkdown);
  const { bodyWithTokens, ctas } = extractCtas(bodyMd);

  let bodyHtml = await markdownToHtml(bodyWithTokens);
  bodyHtml = styleBodyParagraphs(bodyHtml);

  // The CTA renders inside its own table row in the design template,
  // not inline with body paragraphs. Pull the FIRST CTA out for the
  // dedicated row; if there are extra CTAs (rare), inline them where
  // they appeared so we don't drop content.
  let firstCtaHtml: string | null = null;
  for (let i = 0; i < ctas.length; i++) {
    const cta = ctas[i];
    if (i === 0) {
      firstCtaHtml = ctaButtonHtml(cta.text, cta.url);
      // Strip the placeholder paragraph wrapper out of the body so we
      // don't render an empty <p> where the CTA used to be.
      bodyHtml = bodyHtml
        .replace(
          new RegExp(`<p[^>]*>\\s*${cta.token}\\s*</p>`, "g"),
          "",
        )
        .replace(cta.token, "");
    } else {
      const inlineButton = ctaButtonHtml(cta.text, cta.url);
      bodyHtml = bodyHtml
        .replace(
          new RegExp(`<p[^>]*>\\s*${cta.token}\\s*</p>`, "g"),
          inlineButton,
        )
        .replace(cta.token, inlineButton);
    }
  }

  const htmlPath = mdPath.replace(/\.md$/, ".html");
  const html = renderShell({
    filename: path.basename(mdPath),
    fm,
    parsed,
    bodyHtml,
    ctaHtml: firstCtaHtml,
    eyebrow,
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
  console.log(
    `\nDone. Bernadette pastes each .html into Kartra's email body editor.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
