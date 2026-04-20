import type { NextRequest } from "next/server";

import { jsonError } from "@odirico/api/response";

import { getSession } from "@/lib/auth/session";
import {
  isWorkspaceAppKey,
  loadWorkspaceState,
  parseWorkspaceState,
  saveWorkspaceState,
} from "@/lib/platform/workspaces";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    appKey: string;
  }>;
};

async function getAuthorizedRequestContext(context: RouteContext) {
  const { appKey } = await context.params;

  if (!isWorkspaceAppKey(appKey)) {
    return {
      error: jsonError("Unknown workspace.", 404),
    };
  }

  const user = await getSession();

  if (!user) {
    return {
      error: jsonError("Unauthorized.", 401),
    };
  }

  return {
    appKey,
    user,
    supabase: await createServerSupabaseClient(),
  };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const requestContext = await getAuthorizedRequestContext(context);

  if ("error" in requestContext) {
    return requestContext.error;
  }

  try {
    const result = await loadWorkspaceState(
      requestContext.supabase,
      requestContext.user.id,
      requestContext.appKey,
    );

    return Response.json(result, { status: 200 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to load the workspace.",
      500,
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const requestContext = await getAuthorizedRequestContext(context);

  if ("error" in requestContext) {
    return requestContext.error;
  }

  const body = (await request.json().catch(() => null)) as { state?: unknown } | null;
  const parsedState = parseWorkspaceState(requestContext.appKey, body?.state);

  if (!parsedState) {
    return jsonError("Invalid workspace payload.", 400);
  }

  try {
    const result = await saveWorkspaceState(
      requestContext.supabase,
      requestContext.user.id,
      requestContext.appKey,
      parsedState,
    );

    return Response.json(result, { status: 200 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to save the workspace.",
      500,
    );
  }
}
