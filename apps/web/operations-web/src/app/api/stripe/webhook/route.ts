import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { syncStripeSubscriptionById, syncStripeSubscriptionToDatabase } from "@/lib/billing/service";
import { getStripeServerClient, getStripeWebhookSecret } from "@/lib/billing/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(payload, signature, getStripeWebhookSecret());

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && typeof session.subscription === "string") {
          await syncStripeSubscriptionById(session.subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncStripeSubscriptionToDatabase(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
