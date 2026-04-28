/**
 * /members/account — profile, custom fields, communication preferences,
 * GDPR consent. Surfaces every editable field Kartra exposes per lead.
 *
 * Forms are read-only at v0 (mock client doesn't persist) — the inputs
 * render the live values from MOCK_LEAD so the surface is proven before
 * the kartra.editLead wiring lands.
 */

import { kartra } from "@/lib/kartra/client";
import { StatusBadge } from "@/components/members/StatusBadge";
import { MembersStatusStrip } from "@/components/members/MembersStatusStrip";
import { Reveal } from "@/components/members/Reveal";
import { formatDate } from "@/lib/format";
import type { LeadCustomField } from "@/lib/kartra/types";

function renderCustomField(f: LeadCustomField) {
  if (f.field_type === "select") {
    return (
      <select
        defaultValue={String(f.field_value ?? "")}
        className="w-full bg-au-pink-soft/30 border-0 rounded-[4px] px-4 py-3 text-[1rem] text-au-charcoal focus:outline-none focus:ring-2 focus:ring-au-pink"
      >
        {f.field_options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  if (f.field_type === "checkbox") {
    const values = Array.isArray(f.field_value) ? f.field_value : [];
    return (
      <div className="flex flex-wrap gap-2">
        {f.field_options?.map((o) => {
          const checked = values.includes(o);
          return (
            <label
              key={o}
              className={
                "inline-flex items-center gap-2 px-3 py-2 rounded-[4px] cursor-pointer text-[0.875rem] transition-colors " +
                (checked
                  ? "bg-au-pink text-au-white"
                  : "bg-au-pink-soft/30 text-au-charcoal border border-au-pink/20 hover:border-au-pink")
              }
            >
              <input
                type="checkbox"
                defaultChecked={checked}
                className="sr-only"
              />
              {o}
            </label>
          );
        })}
      </div>
    );
  }
  if (f.field_type === "textarea") {
    return (
      <textarea
        rows={3}
        defaultValue={String(f.field_value ?? "")}
        className="w-full bg-au-pink-soft/30 border-0 rounded-[4px] px-4 py-3 text-[1rem] text-au-charcoal focus:outline-none focus:ring-2 focus:ring-au-pink resize-none"
      />
    );
  }
  if (f.field_type === "number") {
    return (
      <input
        type="number"
        defaultValue={Number(f.field_value ?? 0)}
        className="w-full bg-au-pink-soft/30 border-0 rounded-[4px] px-4 py-3 text-[1rem] text-au-charcoal focus:outline-none focus:ring-2 focus:ring-au-pink"
      />
    );
  }
  return (
    <input
      type="text"
      defaultValue={String(f.field_value ?? "")}
      className="w-full bg-au-pink-soft/30 border-0 rounded-[4px] px-4 py-3 text-[1rem] text-au-charcoal focus:outline-none focus:ring-2 focus:ring-au-pink"
    />
  );
}

export default async function AccountPage() {
  const lead = await kartra.getLead("");
  if (!lead) return null;

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="bg-au-charcoal text-au-white -mx-4 sm:-mx-8 lg:-mx-12 -mt-5 sm:-mt-8 lg:-mt-10 px-4 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        <p className="font-section font-semibold uppercase tracking-[0.18em] text-[0.7rem] text-au-white/55 mb-3">
          Account
        </p>
        <h1
          className="font-display font-black text-au-white leading-[0.95]"
          style={{
            fontSize: "clamp(1.625rem, 5.5vw, 3.5rem)",
            letterSpacing: "var(--tracking-tight-display)",
          }}
        >
          Your <span className="text-au-pink">account</span>.
        </h1>
        <p className="mt-3 sm:mt-4 text-[0.9375rem] sm:text-[1.0625rem] text-au-white/75 max-w-[60ch] leading-relaxed">
          Edit anything below — changes save back to your AU profile straight
          away and follow you into every course.
        </p>
      </section>

      <MembersStatusStrip lead={lead} />

      {/* ============================================================
          Personal details
          ============================================================ */}
      <Reveal delay={0.1}>
      <section className="bg-au-pink-soft/30 rounded-[4px] p-5 sm:p-8">
        <h2 className="font-section font-semibold uppercase tracking-[0.15em] text-[0.7rem] text-au-mid mb-1">
          Personal details
        </h2>
        <p className="font-display font-bold text-au-charcoal text-[1.25rem] mb-6">
          The basics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="First name" defaultValue={lead.first_name} />
          <Field label="Last name" defaultValue={lead.last_name} />
          <Field label="Email" type="email" defaultValue={lead.email} fullWidth />
          <Field
            label="Phone"
            defaultValue={`${lead.phone_country_code ?? ""} ${lead.phone ?? ""}`}
          />
          <Field label="Company" defaultValue={lead.company ?? ""} />
          <Field label="Address" defaultValue={lead.address ?? ""} fullWidth />
          <Field label="City" defaultValue={lead.city ?? ""} />
          <Field label="County" defaultValue={lead.state ?? ""} />
          <Field label="Postcode" defaultValue={lead.zip ?? ""} />
          <Field label="Country" defaultValue={lead.country ?? ""} />
          <Field
            label="Time zone"
            defaultValue={lead.lead_preferred_time_zone ?? ""}
          />
          <Field label="Website" defaultValue={lead.website ?? ""} fullWidth />
          <Field label="LinkedIn" defaultValue={lead.linkedin ?? ""} fullWidth />
        </div>

        <div className="mt-7 flex items-center gap-3">
          <button
            type="button"
            className="bg-au-pink hover:bg-au-black text-au-white font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.875rem] transition-colors"
          >
            Save personal details
          </button>
          <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid">
            Member since {formatDate(lead.date_joined)}
          </span>
        </div>
      </section>
      </Reveal>

      {/* ============================================================
          Profile (Kartra custom fields, dynamic)
          ============================================================ */}
      <Reveal delay={0.15}>
      <section className="bg-au-white rounded-[4px] p-6 sm:p-8 border border-au-charcoal/10">
        <h2 className="font-section font-semibold uppercase tracking-[0.15em] text-[0.7rem] text-au-mid mb-1">
          Practitioner profile
        </h2>
        <p className="font-display font-bold text-au-charcoal text-[1.25rem] mb-6">
          What we know about your practice.
        </p>

        <div className="space-y-6">
          {lead.custom_fields.map((f) => (
            <div key={f.field_id}>
              <label className="block font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-mid mb-2">
                {f.field_label}
              </label>
              {renderCustomField(f)}
            </div>
          ))}
        </div>

        <div className="mt-7">
          <button
            type="button"
            className="bg-au-pink hover:bg-au-black text-au-white font-display font-bold uppercase tracking-[0.05em] rounded-[5px] px-6 py-3 min-h-[44px] text-[0.875rem] transition-colors"
          >
            Save practitioner profile
          </button>
        </div>
      </section>
      </Reveal>

      {/* ============================================================
          Communication preferences
          ============================================================ */}
      <Reveal delay={0.2}>
      <section className="bg-au-pink-soft/30 rounded-[4px] p-5 sm:p-8">
        <h2 className="font-section font-semibold uppercase tracking-[0.15em] text-[0.7rem] text-au-mid mb-1">
          Communication preferences
        </h2>
        <p className="font-display font-bold text-au-charcoal text-[1.25rem] mb-6">
          Choose what we send you.
        </p>

        <ul className="divide-y divide-au-charcoal/10">
          {lead.lists.map((list) => (
            <li
              key={list.list_name}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-display font-bold text-au-charcoal text-[0.9375rem] leading-tight">
                  {list.list_name}
                </p>
                {list.subscribed_at && (
                  <p className="font-section font-semibold uppercase tracking-[0.1em] text-[0.625rem] text-au-mid mt-1">
                    Joined {formatDate(list.subscribed_at)}
                  </p>
                )}
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={list.active}
                  className="sr-only peer"
                />
                <span className="w-11 h-6 bg-au-charcoal/20 peer-checked:bg-au-pink rounded-[3px] relative transition-colors">
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-au-white rounded-[2px] transition-transform peer-checked:translate-x-5"></span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>
      </Reveal>

      {/* ============================================================
          GDPR + danger zone
          ============================================================ */}
      <Reveal delay={0.25}>
      <section className="bg-au-white rounded-[4px] p-6 sm:p-8 border border-au-charcoal/10">
        <h2 className="font-section font-semibold uppercase tracking-[0.15em] text-[0.7rem] text-au-mid mb-1">
          Privacy &amp; data
        </h2>
        <p className="font-display font-bold text-au-charcoal text-[1.25rem] mb-6">
          You&apos;re in control.
        </p>

        <ul className="space-y-3 mb-7">
          <li className="flex items-center justify-between gap-4">
            <span className="text-au-body text-[0.9375rem]">GDPR consent</span>
            <StatusBadge
              status={lead.gdpr_lead_status === "consented" ? "active" : "neutral"}
            >
              {lead.gdpr_lead_status}
            </StatusBadge>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="text-au-body text-[0.9375rem]">
              Marketing communications
            </span>
            <StatusBadge
              status={lead.gdpr_lead_communications ? "active" : "neutral"}
            >
              {lead.gdpr_lead_communications ? "Allowed" : "Blocked"}
            </StatusBadge>
          </li>
          {lead.gdpr_lead_status_date && (
            <li className="flex items-center justify-between gap-4">
              <span className="text-au-body text-[0.9375rem]">
                Last reviewed
              </span>
              <span className="font-section font-semibold uppercase tracking-[0.1em] text-[0.6875rem] text-au-mid">
                {formatDate(lead.gdpr_lead_status_date)}
              </span>
            </li>
          )}
        </ul>

        <div className="border-t border-au-charcoal/10 pt-6">
          <p className="font-section font-semibold uppercase tracking-[0.15em] text-[0.7rem] text-au-mid mb-2">
            Danger zone
          </p>
          <p className="text-[0.9375rem] text-au-body mb-4 max-w-[60ch] leading-relaxed">
            Deleting your account removes you from every list, sequence, and
            membership. Course access ends immediately and we&apos;ll erase your
            data in line with UK GDPR.
          </p>
          <button
            type="button"
            className="font-section font-semibold uppercase tracking-[0.1em] text-[0.75rem] text-au-mid hover:text-[#FF1F8F] transition-colors min-h-[40px] inline-flex items-center"
          >
            Request account deletion →
          </button>
        </div>
      </section>
      </Reveal>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  fullWidth = false,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  fullWidth?: boolean;
}) {
  return (
    <label className={`block ${fullWidth ? "sm:col-span-2" : ""}`}>
      <span className="block font-section font-semibold uppercase tracking-[0.1em] text-[0.7rem] text-au-mid mb-2">
        {label}
      </span>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-au-white border-0 rounded-[4px] px-4 py-3 text-[1rem] text-au-charcoal focus:outline-none focus:ring-2 focus:ring-au-pink"
      />
    </label>
  );
}
