import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { hasDemoSessionOnRequest } from "@/lib/demo-auth";
import { getServerEnv } from "@odirico/core/env";

const PROTECTED_PATHS = [
  "/overview",
  "/ember",
  "/sol",
  "/surge",
  "/billing",
  "/settings",
  "/dashboard",
  "/kanban",
  "/tickets",
];

function resolveNextPath(nextPath: string | null) {
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  return "/overview";
}

export async function updateSession(request: NextRequest) {
  const hasDemoSession = hasDemoSessionOnRequest(request);
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const isAuthEntry =
    request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";
  const resolvedNextPath = resolveNextPath(request.nextUrl.searchParams.get("next"));

  if (hasDemoSession && isAuthEntry) {
    return NextResponse.redirect(new URL(resolvedNextPath, request.url));
  }

  if (hasDemoSession) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });
  const env = getServerEnv();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthEntry) {
    return NextResponse.redirect(new URL(resolvedNextPath, request.url));
  }

  return response;
}
