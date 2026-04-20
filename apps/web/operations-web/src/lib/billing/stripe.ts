import Stripe from "stripe";

import { getServerEnv } from "@odirico/core/env";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const env = getServerEnv();

  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required for billing operations.");
  }

  stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
  });

  return stripeClient;
}

export function getStripeWebhookSecret() {
  const env = getServerEnv();

  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required for Stripe webhook verification.");
  }

  return env.STRIPE_WEBHOOK_SECRET;
}
