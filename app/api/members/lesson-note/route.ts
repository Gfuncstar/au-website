/**
 * POST   /api/members/lesson-note  — upsert a member's note for one
 *                                   lesson. Empty content deletes the
 *                                   note rather than storing a blank.
 * DELETE /api/members/lesson-note  — explicit delete (clear via the
 *                                   trash button in the UI).
 *
 * Body: { courseSlug, lessonSlug, content }
 *
 * Returns:
 *   200 { ok: true, content } | { ok: true, deleted: true }
 *   400 { ok: false, error: "invalid_payload|content_too_long" }
 *   401 { ok: false, error: "no_session" }
 *   500 { ok: false, error: "auth_not_configured|<supabase msg>" }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_NOTE_LENGTH = 4000;

export async function POST(request: NextRequest) {
  let payload: {
    courseSlug?: unknown;
    lessonSlug?: unknown;
    content?: unknown;
  } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const courseSlug =
    typeof payload.courseSlug === "string" ? payload.courseSlug.trim() : "";
  const lessonSlug =
    typeof payload.lessonSlug === "string" ? payload.lessonSlug.trim() : "";
  const content =
    typeof payload.content === "string" ? payload.content.trim() : "";

  if (!courseSlug || !lessonSlug) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }
  if (content.length > MAX_NOTE_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "content_too_long" },
      { status: 400 },
    );
  }

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

  // Empty content → delete the row rather than store a blank note.
  if (content.length === 0) {
    const { error } = await supabase
      .from("lesson_notes")
      .delete()
      .eq("member_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_slug", lessonSlug);
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, deleted: true });
  }

  const { error } = await supabase.from("lesson_notes").upsert(
    {
      member_id: user.id,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      content,
    },
    { onConflict: "member_id,course_slug,lesson_slug" },
  );

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, content });
}
