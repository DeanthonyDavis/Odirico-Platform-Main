import type { NextRequest } from "next/server";

import { buildCorsHeaders, handleOptions } from "@odirico/api/cors";
import { getPublicEnv } from "@odirico/core/env";
import { getRequestIdentity } from "@odirico/api/request";
import { jsonError, jsonOk } from "@odirico/api/response";
import { logWarn } from "@/lib/monitoring/logger";
import { assertRateLimit } from "@/lib/rate-limit/upstash";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resetPasswordSchema } from "@odirico/core/validation";

export function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const identity = getRequestIdentity(request);
  const rateLimit = await assertRateLimit(identity, "password-reset");

  if (!rateLimit.success) {
    return jsonError(
      "Too many reset attempts. Try again shortly.",
      429,
      { headers: buildCorsHeaders(origin) },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(payload);

  if (!parsed.success) {
    return jsonError("Invalid email address.", 400, {
      headers: buildCorsHeaders(origin),
    });
  }

  const env = getPublicEnv();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/login?reset=1`,
  });

  if (error) {
    logWarn("auth.reset_password_failed", {
      message: error.message,
      identity,
    });
  }

  return jsonOk(
    {
      message:
        "If the account exists, an expiring password reset link has been sent.",
    },
    {
      headers: buildCorsHeaders(origin),
    },
  );
}
