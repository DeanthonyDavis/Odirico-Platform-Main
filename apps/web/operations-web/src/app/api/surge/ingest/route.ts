import type { NextRequest } from "next/server";

import { getRequestIdentity } from "@odirico/api/request";
import { jsonError } from "@odirico/api/response";
import { z } from "zod";

import { getAuthorizedSurgeUser } from "@/lib/surge/auth";
import { ensureApplicationWorkspace } from "@/lib/surge/career-vault";
import { buildSurgeCorsHeaders, handleSurgeOptions } from "@/lib/surge/cors";
import { buildSurgeWorkspaceKey, persistSurgeIngest } from "@/lib/surge/persistence";
import { tailorApplicationDocuments } from "@/lib/surge/tailor";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assertRateLimit } from "@/lib/rate-limit/upstash";

export const runtime = "nodejs";

const ingestSchema = z.object({
  url: z.string().trim().optional().default(""),
  title: z.string().trim().min(1),
  body: z.string().trim().optional().default(""),
  source: z.string().trim().optional(),
  mode: z.string().trim().optional(),
  status: z.string().trim().optional(),
  channel: z.string().trim().optional(),
  capturedAt: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  roleTitle: z.string().trim().optional(),
  location: z.string().trim().optional(),
  category: z.string().trim().optional(),
  priority: z.string().trim().optional(),
  appliedAt: z.string().trim().optional(),
  nextStep: z.string().trim().optional(),
  nextStepAt: z.string().trim().optional(),
  compensation: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

function buildSuccessHeaders(origin: string | null) {
  return buildSurgeCorsHeaders(origin);
}

export function OPTIONS(request: NextRequest) {
  return handleSurgeOptions(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const identity = getRequestIdentity(request);
  const rateLimit = await assertRateLimit(identity, "surge-ingest");

  if (!rateLimit.success) {
    return jsonError("Too many Surge capture attempts.", 429, {
      headers: buildSuccessHeaders(origin),
    });
  }

  const user = await getAuthorizedSurgeUser();

  if (!user) {
    return jsonError("Unauthorized.", 401, {
      headers: buildSuccessHeaders(origin),
    });
  }

  const payload = await request.json().catch(() => null);
  const parsed = ingestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Invalid Surge capture payload.", 400, {
      headers: buildSuccessHeaders(origin),
    });
  }

  const capture = parsed.data;
  const companyName = capture.companyName?.trim() || "";
  const roleTitle = capture.roleTitle?.trim() || capture.title;
  const captureSource = String(capture.source || "browser").trim();
  const captureChannel = String(capture.channel || captureSource || "browser").trim().toLowerCase();
  const captureUrl = String(capture.url || "").trim();
  const jobDescription = String(capture.body || "").trim();
  const workspaceApplicationId = buildSurgeWorkspaceKey({
    sourceUrl: captureUrl,
    companyName: companyName || "Unknown company",
    roleTitle,
  });

  let workspace = null;
  let tailoring: Record<string, unknown> | null = null;
  const warnings: string[] = [];

  try {
    workspace = await ensureApplicationWorkspace({
      actor: user,
      applicationId: workspaceApplicationId,
      companyName: companyName || "Unknown company",
      roleTitle,
      sourceUrl: captureUrl,
      notes: capture.notes,
    });
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Career Vault workspace creation failed.");
  }

  const shouldTailor =
    jobDescription.length >= 120 && !["email", "manual", "other"].includes(captureChannel);

  if (process.env.ANTHROPIC_API_KEY?.trim() && shouldTailor) {
    try {
      const tailored = await tailorApplicationDocuments({
        actor: user,
        applicationId: workspaceApplicationId,
        companyName: companyName || "Unknown company",
        roleTitle,
        sourceUrl: captureUrl,
        notes: capture.notes,
        jobDescription,
      });
      workspace = tailored.workspace;
      tailoring = tailored.tailoring;
    } catch (error) {
      tailoring = {
        status: "failed",
        error: error instanceof Error ? error.message : "Tailoring failed.",
        generatedAt: new Date().toISOString(),
      };
      warnings.push(error instanceof Error ? error.message : "Tailoring failed.");
    }
  } else {
    const skipReason = !process.env.ANTHROPIC_API_KEY?.trim()
      ? "ANTHROPIC_API_KEY is not configured."
      : "No full job description was available for tailoring.";
    tailoring = {
      status: "skipped",
      reason: skipReason,
      generatedAt: new Date().toISOString(),
    };
    warnings.push(`${skipReason} Tailoring was skipped.`);
  }

  const supabase = await createServerSupabaseClient();

  try {
    const persisted = await persistSurgeIngest({
      supabase,
      ownerId: user.id,
      payload: capture,
      workspace,
      tailoring: tailoring as any,
    });

    return Response.json(
      {
        company: persisted.company,
        role: persisted.role,
        application: persisted.application,
        documents: persisted.documents,
        workspace,
        tailoring,
        warnings,
      },
      {
        status: 201,
        headers: buildSuccessHeaders(origin),
      },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to persist the Surge capture.",
      500,
      {
        headers: buildSuccessHeaders(origin),
      },
    );
  }
}
