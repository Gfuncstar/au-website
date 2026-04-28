/**
 * StatusBadge — Oswald caps pill used across the members area for any
 * Active / Cancelled / Refunded / Failed / Completed state.
 *
 * Only one place in the dashboard uses the bright magenta accent —
 * the failed state.
 */

type Status =
  | "active"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed"
  | "paused"
  | "waitlist"
  | "free"
  | "neutral";

const STYLES: Record<Status, string> = {
  active: "bg-au-pink text-au-black",
  completed: "bg-au-charcoal text-au-white",
  cancelled: "bg-transparent text-au-mid border border-au-mid/40",
  refunded: "bg-au-pink-soft/40 text-au-mid",
  failed: "bg-[#FF1F8F] text-au-white",
  paused: "bg-au-pink-soft/40 text-au-charcoal",
  waitlist: "bg-au-pink-soft/40 text-au-charcoal border border-au-charcoal/15",
  free: "bg-au-pink-soft text-au-black",
  neutral: "bg-au-pink-soft/40 text-au-mid",
};

export function StatusBadge({
  status,
  children,
}: {
  status: Status;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-label={typeof children === "string" ? children : undefined}
      className={
        "inline-flex items-center font-section font-semibold uppercase " +
        "tracking-[0.1em] text-[0.6875rem] px-2.5 py-1 rounded-full " +
        "leading-none " +
        STYLES[status]
      }
    >
      {children}
    </span>
  );
}
