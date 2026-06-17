"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabasePublicEnv } from "./env";

/**
 * Browser-side Supabase client for use in Client Components.
 *
 * Auth is NOT wired up yet — this only establishes the connection foundation.
 * Do not perform writes through this client until RLS policies are in place.
 *
 * @example
 *   const supabase = createClient();
 *   const { data } = await supabase.from("properties").select("*");
 */
export function createClient() {
  return createBrowserClient<Database>(
    supabasePublicEnv.url(),
    supabasePublicEnv.anonKey(),
  );
}
