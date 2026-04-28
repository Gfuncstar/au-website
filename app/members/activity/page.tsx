/**
 * /members/activity — surfaces the rest of what Kartra exposes about
 * the user that doesn't fit the dashboard / account / billing / courses
 * surfaces:
 *
 *   - Sequence position (where they are in every nurture/onboarding flow)
 *   - Calendar bookings (past + upcoming)
 *   - Surveys / quizzes with their scores
 *   - Engagement score + source
 *   - Tag history
 *
 * This page is the "everything else" view — the membership equivalent
 * of Wikipedia's "What links here". Useful for power users who want to
 * see the full footprint of their account.
 */

import { kartra } from "@/lib/kartra/client";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { formatDate } from "@/lib/format";

export default async function ActivityPage() {
  const lead = await kartra.getLead("");
  if (!lead) return null;

  // Live calls are tracked but not surfaced as a dedicated section here
  // any more — the count appears in the Engagement profile stats below.
  const past = lead.calendar_bookings
    .filter((b) => new Date(b.starts_at) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime(),
    );

  return (
    <div className="space-y-8 sm:space-y-12">
      <header>
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid mb-3">
          Activity
        </p>
        <h1
          className="font-display font-black text-au-charcoal leading-[0.95]"
          style={{
            fontSize: "clamp(1.625rem, 5.5vw, 3.5rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Your activity.
        </h1>
        <p className="mt-3 sm:mt-4 text-[0.9375rem] sm:text-[1.0625rem] text-au-body max-w-[60ch] leading-relaxed">
          Everywhere you show up in the AU world — the sequences you&apos;re in,
          live calls past and upcoming, your quiz results, and your engagement
          profile.
        </p>
      </header>

      <MembersStatusStrip lead={lead} />

      {/* ============================================================
          Engagement profile — customer-facing counts only
          (lead score, source, and email sequences are internal CRM data
          and intentionally not surfaced here)
          ============================================================ */}
      <section className="grid grid-cols-3 gap-px bg-au-charcoal/10 rounded-[4px] overflow-hidden">
        <Stat label="Live calls attended" value={String(lead.calendar_bookings.filter((b) => new Date(b.starts_at) <= new Date()).length)} />
        <Stat label="Quizzes completed" value={String(lead.surveys.length)} />
        <Stat label="Tags on profile" value={String(lead.tags.length)} />
      </section>

      {/* ============================================================
          Past attendance — only renders if there's history. Live calls
          aren't being run yet, so this section is hidden by default.
          ============================================================ */}
      {past.length > 0 && (
        <Reveal delay={0.1}>
          <section>
            <header className="mb-5 border-b border-au-charcoal/10 pb-4">
              <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
                Past attendance
              </p>
            </header>
            <ul>
              {past.map((b) => (
                <li
                  key={b.booking_id}
                  className="flex items-center justify-between gap-4 py-3 border-b border-au-charcoal/8 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="font-display font-bold text-au-charcoal text-[0.9375rem] leading-tight">
                      {b.event_name}
                    </p>
                    <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid mt-1">
                      {formatDate(b.starts_at)} · {b.calendar_name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* ============================================================
          Surveys
          ============================================================ */}
      <Reveal delay={0.15}>
      <section>
        <header className="mb-5 border-b border-au-charcoal/10 pb-4">
          <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
            Quiz &amp; survey results
          </p>
        </header>

        <ul className="space-y-5">
          {lead.surveys.map((s) => (
            <li key={s.survey_id} className="bg-au-pink-soft/30 rounded-[4px] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-au-charcoal text-[1.0625rem] leading-tight">
                    {s.survey_name}
                  </h3>
                  <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-mid mt-1">
                    Completed {formatDate(s.completed_at)}
                  </p>
                </div>
                {s.score !== undefined && s.max_score !== undefined && (
                  <div className="text-right shrink-0">
                    <p className="font-display font-black tabular-nums text-au-charcoal text-[1.5rem] leading-none">
                      {s.score}
                      <span className="text-au-mid text-[0.875rem]">
                        /{s.max_score}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {s.highlights.length > 0 && (
                <dl className="space-y-3 border-t border-au-charcoal/10 pt-4">
                  {s.highlights.map((h, i) => (
                    <div key={i}>
                      <dt className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid mb-1">
                        {h.question}
                      </dt>
                      <dd className="font-display font-bold text-au-charcoal text-[0.9375rem]">
                        {h.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ul>
      </section>
      </Reveal>

      {/* ============================================================
          Tags (full set with timestamps)
          ============================================================ */}
      <Reveal delay={0.2}>
        <section>
          <header className="mb-5 border-b border-au-charcoal/10 pb-4">
            <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-mid">
              Tags assigned to your account
            </p>
          </header>
          <ul>
            {lead.tags.map((t) => (
              <li
                key={t.tag_name}
                className="flex items-center justify-between gap-4 py-3 border-b border-au-charcoal/8 last:border-b-0"
              >
                <span className="font-display font-bold text-au-charcoal text-[0.9375rem]">
                  {t.tag_name}
                </span>
                {t.assigned_at && (
                  <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.65rem] text-au-mid">
                    Assigned {formatDate(t.assigned_at)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-au-pink-soft/30 p-3.5 sm:p-5">
      <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.6rem] text-au-mid leading-tight">
        {label}
      </p>
      <p className="font-display font-black text-au-charcoal text-[1.375rem] sm:text-[1.5rem] tabular-nums mt-1.5 leading-none">
        {value}
      </p>
    </div>
  );
}
