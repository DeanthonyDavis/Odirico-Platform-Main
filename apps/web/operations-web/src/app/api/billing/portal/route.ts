import { NextResponse } from "next/server";

import { getUserContext } from "@/lib/auth/session";
import { createBillingPortalSession } from "@/lib/billing/service";

export const runtime = "nodejs";

export async function POST() {
  try {
    const userContext = await getUserContext();

    if (!userContext || !userContext.user.email) {
      return NextResponse.json({ error: "Sign in before opening the billing portal." }, { status: 401 });
    }

    const session = await createBillingPortalSession({
      userId: userContext.user.id,
      email: userContext.user.email,
      displayName: userContext.displayName,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open the billing portal right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
