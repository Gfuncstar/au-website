/**
 * AudioIntroPill — Bernadette's m4a chapter intros.
 *
 * Real-audio mode (when `src` is set):
 *   • Tap to play / pause
 *   • While playing, the leading "▶" icon swaps for a live voice-level
 *     monitor — five animated bars driven by the Web Audio API's
 *     AnalyserNode, so it visibly responds to her voice.
 *   • Duration counts up as she speaks.
 *
 * No-audio mode (when `src` is unset):
 *   • Renders nothing. Lessons without an intro keep their layout
 *     clean rather than showing a "coming soon" stub.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface AudioIntroPillProps {
  /** Path to the audio file under /public, e.g.
   *  `/audio/lessons/ACNE_M01_Introduction_AUDIO_intro17s.m4a`. When
   *  unset, the component renders nothing. */
  src?: string;
  /** Display duration string, e.g. "0:56". Optional. Falls back to
   *  the audio element's intrinsic duration once metadata loads. */
  duration?: string;
}

const BAR_COUNT = 5;

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioIntroPill({ src, duration }: AudioIntroPillProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  const [playing, setPlaying] = useState(false);
  const [intrinsicDuration, setIntrinsicDuration] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0));

  // Set up the audio element + bind metadata + ended events.
  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onLoaded = () => setIntrinsicDuration(formatTime(audio.duration));
    const onTime = () => setCurrentTime(formatTime(audio.currentTime));
    const onEnded = () => {
      setPlaying(false);
      setLevels(Array(BAR_COUNT).fill(0));
      setCurrentTime(formatTime(audio.duration));
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      audioRef.current = null;
    };
  }, [src]);

  // Lazily initialise Web Audio graph on first play (browsers require
  // a user gesture before AudioContext is allowed to start).
  const ensureGraph = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (ctxRef.current) return;
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctor =
      window.AudioContext ||
      (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);
  };

  // Sample the analyser into BAR_COUNT bars (averaged across slices)
  // and drive the level state every animation frame while playing.
  const startMeter = () => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return;
    const tick = () => {
      analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
      const sliceSize = Math.floor(data.length / BAR_COUNT);
      const next: number[] = [];
      for (let b = 0; b < BAR_COUNT; b++) {
        let sum = 0;
        for (let i = 0; i < sliceSize; i++) {
          sum += data[b * sliceSize + i];
        }
        next.push(sum / sliceSize / 255);
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopMeter = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setLevels(Array(BAR_COUNT).fill(0));
  };

  const handleClick = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      ensureGraph();
      const ctx = ctxRef.current;
      if (ctx && ctx.state === "suspended") await ctx.resume();
      try {
        await audio.play();
        setPlaying(true);
        startMeter();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
      stopMeter();
    }
  };

  if (!src) return null;

  const totalDuration = duration ?? intrinsicDuration ?? "—";
  const displayTime = playing ? `${currentTime} / ${totalDuration}` : totalDuration;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? "Pause audio intro" : "Play audio intro"}
      aria-pressed={playing}
      className="inline-flex items-center gap-3 bg-au-white border border-au-charcoal/15 rounded-[5px] px-4 py-2.5 text-au-charcoal hover:border-au-pink hover:text-au-pink transition-colors group cursor-pointer"
    >
      {/* Icon slot — flips between ▶ / ❚❚ / live voice meter */}
      <span
        aria-hidden="true"
        className="relative inline-flex w-7 h-7 items-center justify-center rounded-[3px] bg-au-pink text-au-charcoal overflow-hidden"
      >
        {playing ? (
          <span className="flex items-end gap-[2px] h-full w-full px-1 py-1">
            {levels.map((lvl, i) => (
              <span
                key={i}
                className="flex-1 bg-au-charcoal"
                style={{
                  // Floor + scaled level so the bars never collapse to a thin line
                  height: `${Math.max(15, Math.min(100, lvl * 140 + 15))}%`,
                  transition: "height 60ms linear",
                }}
              />
            ))}
          </span>
        ) : (
          <span className="text-[0.75rem]">▶</span>
        )}
      </span>

      <span className="flex flex-col items-start min-w-0">
        <span className="font-section font-semibold uppercase tracking-[0.18em] text-[0.6rem] text-au-mid leading-none">
          Audio intro
        </span>
        <span className="font-display font-bold text-[0.85rem] leading-tight tabular-nums">
          {displayTime}
        </span>
      </span>
    </button>
  );
}
