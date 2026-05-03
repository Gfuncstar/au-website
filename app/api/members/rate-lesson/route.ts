/**
 * POST /api/members/rate-lesson — submit or update a star rating
 * (1–5) for a lesson, with an optional short comment. Upserts onto
 * the (member_id, course_slug, lesson_slug) primary key so a member
 * always has at most one rating per lesson.
 *
 * Returns:
 *   200 { ok: true, rating, comment }
 *   400 { ok: false, error: "invalid_payload|invalid_rating" }
 *   401 { ok: false, error: "no_session" }
 *   500 { ok: false, error: "auth_not_configured|<supabase msg>" }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let payload: {
    courseSlug?: unknown;
    lessonSlug?: unknown;
    rating?: unknown;
    comment?: unknown;
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
  const rating =
    typeof payload.rating === "number" ? Math.round(payload.rating) : NaN;
  const comment =
    typeof payload.comment === "string"
      ? payload.comment.trim().slice(0, 1000)
      : null;

  if (!courseSlug || !lessonSlug) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { ok: false, error: "invalid_rating" },
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

  const { error } = await supabase.from("lesson_ratings").upsert(
    {
      member_id: user.id,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      rating,
      comment: comment && comment.length > 0 ? comment : null,
    },
    { onConflict: "member_id,course_slug,lesson_slug" },
  );

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, rating, comment });
}
