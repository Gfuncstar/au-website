/**
 * Browser-side Supabase client for client components — used by the
 * lesson-progress hook so completion writes go through Supabase
 * (with RLS) instead of localStorage when the member is signed in.
 *
 * Returns null when env vars are missing.
 */

"use client";

import { createBrowserClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
