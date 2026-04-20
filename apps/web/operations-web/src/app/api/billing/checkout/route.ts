import { NextResponse } from "next/server";
import { z } from "zod";

import { getUserContext } from "@/lib/auth/session";
import { createBillingCheckoutSession, getBillingSnapshotForUser } from "@/lib/billing/service";

export const runtime = "nodejs";

const requestSchema = z.object({
  planKey: z.enum(["basic", "pro", "semester"]),
});

export async function POST(request: Request) {
  try {
    const { planKey } = requestSchema.parse(await request.json());
    const userContext = await getUserContext();

    if (!userContext || !userContext.user.email) {
      return NextResponse.json({ error: "Sign in before starting checkout." }, { status: 401 });
    }

    const billing = await getBillingSnapshotForUser(userContext.user.id);

    if (billing.hasActiveSubscription) {
      return NextResponse.json(
        {
          error: "An active paid subscription already exists for this account. Open the billing portal instead.",
        },
        { status: 409 },
      );
    }

    const session = await createBillingCheckoutSession({
      userId: userContext.user.id,
      email: userContext.user.email,
      displayName: userContext.displayName,
      planKey,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe Checkout did not return a redirect URL." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Stripe Checkout right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
