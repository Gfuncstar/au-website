/**
 * AudioIntroPill — Bernadette's m4a chapter intros, captured in
 * clone-aesthetics-unlocked/course-content.md ("Acne Intro.m4a, 17s"
 * etc.) and stored under /public/audio/lessons/.
 *
 * When `src` is set, renders a real interactive pill: tapping toggles
 * play/pause, the duration counts up, and ▶ flips to ❚❚ while playing.
 * When `src` is unset, falls back to the original "Coming soon"
 * placeholder so chapters without an audio intro still reserve the slot.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface AudioIntroPillProps {
  /** Path to the audio file under /public, e.g.
   *  `/audio/lessons/ACNE_M01_Introduction_AUDIO_intro17s.m4a`. When
   *  unset, the pill renders as a "Coming soon" placeholder. */
  src?: string;
  /** Display duration string, e.g. "0:56". Optional. Falls back to
   *  the audio element's intrinsic duration once it has loaded. */
  duration?: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioIntroPill({ src, duration }: AudioIntroPillProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [intrinsicDuration, setIntrinsicDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    const onLoaded = () => setIntrinsicDuration(formatTime(audio.duration));
    const onEnded = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [src]);

  const handleClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  // Placeholder mode — no audio file yet
  if (!src) {
    return (
      <button
        type="button"
        disabled
        aria-label="Audio intro, coming soon"
        className="inline-flex items-center gap-3 bg-au-white border border-au-charcoal/15 rounded-[5px] px-4 py-2.5 text-au-charcoal hover:border-au-pink hover:text-au-pink transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        <span
          aria-hidden="true"
          className="inline-flex w-7 h-7 items-center justify-center rounded-[3px] bg-au-pink text-au-charcoal text-[0.75rem]"
        >
          ▶
        </span>
        <span className="flex flex-col items-start min-w-0">
          <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6rem] text-au-mid leading-none">
            Audio intro
          </span>
          <span className="font-display font-bold text-[0.85rem] leading-tight tabular-nums">
            {duration ?? "Coming soon"}
          </span>
        </span>
      </button>
    );
  }

  // Real-audio mode
  const displayDuration = duration ?? intrinsicDuration ?? "—";
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? "Pause audio intro" : "Play audio intro"}
      aria-pressed={playing}
      className="inline-flex items-center gap-3 bg-au-white border border-au-charcoal/15 rounded-[5px] px-4 py-2.5 text-au-charcoal hover:border-au-pink hover:text-au-pink transition-colors group cursor-pointer"
    >
      <span
        aria-hidden="true"
        className="inline-flex w-7 h-7 items-center justify-center rounded-[3px] bg-au-pink text-au-charcoal text-[0.75rem]"
      >
        {playing ? "❚❚" : "▶"}
      </span>
      <span className="flex flex-col items-start min-w-0">
        <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6rem] text-au-mid leading-none">
          Audio intro
        </span>
        <span className="font-display font-bold text-[0.85rem] leading-tight tabular-nums">
          {displayDuration}
        </span>
      </span>
    </button>
  );
}
