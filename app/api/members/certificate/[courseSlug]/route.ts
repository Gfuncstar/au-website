/**
 * GET /api/members/certificate/[courseSlug] — generate and download a
 * Certificate of Completion PDF for a course the signed-in member
 * has fully completed.
 *
 * Verification chain (any failure → no PDF):
 *   1. Course exists and has native lesson content
 *   2. Member is signed in (Supabase session)
 *   3. Member has a row in public.members (name lookup)
 *   4. Every lesson in the course has a matching lesson_progress
 *      row for this member, i.e. course is fully complete
 *
 * On success returns a PDF stream with attachment headers so the
 * browser triggers a download. On any verification failure returns
 * a JSON error so the caller can show a calm message.
 *
 * Brand decisions:
 *   - A4 portrait (595 × 842 pt)
 *   - Helvetica family (closest of the PDF native fonts to AU's
 *     Montserrat/Lato). Custom font embedding deferred to v2.
 *   - Charcoal #212121 body, AU pink #e697b7 accent rule + signature
 *     line, cream-white background.
 *   - Bernadette's credentials block at the foot, verifiable on the
 *     NMC public register.
 */

import { type NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses";
import { getCourseLessonsMeta, hasNativeCourse } from "@/lib/courseLessons";

const AU_CHARCOAL = rgb(0.129, 0.129, 0.129);
const AU_PINK = rgb(0.902, 0.592, 0.718);
const AU_MID = rgb(0.42, 0.42, 0.42);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> },
) {
  const { courseSlug } = await params;

  // 1. Course must exist and have native content (sanity check —
  //    we don't issue certificates for courses that don't have
  //    lesson markdown to back the completion claim).
  const course = getCourse(courseSlug);
  if (!course || !hasNativeCourse(courseSlug)) {
    return NextResponse.json(
      { ok: false, error: "course_not_found" },
      { status: 404 },
    );
  }

  // 2. Auth.
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "auth_not_configured" },
      { status: 500 },
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "no_session" },
      { status: 401 },
    );
  }

  // 3. Member name lookup. Falls back to email local-part if the
  //    name fields are blank.
  const { data: memberRow } = await supabase
    .from("members")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const first = (memberRow?.first_name as string | null) ?? "";
  const last = (memberRow?.last_name as string | null) ?? "";
  const email =
    (memberRow?.email as string | null) ?? user.email ?? "Member";
  const fullName =
    [first, last].filter(Boolean).join(" ").trim() ||
    email.split("@")[0] ||
    "Member";

  // 4. Completion check.
  const lessonSlugs = getCourseLessonsMeta(courseSlug).map((l) => l.slug);
  if (lessonSlugs.length === 0) {
    return NextResponse.json(
      { ok: false, error: "course_has_no_lessons" },
      { status: 404 },
    );
  }
  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, completed_at")
    .eq("member_id", user.id)
    .eq("course_slug", courseSlug);
  const completed = new Set(
    (progressRows ?? []).map((r) => r.lesson_slug as string),
  );
  const allDone = lessonSlugs.every((s) => completed.has(s));
  if (!allDone) {
    return NextResponse.json(
      { ok: false, error: "course_not_complete" },
      { status: 403 },
    );
  }

  const completionDate = (() => {
    const ts = (progressRows ?? [])
      .map((r) => new Date(r.completed_at as string).getTime())
      .filter((n) => !Number.isNaN(n));
    return ts.length > 0 ? new Date(Math.max(...ts)) : new Date();
  })();
  const completionDateLabel = completionDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 5. Generate the PDF.
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${course.title} — Certificate of Completion`);
  pdf.setAuthor("Aesthetics Unlocked");
  pdf.setSubject("Certificate of Completion");
  pdf.setProducer("Aesthetics Unlocked");

  const page = pdf.addPage([595, 842]);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const W = page.getWidth();
  const H = page.getHeight();

  // Top eyebrow band — small charcoal caps, centred.
  drawCentred(page, "AESTHETICS UNLOCKED®", helvBold, 11, H - 80, AU_CHARCOAL, {
    letterSpacing: 4,
  });

  // Pink accent rule below the eyebrow.
  page.drawLine({
    start: { x: W / 2 - 30, y: H - 100 },
    end: { x: W / 2 + 30, y: H - 100 },
    thickness: 1.5,
    color: AU_PINK,
  });

  // "Certificate of Completion" — display heading.
  drawCentred(
    page,
    "Certificate of Completion",
    helvBold,
    36,
    H - 180,
    AU_CHARCOAL,
  );

  // "This is to certify that" eyebrow.
  drawCentred(
    page,
    "THIS IS TO CERTIFY THAT",
    helv,
    11,
    H - 250,
    AU_MID,
    { letterSpacing: 3 },
  );

  // Member name — bold, centred, large.
  drawCentred(page, fullName, helvBold, 28, H - 300, AU_CHARCOAL);

  // Pink underline beneath the name.
  page.drawLine({
    start: { x: W / 2 - 90, y: H - 312 },
    end: { x: W / 2 + 90, y: H - 312 },
    thickness: 1,
    color: AU_PINK,
  });

  // "has successfully completed" connector.
  drawCentred(
    page,
    "has successfully completed the course",
    helv,
    13,
    H - 360,
    AU_MID,
  );

  // Course title — bold italic, centred.
  drawCentred(page, course.title, helvOblique, 22, H - 410, AU_CHARCOAL);

  // Completion date.
  drawCentred(
    page,
    `Awarded ${completionDateLabel}`,
    helv,
    12,
    H - 460,
    AU_MID,
  );

  // Spacer rule.
  page.drawLine({
    start: { x: 100, y: 250 },
    end: { x: W - 100, y: 250 },
    thickness: 0.6,
    color: AU_PINK,
  });

  // Educator signature block — left-aligned in a single column.
  const sigX = 100;
  let sigY = 220;
  page.drawText("Bernadette Tobin", {
    x: sigX,
    y: sigY,
    size: 14,
    font: helvBold,
    color: AU_CHARCOAL,
  });
  sigY -= 18;
  page.drawText("RN, Independent Nurse Prescriber, MSc Advanced Practice (Level 7)", {
    x: sigX,
    y: sigY,
    size: 9,
    font: helv,
    color: AU_MID,
  });
  sigY -= 14;
  page.drawText("Founder, Aesthetics Unlocked", {
    x: sigX,
    y: sigY,
    size: 9,
    font: helv,
    color: AU_MID,
  });
  sigY -= 14;
  page.drawText("NMC Pin 05G1755E · Verifiable on the NMC public register", {
    x: sigX,
    y: sigY,
    size: 9,
    font: helv,
    color: AU_MID,
  });
  sigY -= 14;
  page.drawText(
    "Educator of the Year 2026 Nominee — Beauty & Aesthetics Awards",
    {
      x: sigX,
      y: sigY,
      size: 9,
      font: helv,
      color: AU_MID,
    },
  );

  // Footer — small caps right-aligned with the brand line.
  const footer = "AESTHETICSUNLOCKED.CO.UK";
  const footerWidth = helvBold.widthOfTextAtSize(footer, 9);
  page.drawText(footer, {
    x: W - 100 - footerWidth,
    y: 70,
    size: 9,
    font: helvBold,
    color: AU_CHARCOAL,
  });

  const bytes = await pdf.save();
  const safeSlug = courseSlug.replace(/[^a-z0-9-]/gi, "");
  const filename = `aesthetics-unlocked-${safeSlug}-certificate.pdf`;

  return new NextResponse(bytes as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

/**
 * Draw a string horizontally centred on the page at the given y.
 * pdf-lib doesn't have a native text-align so we measure the string
 * width at the rendered size and offset x ourselves. Optional
 * letterSpacing widens the rendered string by spacing characters
 * (spaces too) — used for the small-caps eyebrow lines.
 */
function drawCentred(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  y: number,
  color: ReturnType<typeof rgb>,
  opts: { letterSpacing?: number } = {},
) {
  const W = page.getWidth();
  if (opts.letterSpacing && opts.letterSpacing > 0) {
    const chars = text.split("");
    const widths = chars.map((c) => font.widthOfTextAtSize(c, size));
    const total =
      widths.reduce((a, b) => a + b, 0) + opts.letterSpacing * (chars.length - 1);
    let x = (W - total) / 2;
    for (let i = 0; i < chars.length; i++) {
      page.drawText(chars[i], { x, y, size, font, color });
      x += widths[i] + opts.letterSpacing;
    }
    return;
  }
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (W - width) / 2,
    y,
    size,
    font,
    color,
  });
}
