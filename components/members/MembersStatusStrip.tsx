/**
 * MembersStatusStrip — at-a-glance account status at the top of every
 * /members/* page. Designed so the four key states are readable in one
 * mobile viewport without scrolling.
 *
 * Layout:
 *   - mobile : 2x2 grid (4 stat cells)
 *   - sm+    : 4x1 row
 *
 * Visual: charcoal cells with pink line icons + Montserrat Black numerals
 * + Oswald-caps labels. The "needs attention" cell flips pink-soft +
 * charcoal text whenever there's a failed payment.
 */

import Link from "next/link";
import type { Lead } from "@/lib/kartra/types";

interface Props {
  lead: Lead;
}

export function MembersStatusStrip({ lead }: Props) {
  const activeCourses = lead.memberships.filter((m) => m.active).length;
  const purchases = lead.transactions.filter(
    (t) => t.status === "success" && t.transaction_type !== "refund",
  );
  const lifetimeSpendPence = purchases.reduce(
    (sum, t) => sum + t.amount_cents,
    0,
  );
  const lifetimeSpend = `£${(lifetimeSpendPence / 100).toLocaleString("en-GB")}`;
  const quizzes = lead.surveys.length;
  const joined = new Date(lead.date_joined);
  const memberSinceYear = joined.getFullYear().toString();
  const memberSinceFull = joined.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  return (
    <section
      aria-label="Account at a glance"
      className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-au-charcoal/15 rounded-[5px] overflow-hidden"
    >
      <Cell
        icon={<CoursesIcon />}
        value={String(activeCourses)}
        label="Active courses"
        sub={`of ${lead.memberships.length} held`}
        href="/members/courses"
      />
      <Cell
        icon={<BillingIcon />}
        value={lifetimeSpend}
        label="Lifetime spend"
        sub={`${purchases.length} ${purchases.length === 1 ? "purchase" : "purchases"}`}
      />
      <Cell
        icon={<QuizIcon />}
        value={String(quizzes)}
        label="Quizzes done"
        sub={quizzes === 0 ? "Take one →" : "Profile insights"}
      />
      <Cell
        icon={<MemberSinceIcon />}
        value={memberSinceYear}
        label="Member since"
        sub={memberSinceFull}
      />
    </section>
  );
}

interface CellProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
  attention?: boolean;
  /**
   * Optional destination. When provided, the cell renders as a Link
   * with a subtle hover lift so it reads as clickable. When omitted,
   * it stays a plain status tile.
   */
  href?: string;
}

function Cell({ icon, value, label, sub, attention = false, href }: CellProps) {
  const baseClasses =
    "p-3.5 sm:p-5 flex items-start justify-between gap-3 transition-colors " +
    (attention
      ? "bg-au-pink-soft text-au-charcoal"
      : "bg-au-charcoal text-au-white");

  const interactiveClasses = href
    ? " hover:bg-au-black hover:text-au-pink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-au-pink"
    : "";

  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <p
          className="font-display font-black tabular-nums leading-none"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          {value}
        </p>
        <p
          className={
            "font-section font-semibold uppercase tracking-[0.12em] " +
            "text-[0.625rem] mt-2 leading-tight " +
            (attention ? "text-au-charcoal/80" : "text-au-white/65")
          }
        >
          {label}
        </p>
        {sub && (
          <p
            className={
              "font-sans text-[0.6875rem] mt-1 leading-tight truncate " +
              (attention ? "text-au-charcoal" : "text-au-white/55")
            }
          >
            {sub}
          </p>
        )}
      </div>
      <span
        className={"shrink-0 mt-1 " + (attention ? "text-au-charcoal" : "text-au-pink")}
      >
        {icon}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses + interactiveClasses}>
        {inner}
      </Link>
    );
  }

  return <div className={baseClasses}>{inner}</div>;
}

/* ============================================================
   Status icons — small, simple, 1.5px stroke, currentColor.
   No animation (these are scannable status icons, not the
   narrative course illustrations).
   ============================================================ */

const ICON_BASE = "w-6 h-6 sm:w-7 sm:h-7 stroke-[1] fill-none";

function CoursesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_BASE}
      aria-hidden="true"
    >
      <rect x="3" y="6" width="14" height="3" />
      <rect x="3" y="11" width="18" height="3" />
      <rect x="3" y="16" width="11" height="3" />
    </svg>
  );
}

/**
 * QuizIcon — checkmark inside a soft-cornered question card. Reads as
 * "completed assessment" rather than a generic question mark.
 */
function QuizIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_BASE}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M 8 12.5 L 11 15.5 L 16.5 9.5" />
    </svg>
  );
}

/**
 * BillingIcon — circle with a £ pound symbol inside (UK).
 * Hand-drawn as a single path so it stays in the line-icon vocabulary
 * rather than relying on font rendering inside SVG <text>.
 */
function BillingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_BASE}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      {/* £, top hook, vertical stem, base swoop */}
      <path d="M 14.8 9 C 14.8 7.6 13.7 6.5 12 6.5 C 10.3 6.5 9.2 7.6 9.2 9 V 17 H 15.5" />
      {/* Crossbar */}
      <line x1="8.2" y1="13" x2="13.2" y2="13" />
    </svg>
  );
}

/** MemberSinceIcon — small person silhouette, signals tenure/identity. */
function MemberSinceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_BASE}
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="3.5" />
      <path d="M 5 20 C 5 15 8 13 12 13 C 16 13 19 15 19 20" />
    </svg>
  );
}
