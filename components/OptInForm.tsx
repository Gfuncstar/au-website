/**
 * OptInForm — AU-styled native opt-in form that POSTs to /api/subscribe.
 *
 * Replaces Kartra's clunky popup forms with an inline AU-branded
 * experience. The user never sees a Kartra page; the API route
 * forwards their email + first name + course slug to Kartra so all
 * existing email automation (welcome sequences, drip schedules,
 * tagging) continues to fire as before.
 *
 * UX states: idle → submitting → success | error.
 *   - idle: form visible, submit enabled
 *   - submitting: submit button shows pending, fields disabled
 *   - success: form replaced with a "check your inbox" panel + a
 *     soft CTA back to /courses
 *   - error: error message below the form, submit re-enabled, the
 *     fields keep their values so the user doesn't retype
 *
 * Anti-spam: a hidden `honeypot` field that real users never fill;
 * bots usually do. The API route silently 200s on honeypot triggers.
 */

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Props = {
  /** Course slug — must match a slug in lib/courses.ts. */
  courseSlug: string;
  /** Course title for the success-state copy. */
  courseTitle: string;
  /** Submit button label. Defaults to "Get instant access". */
  submitLabel?: string;
  /** What to show in the success panel headline. Default supplied. */
  successHeadline?: string;
  /** Tone — light = on cream/white, dark = on charcoal/black. */
  tone?: "light" | "dark";
};

type Status = "idle" | "submitting" | "success" | "error";

export function OptInForm({
  courseSlug,
  courseTitle,
  submitLabel = "Get instant access",
  successHeadline = "Check your inbox.",
  tone = "light",
}: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dark = tone === "dark";
  const labelClasses = `font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-2 block ${
    dark ? "text-au-white/65" : "text-au-charcoal/65"
  }`;
  const inputClasses = `w-full px-4 py-3 rounded-[5px] border transition-colors focus:outline-none focus:border-[var(--color-au-pink)] ${
    dark
      ? "bg-au-white/5 border-au-white/15 text-au-white placeholder-au-white/40"
      : "bg-au-white border-au-charcoal/15 text-au-charcoal placeholder-au-charcoal/40"
  }`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          courseSlug,
          honeypot,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(
          data.error ??
            "Something went wrong. Try again, or email hello@aunlock.co.uk.",
        );
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg(
        "Network error — check your connection and try again, or email hello@aunlock.co.uk.",
      );
    }
  }

  /* ============================================================
     SUCCESS STATE
     ============================================================ */
  if (status === "success") {
    return (
      <div
        className={`max-w-md p-6 sm:p-7 border rounded-[5px] ${
          dark
            ? "bg-au-white/5 border-au-white/15"
            : "bg-au-white border-au-charcoal/15"
        }`}
      >
        <p
          className={`font-section font-semibold uppercase tracking-[0.18em] text-[0.6875rem] mb-3`}
          style={{ color: "var(--color-au-pink)" }}
        >
          You&rsquo;re in
        </p>
        <h3
          className={`font-display font-black mb-3 ${
            dark ? "text-au-white" : "text-au-charcoal"
          }`}
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          {successHeadline}
        </h3>
        <p
          className={`leading-relaxed mb-5 ${
            dark ? "text-au-white/85" : "text-au-charcoal/80"
          }`}
        >
          I&rsquo;ve sent the {courseTitle} welcome email to{" "}
          <strong>{email}</strong>. If it&rsquo;s not in your inbox in the
          next few minutes, check your spam — and add{" "}
          <code className="text-[0.875rem]">hello@aunlock.co.uk</code> to
          your safe senders.
        </p>
        <Link
          href="/courses"
          className={`inline-flex items-center gap-2 font-section font-semibold uppercase tracking-[0.15em] text-[0.8125rem] transition-colors ${
            dark
              ? "text-au-white/85 hover:text-[var(--color-au-pink)]"
              : "text-au-charcoal hover:text-[var(--color-au-pink)]"
          }`}
        >
          See my other courses <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  /* ============================================================
     IDLE / SUBMITTING / ERROR STATE
     ============================================================ */
  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="max-w-md flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from real users, bots fill it. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Leave this empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label htmlFor="optin-firstName" className={labelClasses}>
          First name
        </label>
        <input
          id="optin-firstName"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={submitting}
          className={inputClasses}
          placeholder="Bernadette"
        />
      </div>

      <div>
        <label htmlFor="optin-email" className={labelClasses}>
          Email <span style={{ color: "var(--color-au-pink)" }}>*</span>
        </label>
        <input
          id="optin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className={inputClasses}
          placeholder="you@clinic.co.uk"
        />
      </div>

      {errorMsg && (
        <p
          role="alert"
          className="text-[0.875rem] text-[var(--color-au-pink)]"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[5px] font-display font-bold uppercase tracking-[0.05em] text-[0.875rem] bg-[var(--color-au-pink)] text-au-white hover:bg-au-black disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Adding you…" : submitLabel}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>

      <p
        className={`text-[0.75rem] leading-relaxed ${
          dark ? "text-au-white/55" : "text-au-charcoal/55"
        }`}
      >
        I&rsquo;ll send you the course welcome email, plus occasional notes
        on UK aesthetics regulation and clinic strategy. Unsubscribe any
        time. See the{" "}
        <Link
          href="/privacy"
          className="underline decoration-[var(--color-au-pink)] underline-offset-2"
        >
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
