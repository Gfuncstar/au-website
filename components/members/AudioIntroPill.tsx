/**
 * AudioIntroPill — Bernadette's audio intro at the top of every
 * lesson that has one. Promoted from a small pill to a full-width
 * card so it's the first thing a member sees when a chapter opens.
 *
 * Real-audio mode (when `src` is set):
 *   • Big square pink play / pause tile on the left
 *   • Editorial heading + duration
 *   • A wide voice-level meter (24 bars) driven by the Web Audio API's
 *     AnalyserNode, so it visibly responds to Bernadette's voice
 *   • Live `mm:ss` counter while playing
 *   • Whole card is the click target so it's hard to miss
 *
 * No-audio mode (when `src` is unset):
 *   • Renders nothing.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface AudioIntroPillProps {
  /** Path to the audio file under /public, e.g.
   *  `/audio/lessons/ACNE_M01_Introduction_AUDIO_intro17s.m4a`. When
   *  unset, the component renders nothing. */
  src?: string;
  /** Display duration string, e.g. "0:56". Optional. Falls back to
   *  the audio element's intrinsic duration once metadata loads. */
  duration?: string;
}

const BAR_COUNT = 24;

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

  // A stable "ghost" waveform for the paused state — varied heights
  // so the bar still feels intentional and previews what playback
  // will look like, but dim and static.
  const idleLevels = useMemo<number[]>(() => {
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const phase = (i / BAR_COUNT) * Math.PI * 4;
      // Sinewave + slight offset → smooth varied shape, no randomness
      // (avoids hydration mismatch).
      return 0.25 + Math.abs(Math.sin(phase)) * 0.45;
    });
  }, []);

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
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);
  };

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
  const meterValues = playing ? levels : idleLevels;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? "Pause audio intro" : "Play audio intro from Bernadette"}
      aria-pressed={playing}
      className="block w-full text-left bg-au-cream/90 border border-au-charcoal/15 rounded-[5px] p-4 sm:p-5 lg:p-6 hover:border-au-pink transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
        {/* Big play / pause tile */}
        <span
          aria-hidden="true"
          className="shrink-0 inline-flex items-center justify-center rounded-[5px] bg-au-pink text-au-charcoal w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] text-[1.25rem] sm:text-[1.4rem] lg:text-[1.6rem] leading-none"
        >
          {playing ? "❚❚" : "▶"}
        </span>

        {/* Eyebrow + headline + waveform */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <p
              className="font-section font-semibold uppercase tracking-[0.18em] leading-none"
              style={{
                fontSize: "clamp(0.625rem, 1.4vw, 0.75rem)",
                color: "var(--color-au-pink)",
              }}
            >
              Audio intro · {totalDuration}
            </p>
            {playing && (
              <p className="font-display font-bold tabular-nums text-au-charcoal text-[0.8rem] sm:text-[0.9rem] leading-none">
                {currentTime}
              </p>
            )}
          </div>

          <p className="font-display font-bold text-au-charcoal leading-snug mb-3 sm:mb-4"
             style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.2rem)" }}>
            {playing
              ? "Bernadette is talking — listen along."
              : "Listen first — Bernadette sets up this chapter."}
          </p>

          {/* Voice-level meter — wide bars, scaled levels */}
          <div
            className="flex items-end gap-[3px] sm:gap-1 h-4 sm:h-5 lg:h-6"
            aria-hidden="true"
          >
            {meterValues.map((lvl, i) => (
              <span
                key={i}
                className={
                  playing
                    ? "flex-1 bg-au-charcoal"
                    : "flex-1 bg-au-charcoal/35"
                }
                style={{
                  height: `${Math.max(12, Math.min(100, lvl * 130 + 12))}%`,
                  transition: playing
                    ? "height 60ms linear"
                    : "height 200ms ease-out",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
