"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@odirico/core/env";
import type { Database } from "@odirico/core/database";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClientSupabaseClient() {
  if (browserClient) return browserClient;

  const env = getPublicEnv();

  browserClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  return browserClient;
}
