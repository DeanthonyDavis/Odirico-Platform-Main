import type { NextRequest } from "next/server";

import { jsonError } from "@odirico/api/response";
import { z } from "zod";

import {
  ensureApplicationWorkspace,
  getCareerVaultStatus,
} from "@/lib/surge/career-vault";
import { getAuthorizedSurgeUser } from "@/lib/surge/auth";
import { buildSurgeCorsHeaders, handleSurgeOptions } from "@/lib/surge/cors";
import { persistSurgeArtifacts } from "@/lib/surge/persistence";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const workspaceRequestSchema = z.object({
  applicationId: z.number().int().positive(),
  remoteApplicationId: z.string().trim().optional(),
  companyName: z.string().trim().min(1),
  roleTitle: z.string().trim().min(1),
  jobType: z.string().trim().optional(),
  field: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  appliedAt: z.string().trim().optional(),
  includeCoverLetter: z.boolean().optional(),
  includeCv: z.boolean().optional(),
  includePortfolio: z.boolean().optional(),
});

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

  try {
    const careerVault = await getCareerVaultStatus();
    return Response.json(
      { careerVault },
      {
        status: 200,
        headers: buildSurgeCorsHeaders(origin),
      },
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to load the Career Vault.", 500, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const user = await getAuthorizedSurgeUser();

  if (!user) {
    return jsonError("Unauthorized.", 401, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  const payload = await request.json().catch(() => null);
  const parsed = workspaceRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Invalid Career Vault workspace payload.", 400, {
      headers: buildSurgeCorsHeaders(origin),
    });
  }

  try {
    const { remoteApplicationId, ...workspaceInput } = parsed.data;
    const workspace = await ensureApplicationWorkspace({
      actor: user,
      ...workspaceInput,
    });

    if (remoteApplicationId) {
      const supabase = await createServerSupabaseClient();
      await persistSurgeArtifacts({
        supabase,
        ownerId: user.id,
        applicationId: remoteApplicationId,
        workspace,
      });
    }

    const careerVault = await getCareerVaultStatus();

    return Response.json(
      {
        workspace,
        careerVault,
      },
      {
        status: 200,
        headers: buildSurgeCorsHeaders(origin),
      },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to prepare the Career Vault workspace.",
      500,
      {
        headers: buildSurgeCorsHeaders(origin),
      },
    );
  }
}
