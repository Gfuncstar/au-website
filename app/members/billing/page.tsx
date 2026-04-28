/**
 * /members/billing — full purchase history.
 *
 * AU runs a single-payment-per-course model — there are no recurring
 * subscriptions. Renders Kartra's transactions as a clean editorial
 * ledger (per design-direction.md §15.3-A): hairline rules, tabular
 * numerals, status badges with the magenta-only failed state.
 */

import { kartra } from "@/lib/kartra/client";
import { StatusBadge } from "@/components/members/StatusBadge";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { formatDate, formatGBP } from "@/lib/format";
import type { TransactionStatus, TransactionType } from "@/lib/kartra/types";

const TYPE_LABEL: Record<TransactionType, string> = {
  sale: "Sale",
  refund: "Refund",
  rebill: "Rebill",
  chargeback: "Chargeback",
};

function statusBadgeFor(s: TransactionStatus) {
  if (s === "success") return <StatusBadge status="active">Paid</StatusBadge>;
  if (s === "failed") return <StatusBadge status="failed">Failed</StatusBadge>;
  return <StatusBadge status="refunded">Refunded</StatusBadge>;
}

export default async function BillingPage() {
  const lead = await kartra.getLead("");
  if (!lead) return null;

  const sortedTransactions = [...lead.transactions].sort(
    (a, b) =>
      new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
  );

  const totalSpent = lead.transactions
    .filter((t) => t.status === "success" && t.transaction_type !== "refund")
    .reduce((sum, t) => sum + t.amount_cents, 0);

  return (
    <div className="space-y-8 sm:space-y-12">
      <header>
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-3">
          Billing
        </p>
        <h1
          className="font-display font-black text-au-charcoal leading-[0.95]"
          style={{
            fontSize: "clamp(1.625rem, 5.5vw, 3.5rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Billing.
        </h1>
        <p className="mt-3 sm:mt-4 text-[0.9375rem] sm:text-[1.0625rem] text-au-body max-w-[60ch] leading-relaxed">
          Every course you&apos;ve bought — single one-off payments, no
          recurring fees, no surprises.
        </p>
      </header>

      <MembersStatusStrip lead={lead} />

      {/* ============================================================
          Quick stats — single-payment model, no subscriptions to count
          ============================================================ */}
      <Reveal delay={0.1}>
        <section className="grid grid-cols-2 gap-px bg-au-charcoal/10 rounded-[4px] overflow-hidden">
          <Stat label="Lifetime spend" value={formatGBP(totalSpent)} />
          <Stat label="Purchases" value={String(lead.transactions.filter((t) => t.transaction_type !== "refund").length)} />
        </section>
      </Reveal>

      {/* ============================================================
          Transactions ledger
          ============================================================ */}
      <Reveal delay={0.15}>
      <section>
        <header className="mb-5 border-b border-au-charcoal/10 pb-4 flex items-baseline justify-between gap-4">
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
            Purchase history
          </p>
          <button
            type="button"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-pink hover:text-au-charcoal transition-colors"
          >
            Download all invoices →
          </button>
        </header>

        {/* Hidden header on mobile to keep rows tight; shown sm+ */}
        <div className="hidden sm:grid grid-cols-[7rem_1fr_8rem_8rem_4rem] gap-4 px-3 pb-3 font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid">
          <span>Date</span>
          <span>Product</span>
          <span>Type</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Status</span>
        </div>

        <ul>
          {sortedTransactions.map((t) => (
            <li
              key={t.id}
              className="border-t border-au-charcoal/8 first:border-t-0 sm:border-t sm:py-4 sm:px-3 sm:grid sm:grid-cols-[7rem_1fr_8rem_8rem_4rem] sm:gap-4 sm:items-center py-4"
            >
              <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-mid sm:order-1">
                {formatDate(t.occurred_at)}
              </p>
              <p className="font-display font-bold text-au-charcoal text-[0.9375rem] mt-1 sm:mt-0 sm:order-2">
                {t.product_name}
                {t.processor_reference && (
                  <span className="block sm:inline sm:ml-2 font-sans font-normal text-au-mid text-[0.75rem]">
                    {t.processor_reference}
                  </span>
                )}
              </p>
              <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-mid mt-1 sm:mt-0 sm:order-3">
                {TYPE_LABEL[t.transaction_type]}
              </p>
              <p className="font-display font-black tabular-nums text-au-charcoal text-[1rem] mt-1 sm:mt-0 sm:text-right sm:order-4">
                {formatGBP(t.amount_cents)}
              </p>
              <div className="mt-2 sm:mt-0 sm:order-5 sm:flex sm:justify-end">
                {statusBadgeFor(t.status)}
              </div>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>

      <p className="text-[0.8125rem] text-au-mid">
        Need a refund?{" "}
        <a
          href="mailto:hello@aunlock.co.uk"
          className="text-au-pink hover:text-au-charcoal transition-colors"
        >
          hello@aunlock.co.uk
        </a>{" "}
        — Bernadette handles every refund personally.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-au-pink-soft/30 p-4 sm:p-6">
      <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.6rem] sm:text-[0.625rem] text-au-mid leading-tight">
        {label}
      </p>
      <p className="font-display font-black text-au-charcoal text-[1.375rem] sm:text-[1.875rem] tabular-nums mt-2 leading-none">
        {value}
      </p>
    </div>
  );
}
