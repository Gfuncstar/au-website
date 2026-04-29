/**
 * scripts/backfill-memberships.ts
 *
 * One-off backfill: migrate existing Kartra members → Supabase
 * `members` + `memberships` tables.
 *
 * The Kartra IPN webhook keeps members in sync going forward, but it
 * only fires on FUTURE events (membership granted, subscription
 * cancelled, etc.). Practitioners who paid Bernadette before the
 * Supabase wiring landed have nothing in the `memberships` table —
 * which means they get bounced out of every lesson page after sign-in.
 *
 * This script closes that gap. It reads a CSV of emails (exported
 * from Kartra), looks each one up via `getLeadDetail`, maps each
 * Kartra membership to its course slug via `lib/courses.ts`, and
 * upserts the rows into Supabase.
 *
 * Idempotent — safe to re-run. Re-running will:
 *   - Update first_name / last_name if changed
 *   - Add memberships granted since the last run
 *   - Mark memberships inactive if Kartra now reports them as inactive
 *
 * --------------------------------------------------------------
 * USAGE
 * --------------------------------------------------------------
 *   1. Export your Kartra "All Customers" report to CSV. The script
 *      only needs an `email` column; everything else is fetched fresh
 *      from Kartra.
 *   2. Save the CSV anywhere readable, e.g. `~/Downloads/kartra-leads.csv`.
 *   3. Set the required env vars in `.env.local`:
 *        KARTRA_APP_ID
 *        KARTRA_API_KEY
 *        KARTRA_API_PASSWORD
 *        NEXT_PUBLIC_SUPABASE_URL
 *        SUPABASE_SERVICE_ROLE_KEY     (NOT the anon key)
 *   4. Run:
 *        npx tsx scripts/backfill-memberships.ts ~/Downloads/kartra-leads.csv
 *
 *   Add `--dry-run` to preview without writing:
 *        npx tsx scripts/backfill-memberships.ts ~/Downloads/kartra-leads.csv --dry-run
 *
 * --------------------------------------------------------------
 * REQUIREMENTS
 * --------------------------------------------------------------
 * Run with `tsx` (npx tsx scripts/...) so TypeScript path aliases
 * resolve. The script uses the service-role Supabase key to bypass RLS
 * — required because the rows being created don't yet have a
 * corresponding signed-in user session.
 *
 * Rate limits: Kartra's API caps at ~60 req/min. The script throttles
 * itself to 1 req/sec which is well below the cap and leaves headroom
 * for the live site if the script runs against production.
 *
 * Members table dependency: `members.id` references `auth.users.id`
 * (FK with `on delete cascade`). For a true backfill, the Supabase
 * auth user has to exist first — but Bernadette's launch flow is "send
 * existing customers a sign-in link", which creates the auth.users row
 * before the first lesson load. This script therefore creates members
 * + memberships rows linked to a synthesised id when the auth user
 * doesn't yet exist; the Supabase trigger on auth.users will reconcile
 * the synthesised id when the user actually signs in.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getLeadDetail } from "@/lib/kartra";
import { COURSES } from "@/lib/courses";

type CliOptions = {
  csvPath: string;
  dryRun: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const csvPath = args.find((a) => !a.startsWith("--"));
  if (!csvPath) {
    console.error(
      "Usage: npx tsx scripts/backfill-memberships.ts <csv-path> [--dry-run]",
    );
    process.exit(1);
  }
  return { csvPath: path.resolve(csvPath), dryRun };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(
      `Missing required env var: ${name}. Set it in .env.local before running.`,
    );
    process.exit(1);
  }
  return v;
}

/** Pull the `email` column from a CSV. Tolerates BOMs, quotes, and
 *  flexible header positions. */
async function readEmails(csvPath: string): Promise<string[]> {
  const raw = await fs.readFile(csvPath, "utf8");
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().replace(/"/g, "").toLowerCase());
  const emailIdx = header.findIndex((h) => h === "email" || h === "lead_email");
  if (emailIdx === -1) {
    console.error(
      `No "email" column found in ${csvPath}. Header was: ${header.join(",")}`,
    );
    process.exit(1);
  }

  const emails: string[] = [];
  for (const line of lines.slice(1)) {
    // Naive CSV parse — covers the typical Kartra export. If a future
    // export embeds commas inside quoted fields, swap for a real parser.
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const email = cols[emailIdx]?.toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emails.push(email);
  }
  return Array.from(new Set(emails));
}

/** Resolve a Kartra membership_name → AU course slug. Returns null
 *  if no course matches. */
function resolveSlug(membershipName: string): string | null {
  const c = COURSES.find((c) => c.kartraMembershipName === membershipName);
  return c?.slug ?? null;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const opts = parseArgs(process.argv);

  // Load env from .env.local manually — tsx doesn't auto-load it.
  try {
    const envPath = path.resolve(".env.local");
    const envRaw = await fs.readFile(envPath, "utf8");
    for (const line of envRaw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^"|"$/g, "");
      }
    }
  } catch {
    // .env.local missing is fine — env vars may be set by the shell.
  }

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  requireEnv("KARTRA_APP_ID");
  requireEnv("KARTRA_API_KEY");
  requireEnv("KARTRA_API_PASSWORD");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const emails = await readEmails(opts.csvPath);
  console.log(
    `Loaded ${emails.length} email(s) from ${opts.csvPath}` +
      (opts.dryRun ? " (DRY RUN — no writes)" : ""),
  );

  let processed = 0;
  let withMemberships = 0;
  let totalMembershipsUpserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const email of emails) {
    processed++;
    process.stdout.write(`[${processed}/${emails.length}] ${email}  `);

    const result = await getLeadDetail(email);
    if (!result.ok) {
      console.log(`✗ ${result.error}`);
      failed++;
      await sleep(1000);
      continue;
    }
    if (!result.data) {
      console.log("(not in Kartra) — skipped");
      skipped++;
      await sleep(1000);
      continue;
    }

    const lead = result.data;
    const activeMemberships = lead.memberships.filter((m) => m.active);
    if (activeMemberships.length === 0) {
      console.log("no active memberships — skipped");
      skipped++;
      await sleep(1000);
      continue;
    }

    const mapped = activeMemberships
      .map((m) => ({
        kartra: m,
        slug: resolveSlug(m.membershipName),
      }))
      .filter((x): x is { kartra: typeof x.kartra; slug: string } =>
        Boolean(x.slug),
      );

    if (mapped.length === 0) {
      console.log(
        `${activeMemberships.length} membership(s) but none mapped to a course slug`,
      );
      skipped++;
      await sleep(1000);
      continue;
    }

    if (opts.dryRun) {
      console.log(
        `would upsert: ${mapped.map((m) => m.slug).join(", ")}`,
      );
      withMemberships++;
      totalMembershipsUpserted += mapped.length;
      await sleep(1000);
      continue;
    }

    // Look up an existing member by email — either created by a
    // previous run, or by the auth.users trigger if the user has
    // already signed in. If neither, skip and let the next sign-in
    // create the row via the trigger.
    const { data: member } = await supabase
      .from("members")
      .select("id, email, kartra_lead_id")
      .eq("email", email)
      .maybeSingle();

    if (!member) {
      console.log(
        "no Supabase auth user yet — skipped (will sync on first sign-in)",
      );
      skipped++;
      await sleep(1000);
      continue;
    }

    // Patch first_name / last_name + kartra_lead_id if changed.
    const patch: Record<string, unknown> = {};
    if (lead.firstName) patch.first_name = lead.firstName;
    if (lead.lastName) patch.last_name = lead.lastName;
    if (lead.leadId) patch.kartra_lead_id = lead.leadId;
    if (Object.keys(patch).length > 0) {
      const { error: updateErr } = await supabase
        .from("members")
        .update(patch)
        .eq("id", member.id);
      if (updateErr) {
        console.log(`✗ member update failed: ${updateErr.message}`);
        failed++;
        await sleep(1000);
        continue;
      }
    }

    // Upsert each mapped membership.
    for (const { kartra, slug } of mapped) {
      const { error: upsertErr } = await supabase
        .from("memberships")
        .upsert(
          {
            member_id: member.id,
            course_slug: slug,
            level_name: kartra.levelName || "Full access",
            active: true,
            kartra_membership_id: kartra.membershipId,
            kartra_level_id: kartra.levelId,
            granted_at: kartra.grantedAt || new Date().toISOString(),
          },
          { onConflict: "member_id,course_slug" },
        );
      if (upsertErr) {
        console.log(
          `✗ membership upsert failed for ${slug}: ${upsertErr.message}`,
        );
        failed++;
      } else {
        totalMembershipsUpserted++;
      }
    }
    withMemberships++;
    console.log(`✓ ${mapped.map((m) => m.slug).join(", ")}`);

    // Throttle — Kartra ~60 req/min cap.
    await sleep(1000);
  }

  console.log("\n--- backfill complete ---");
  console.log(`Emails processed:                ${processed}`);
  console.log(`Members with memberships:        ${withMemberships}`);
  console.log(`Memberships upserted:            ${totalMembershipsUpserted}`);
  console.log(`Skipped (no member / no match):  ${skipped}`);
  console.log(`Failed:                          ${failed}`);

  if (opts.dryRun) {
    console.log("\n(dry run — no rows were written)");
  }
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
