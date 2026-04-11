import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function resolveNextPath(nextPath: string | null) {
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  return "/dashboard";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = resolveNextPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Missing OAuth callback code.");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "Unable to finish sign in.");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
