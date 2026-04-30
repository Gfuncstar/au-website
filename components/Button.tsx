/**
 * Button — AU CTA system.
 *
 * Two variants:
 *  - `pink`  — PRIMARY. Used for purchase / enrol / waitlist actions only.
 *               One per section, never stacked. Auto-includes a right arrow.
 *  - `black` — SECONDARY. Used for nurture / content actions ("Read more",
 *               "Browse all courses", "Watch video").
 *
 * Always set the price on paid-product CTAs (per AU brand pack):
 *    <Button price="79">Get instant access</Button>
 * → renders: GET INSTANT ACCESS — £79 →
 *
 * Mobile-first:
 *  - Min 48px touch target
 *  - Tracking + ALL CAPS handled here so consumers can't get it wrong
 *  - Hover state inverts (pink ↔ black) but we never RELY on hover
 */

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "pink" | "black" | "glass";

type CommonProps = {
  variant?: Variant;
  /** GBP. Renders as ` — £79` after the children. */
  price?: number | string;
  /** Show the right chevron / arrow. Default true. */
  arrow?: boolean;
  /** Wider, more presence — used for hero block CTAs. */
  size?: "sm" | "default" | "lg";
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

// Button corner radius — controlled site-wide via the Tailwind arbitrary value
// here. Was `rounded-full` (full pill); now `rounded-[5px]` per the design call
// (≈80% less rounded — sharper, more editorial-poster, sympathetic to the
// inspiration board's gig-poster CTA shapes).
const baseClasses =
  "inline-flex items-center justify-center font-display font-bold uppercase " +
  "tracking-[0.05em] rounded-[5px] transition-colors duration-200 " +
  "select-none whitespace-nowrap";

// `min-h` lives per-size now so `sm` can drop below the 48px touch target
// for in-poster CTAs (used over a hero where the surrounding tap zones
// are already huge). default/lg keep the 48px accessibility minimum.
const sizeClasses = {
  sm: "px-4 py-2 text-[0.75rem] sm:text-[0.8125rem] gap-1.5 min-h-[32px]",
  default: "px-6 py-3 text-[0.875rem] sm:text-[0.9375rem] gap-2 min-h-[48px]",
  lg: "px-8 py-4 text-[0.9375rem] sm:text-[1rem] gap-3 min-h-[48px]",
} as const;

const variantClasses: Record<Variant, string> = {
  pink:
    "bg-[var(--color-au-pink)] text-au-white " +
    "hover:bg-au-black hover:text-au-white",
  black:
    "bg-au-black text-au-white " +
    "hover:bg-[var(--color-au-pink)] hover:text-au-white",
  // Glass — frosted treatment for over-image CTAs (hero, image overlays).
  // Stays in AU language: same radius, same Montserrat caps, just the
  // surface is white/10 with a thin white/20 border + backdrop-blur.
  glass:
    "bg-white/10 backdrop-blur-md border border-white/20 text-au-white " +
    "hover:bg-au-white hover:text-au-black hover:border-au-white",
};

function Inner({
  children,
  price,
  arrow = true,
}: {
  children: ReactNode;
  price?: number | string;
  arrow?: boolean;
}) {
  return (
    <>
      <span>
        {children}
        {price !== undefined && (
          <>
            {" "}
            , £{typeof price === "number" ? price.toLocaleString("en-GB") : price}
          </>
        )}
      </span>
      {arrow && (
        <span aria-hidden="true" className="inline-block translate-y-[-1px] transition-transform group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );
}

function classes({
  variant = "pink",
  size = "default",
  className = "",
}: Pick<CommonProps, "variant" | "size" | "className">) {
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} group ${className}`;
}

export function Button(props: AnchorProps | ButtonProps) {
  const {
    variant,
    size,
    className,
    price,
    arrow,
    children,
    ...rest
  } = props;
  const cls = classes({ variant, size, className });

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <Link href={href} className={cls} {...anchorRest}>
        <Inner price={price} arrow={arrow}>
          {children}
        </Inner>
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonProps)}>
      <Inner price={price} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
