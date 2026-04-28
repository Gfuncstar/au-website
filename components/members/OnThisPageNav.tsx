/**
 * OnThisPageNav — sticky right-rail desktop nav listing the lesson's
 * top-level sections (the charcoal section bands). Highlights the
 * current section as the user scrolls. Hidden on mobile (the chapter
 * pill row covers lateral nav there).
 *
 * Only renders when the lesson has 4+ sections — short lessons don't
 * need it.
 */

"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
  eyebrow: string;
}

interface Props {
  sections: Section[];
}

export function OnThisPageNav({ sections }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section so the active state
        // updates as the user scrolls past each section's title.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 4) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block fixed right-6 top-32 w-56 z-10"
    >
      <p className="font-section font-semibold uppercase tracking-[0.22em] text-[0.6rem] text-au-mid mb-3 flex items-center gap-2">
        <span aria-hidden="true" className="block h-px w-6 bg-au-pink" />
        On this chapter
      </p>
      <ol className="space-y-2">
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={
                  "group block leading-snug transition-colors " +
                  (active ? "text-au-pink" : "text-au-mid hover:text-au-charcoal")
                }
              >
                <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6rem] tabular-nums block opacity-70">
                  {s.eyebrow}
                </span>
                <span className="font-display font-bold text-[0.78rem] block">
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
