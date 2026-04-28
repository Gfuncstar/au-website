/**
 * lib/kartra/client.ts
 *
 * Server-side Kartra client. Currently mock-backed — every method
 * returns the fixture in `./mock.ts` so the dashboard renders end-to-end
 * before live API credentials are provisioned.
 *
 * To go live:
 *   1. Bernadette generates app_id / api_key / api_password in Kartra
 *      → Settings → Integrations → My API → Create New App
 *   2. Set KARTRA_APP_ID / KARTRA_API_KEY / KARTRA_API_PASSWORD env vars
 *   3. Replace each method's mock return with a real POST to
 *      https://app.kartra.com/api (form-encoded, all calls through a
 *      p-queue capped at 20/sec — Kartra's hard rate limit)
 *
 * The shape of every method is the eventual production shape, so the
 * dashboard code never changes.
 */

import type { Lead } from "./types";
import { MOCK_LEAD } from "./mock";

export interface KartraClient {
  searchLead(email: string): Promise<{ exists: boolean; id?: string }>;
  getLead(emailOrId: string): Promise<Lead | null>;
  cancelRecurringSubscription(subscriptionId: string): Promise<void>;
  toggleListSubscription(
    email: string,
    listName: string,
    subscribe: boolean,
  ): Promise<void>;
  editLead(email: string, patch: Partial<Lead>): Promise<void>;
}

export const kartra: KartraClient = {
  async searchLead(email) {
    if (email.toLowerCase() === MOCK_LEAD.email.toLowerCase()) {
      return { exists: true, id: MOCK_LEAD.id };
    }
    // Demo behaviour — always allow login through. In production we'd
    // calmly return `{ exists: false }` and the login form would still
    // show "Check your inbox" so we don't leak which emails are members.
    return { exists: true, id: MOCK_LEAD.id };
  },

  async getLead() {
    return MOCK_LEAD;
  },

  async cancelRecurringSubscription() {
    // mock no-op
    return;
  },

  async toggleListSubscription() {
    // mock no-op
    return;
  },

  async editLead() {
    // mock no-op
    return;
  },
};
