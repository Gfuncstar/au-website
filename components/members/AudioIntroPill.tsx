/**
 * AudioIntroPill — placeholder for Bernadette's m4a chapter intros
 * captured in clone-aesthetics-unlocked/course-content.md ("Acne
 * Intro.m4a, 17s" etc.). Reserves the slot above the video so the UX
 * communicates that an intro is coming, even though the audio file
 * isn't wired yet.
 */

interface AudioIntroPillProps {
  /** Display duration string, e.g. "0:56". Optional — defaults to "Coming soon". */
  duration?: string;
}

export function AudioIntroPill({ duration }: AudioIntroPillProps) {
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
