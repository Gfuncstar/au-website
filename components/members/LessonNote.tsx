/**
 * LessonNote — private note widget at the foot of every lesson.
 *
 * One note per (member, lesson). Auto-saves on blur. Emptying the
 * note deletes it server-side (handled by the API), so a member who
 * decides their note isn't useful any more just clears the textarea.
 *
 * Notes are private to the member. We never expose them publicly,
 * to other members, or to the educator. RLS enforces this server-
 * side; this component just trusts the API.
 *
 * MOCK / signed-out: shows a discoverable but inert placeholder so
 * preview-link viewers see the feature exists without dangling a
 * dead form.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MAX_NOTE_LENGTH = 4000;

interface Props {
  courseSlug: string;
  lessonSlug: string;
}

export function LessonNote({ courseSlug, lessonSlug }: Props) {
  const [content, setContent] = useState<string>("");
  const [savedContent, setSavedContent] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // On mount: read existing note if signed in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setSignedIn(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setSignedIn(false);
        return;
      }
      if (!cancelled) setSignedIn(true);
      const { data } = await supabase
        .from("lesson_notes")
        .select("content")
        .eq("member_id", user.id)
        .eq("course_slug", courseSlug)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle();
      if (cancelled) return;
      const initial = (data?.content as string) ?? "";
      setContent(initial);
      setSavedContent(initial);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug]);

  async function persist() {
    const next = content.trim();
    if (next === savedContent.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/members/lesson-note", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonSlug,
          content: next,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        if (json.error === "no_session") {
          setSignedIn(false);
        } else {
          setError("Couldn't save your note. Try again in a moment.");
        }
        return;
      }
      setSavedContent(next);
      setSavedAt(Date.now());
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (signedIn === false) {
    return (
      <section
        aria-label="Your notes"
        className="not-prose mt-10 pt-7 border-t border-au-charcoal/10 max-w-3xl"
      >
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-2">
          Your notes
        </p>
        <p className="text-[0.9375rem] text-au-charcoal/85 leading-relaxed">
          Sign in to jot a private note for this lesson. Notes stay
          private to you and follow you across devices.
        </p>
      </section>
    );
  }

  const charsLeft = MAX_NOTE_LENGTH - content.length;
  const hasNote = savedContent.trim().length > 0;

  return (
    <section
      aria-label="Your notes"
      className="not-prose mt-10 pt-7 border-t border-au-charcoal/10 max-w-3xl"
    >
      <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-2">
        Your notes
      </p>
      <p className="text-[0.9375rem] text-au-charcoal/85 mb-3 leading-relaxed">
        {hasNote
          ? "Edit your note below. Auto-saves when you click out."
          : "Add a note for future-you. A clinical observation, a question to follow up, a flag to revisit."}
      </p>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setContent(e.target.value.slice(0, MAX_NOTE_LENGTH));
          if (savedAt) setSavedAt(null);
          if (error) setError("");
        }}
        onBlur={persist}
        placeholder="Type your note here…"
        rows={4}
        disabled={saving}
        className="w-full bg-transparent border border-au-charcoal/20 focus:border-au-pink focus:outline-none rounded-[3px] px-3 py-2.5 text-[0.9375rem] text-au-charcoal placeholder:text-au-charcoal/40 transition-colors leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-mid/70">
          {error ? (
            <span className="text-[#FF1F8F]">{error}</span>
          ) : saving ? (
            "Saving…"
          ) : savedAt ? (
            <span className="text-au-pink">Saved</span>
          ) : hasNote ? (
            "Private to you"
          ) : (
            ""
          )}
        </p>
        <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-mid/70 tabular-nums">
          {charsLeft.toLocaleString("en-GB")} left
        </p>
      </div>
    </section>
  );
}
