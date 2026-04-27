/**
 * cn — class-name composer used by shadcn-style components.
 *
 * Combines `clsx` (conditional class concatenation) with `tailwind-merge`
 * (de-duplicates conflicting Tailwind classes — e.g. `px-4 px-8` becomes `px-8`).
 *
 * Standard shadcn helper. Lives here so any component dropped into
 * `components/ui/` that imports `@/lib/utils` resolves cleanly.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
