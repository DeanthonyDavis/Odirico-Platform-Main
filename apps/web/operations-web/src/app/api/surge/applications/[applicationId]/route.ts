import type { NextRequest } from "next/server";

import { jsonError } from "@odirico/api/response";
import { z } from "zod";

import { getAuthorizedSurgeUser } from "@/lib/surge/auth";
import { buildSurgeCorsHeaders, handleSurgeOptions } from "@/lib/surge/cors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const patchSchema = z
  .object({
    status: z
      .enum(["lead", "applied", "confirmed", "review", "recruiter", "interview", "offer", "rejected", "withdrawn"])
      .optional(),
    appliedAt: z.string().trim().nullable().optional(),
    nextStep: z.string().trim().optional(),
    nextStepAt: z.string().trim().nullable().optional(),
    notes: z.string().trim().optional(),
    location: z.string().trim().optional(),
    compensation: z.string().trim().optional(),
    sourceUrl: z.string().trim().optional(),
  })
  .refine((value: Record<string, string | null | undefined>) => Object.values(value).some((entry) => entry !== undefined), {
    message: "At least one field must be provided.",
  });

export function OPTIONS(request: NextRequest) {
  return handleSurgeOptions(request.headers.get("origin"));
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ applicationId: string }> },
) {
  const origin = request.headers.get("origin");
  const user = await getAuthorizedSurgeUser();

  if (!user) {
    return jsonError("Unauthorized.", 401, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  const { applicationId } = await context.params;
  if (!applicationId?.trim()) {
    return jsonError("Application id is required.", 400, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  const payload = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || "Invalid Surge application update.", 400, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  const update = parsed.data;
  const supabase = await createServerSupabaseClient();
  const applicationsTable = supabase.from("surge_applications") as any;

  const result = await applicationsTable
    .update({
      ...(update.status ? { status: update.status } : {}),
      ...(update.appliedAt !== undefined ? { applied_at: update.appliedAt || null } : {}),
      ...(update.nextStep !== undefined ? { next_step: update.nextStep } : {}),
      ...(update.nextStepAt !== undefined ? { next_step_at: update.nextStepAt || null } : {}),
      ...(update.notes !== undefined ? { notes: update.notes } : {}),
      ...(update.location !== undefined ? { location: update.location } : {}),
      ...(update.compensation !== undefined ? { compensation: update.compensation } : {}),
      ...(update.sourceUrl !== undefined ? { source_url: update.sourceUrl } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id)
    .eq("id", applicationId)
    .select("*")
    .single();

  if (result.error) {
    return jsonError(result.error.message, 500, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  return Response.json(
    {
      application: result.data,
    },
    {
      status: 200,
      headers: buildSurgeCorsHeaders(origin),
    },
  );
}
