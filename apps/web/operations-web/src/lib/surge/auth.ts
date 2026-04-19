import { DEMO_USER, hasDemoSession } from "@/lib/demo-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAuthorizedSurgeUser() {
  if (await hasDemoSession()) {
    return DEMO_USER;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
