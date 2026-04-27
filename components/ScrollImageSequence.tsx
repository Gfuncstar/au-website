'use client';

/**
 * ScrollImageSequence — mobile-first scroll-scrubbed image sequence.
 *
 * Designed for the Aesthetics Unlocked rebuild. Mobile is the primary target;
 * desktop is a sympathetic enhancement.
 *
 * Behaviour:
 * - Scroll position INSIDE the component drives the current frame (1:1 mapping).
 * - The page behind the component does NOT scroll while a finger is dragging
 *   inside the component (overscroll-contain + pan-y touch-action).
 * - Bidirectional — drag up reverses the sequence.
 * - Locks to the nearest whole frame after the user lifts their finger
 *   (handles iOS momentum-scroll deceleration).
 * - All frames are preloaded + decoded off-thread (img.decode()) before the
 *   sequence becomes interactive. A subtle progress label shows during preload.
 * - Single <img> element, src is swapped each frame. Decoded images are kept
 *   in memory by the browser cache so swaps are effectively instant at 60 fps.
 * - Honours `prefers-reduced-motion` — falls back to a static start frame
 *   with internal scroll disabled.
 *
 * Performance notes:
 * - Frame updates are rAF-throttled. Scroll events are coalesced into a
 *   single per-frame paint.
 * - Use compressed JPGs (or WebP — the prop name is historical). Each frame
 *   should be ≤ 30 KB on mobile to keep total preload ≤ 2 MB for 65 frames.
 * - Snap is applied 140 ms after the last scroll event — long enough for iOS
 *   momentum to settle, short enough to feel intentional.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

export type ScrollImageSequenceProps = {
  /** Ordered array of image URLs (jpg/webp). Up to 65 frames recommended. */
  images: string[];

  /** Pixel height per frame inside the internal scroll area. Higher = slower scrub. Default 60 (mobile-tuned). */
  frameHeight?: number;

  /** Component width. Default '100%'. */
  width?: number | string;

  /** Component height. Default 'min(100svh, 100vh)' — fills the viewport on mobile, respecting iOS dynamic toolbars. */
  height?: number | string;

  /** Optional aspect ratio override, e.g. '4/5', '9/16', '16/9'. Wins over `height` when set. */
  aspectRatio?: string;

  /** Loop the sequence (wraps at end → start). Default false. */
  loop?: boolean;

  /** Frame to start on (clamped to [0, frames-1]). Default 0. */
  startFrame?: number;

  /** Extra Tailwind / className applied to the outer wrapper. */
  className?: string;

  /** Extra style applied to the outer wrapper (rarely needed; prefer className). */
  style?: CSSProperties;

  /** Loading label text. Default 'LOADING'. */
  loadingLabel?: string;

  /** Object-fit on the rendered frame. 'cover' fills the box (default, mobile-friendly), 'contain' letterboxes. */
  objectFit?: 'cover' | 'contain';

  /** When true, disables the scroll-scrub on first paint regardless of `prefers-reduced-motion`. Useful for SSR snapshots. */
  forceStatic?: boolean;
};

const DEFAULT_HEIGHT = 'min(100svh, 100vh)';

export default function ScrollImageSequence({
  images,
  frameHeight = 60,
  width = '100%',
  height = DEFAULT_HEIGHT,
  aspectRatio,
  loop = false,
  startFrame = 0,
  className = '',
  style,
  loadingLabel = 'LOADING',
  objectFit = 'cover',
  forceStatic = false,
}: ScrollImageSequenceProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decodedRef = useRef<HTMLImageElement[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const frameCount = images.length;
  const lastIndex = Math.max(0, frameCount - 1);
  const totalScroll = frameHeight * lastIndex;
  const isStatic = forceStatic || reducedMotion;

  /* ────────────────────────────────────────────────────────────────────
   *  prefers-reduced-motion (respect mobile Low Power Mode + accessibility)
   * ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  /* ────────────────────────────────────────────────────────────────────
   *  Preload + decode every frame
   * ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (frameCount === 0) {
      setIsLoaded(true);
      return;
    }

    let cancelled = false;
    decodedRef.current = [];
    setLoadedCount(0);
    setIsLoaded(false);

    let loaded = 0;
    const decoded: HTMLImageElement[] = [];

    const finishOne = (img: HTMLImageElement) => {
      if (cancelled) return;
      decoded.push(img);
      loaded += 1;
      setLoadedCount(loaded);
    };

    const preloadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        // crossOrigin omitted by default — set on the consumer if needed for CDN
        img.decoding = 'async';
        img.src = src;
        const decodeFn = (img as HTMLImageElement & {
          decode?: () => Promise<void>;
        }).decode;
        if (typeof decodeFn === 'function') {
          decodeFn
            .call(img)
            .then(() => {
              finishOne(img);
              resolve();
            })
            .catch(() => {
              // Decode can reject for some image types; fall back to onload.
              finishOne(img);
              resolve();
            });
        } else {
          img.onload = () => {
            finishOne(img);
            resolve();
          };
          img.onerror = () => {
            finishOne(img);
            resolve();
          };
        }
      });

    Promise.all(images.map(preloadOne)).then(() => {
      if (cancelled) return;
      decodedRef.current = decoded;
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [images, frameCount]);

  /* ────────────────────────────────────────────────────────────────────
   *  Frame writer (rAF-throttled). Single <img>, swap .src.
   * ──────────────────────────────────────────────────────────────────── */
  const writeFrame = useCallback(
    (frame: number) => {
      const img = imgRef.current;
      if (!img || frameCount === 0) return;
      let f = frame;
      if (loop) {
        f = ((f % frameCount) + frameCount) % frameCount;
      } else {
        f = Math.max(0, Math.min(lastIndex, f));
      }
      if (f === lastFrameRef.current) return;
      lastFrameRef.current = f;
      img.src = images[f];
    },
    [frameCount, images, lastIndex, loop],
  );

  const tick = useCallback(() => {
    rafRef.current = null;
    const scroller = scrollRef.current;
    if (!scroller || !isLoaded) return;
    const top = scroller.scrollTop;
    const frame = Math.round(top / frameHeight);
    writeFrame(frame);
  }, [frameHeight, isLoaded, writeFrame]);

  const handleScroll = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick);
    }
    // Re-arm the snap timer; it fires once scroll genuinely stops.
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const frame = Math.round(scroller.scrollTop / frameHeight);
      const target = frame * frameHeight;
      if (Math.abs(scroller.scrollTop - target) > 0.5) {
        scroller.scrollTo({ top: target, behavior: 'smooth' });
      }
    }, 140);
  }, [tick, frameHeight]);

  /* ────────────────────────────────────────────────────────────────────
   *  Initial position once preload completes (or on startFrame change)
   * ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isLoaded || frameCount === 0) return;
    const safeStart = Math.max(0, Math.min(lastIndex, startFrame));
    const scroller = scrollRef.current;
    if (scroller && !isStatic) {
      scroller.scrollTop = safeStart * frameHeight;
    }
    lastFrameRef.current = -1; // force first write
    writeFrame(safeStart);
  }, [isLoaded, frameCount, lastIndex, startFrame, frameHeight, writeFrame, isStatic]);

  /* ────────────────────────────────────────────────────────────────────
   *  Cleanup
   * ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  /* ────────────────────────────────────────────────────────────────────
   *  Render
   * ──────────────────────────────────────────────────────────────────── */
  const wrapperStyle: CSSProperties = {
    width,
    height: aspectRatio ? undefined : height,
    aspectRatio,
    ...style,
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-black select-none ${className}`}
      style={wrapperStyle}
    >
      {/* Image layer — visible to the user, never receives the scroll gesture */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          ref={imgRef}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className={`block w-full h-full transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit,
            // Crisp on retina; avoid forced smoothing artefacts on still frames
            imageRendering: 'auto',
            // Hint: image decoding off main thread (also via .decode() in preload)
            // touch-action: keep the image inert; only the scroll layer reacts
            touchAction: 'none',
          }}
        />
      </div>

      {/* Loading state — minimal, always centred */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-10 pointer-events-none"
          aria-live="polite"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/70 font-medium tabular-nums">
            {loadingLabel}{' '}
            {frameCount > 0
              ? Math.round((loadedCount / frameCount) * 100)
              : 0}
            %
          </span>
        </div>
      )}

      {/* Scroll layer — invisible, catches the gesture and drives the frame.
          On mobile this gets the user's finger; touch-action: pan-y locks the
          page behind. overscroll-contain stops a chained body scroll when the
          internal scroll hits its end. */}
      {!isStatic && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          aria-hidden="true"
          className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{
            // iOS momentum scrolling
            WebkitOverflowScrolling: 'touch',
            // Vertical scroll only — prevents diagonal drift when the user
            // swipes near the edge, important on phones held one-handed.
            touchAction: 'pan-y',
            // Prefer GPU compositing for the scroll layer.
            transform: 'translateZ(0)',
          }}
        >
          <div
            // The single spacer that creates the scroll length. Width = 1px so
            // it never widens the container. +1px height guarantees scrollability
            // even when frameCount=1 (degenerate case).
            style={{ height: totalScroll + 1, width: 1 }}
          />
        </div>
      )}
    </div>
  );
}
