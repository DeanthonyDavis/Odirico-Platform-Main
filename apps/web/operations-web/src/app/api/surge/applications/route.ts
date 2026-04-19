import type { NextRequest } from "next/server";

import { jsonError } from "@odirico/api/response";

import { getAuthorizedSurgeUser } from "@/lib/surge/auth";
import { buildSurgeCorsHeaders, handleSurgeOptions } from "@/lib/surge/cors";
import { getSurgeRuntimeSnapshot, getSurgeSnapshot } from "@/lib/surge/persistence";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export function OPTIONS(request: NextRequest) {
  return handleSurgeOptions(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const user = await getAuthorizedSurgeUser();

  if (!user) {
    return jsonError("Unauthorized.", 401, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  const supabase = await createServerSupabaseClient();
  const raw = request.nextUrl.searchParams.get("view") === "raw";

  try {
    const snapshot = raw
      ? await getSurgeSnapshot(supabase, user.id)
      : await getSurgeRuntimeSnapshot(supabase, user.id);

    return Response.json(snapshot, {
      status: 200,
      headers: buildSurgeCorsHeaders(origin),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to load the Surge application snapshot.",
      500,
      {
        headers: buildSurgeCorsHeaders(origin),
      },
    );
  }
}
