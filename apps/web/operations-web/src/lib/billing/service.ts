import type Stripe from "stripe";

import { getServerEnv } from "@odirico/core/env";
import type { Database } from "@odirico/core/database";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStripeServerClient } from "@/lib/billing/stripe";
import {
  getBillingPlan,
  type PlatformPlanKey,
} from "@/lib/billing/plans";

type BillingCustomerRow = Database["public"]["Tables"]["billing_customers"]["Row"];
type BillingSubscriptionRow = Database["public"]["Tables"]["billing_subscriptions"]["Row"];
type BillingSubscriptionStatus = BillingSubscriptionRow["status"];

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<BillingSubscriptionStatus>(["trialing", "active", "past_due"]);

export type BillingSnapshot = {
  customer: BillingCustomerRow | null;
  subscription: BillingSubscriptionRow | null;
  activePlan: PlatformPlanKey;
  hasActiveSubscription: boolean;
  checkoutConfigured: boolean;
  portalConfigured: boolean;
};

function getConfiguredPriceId(planKey: PlatformPlanKey) {
  const env = getServerEnv();

  if (planKey === "pro") {
    return env.STRIPE_PRICE_PRO_MONTHLY ?? null;
  }

  if (planKey === "semester") {
    return env.STRIPE_PRICE_SEMESTER ?? null;
  }

  return null;
}

export function isBillingConfigured() {
  const env = getServerEnv();

  return Boolean(
    env.STRIPE_SECRET_KEY &&
      env.STRIPE_PRICE_PRO_MONTHLY &&
      env.STRIPE_PRICE_SEMESTER,
  );
}

export function hasActivePaidSubscription(subscription: BillingSubscriptionRow | null | undefined) {
  if (!subscription) {
    return false;
  }

  return ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status);
}

export async function getBillingSnapshotForUser(userId: string): Promise<BillingSnapshot> {
  const supabase = await createServerSupabaseClient();
  const billingCustomers = supabase.from("billing_customers") as any;
  const billingSubscriptionsTable = supabase.from("billing_subscriptions") as any;

  const [{ data: customer }, { data: subscriptions }] = await Promise.all([
    billingCustomers
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    billingSubscriptionsTable
      .select("*")
      .eq("user_id", userId)
      .order("current_period_end", { ascending: false, nullsFirst: false })
      .limit(3),
  ]);
  const billingCustomer = customer as BillingCustomerRow | null;
  const billingSubscriptions = (subscriptions ?? null) as BillingSubscriptionRow[] | null;

  const subscription =
    billingSubscriptions?.find((entry) => ACTIVE_SUBSCRIPTION_STATUSES.has(entry.status)) ??
    billingSubscriptions?.[0] ??
    null;

  const hasActiveSubscription = hasActivePaidSubscription(subscription);
  const activePlan = hasActiveSubscription
    ? (subscription?.plan_key ?? "pro")
    : "free";

  return {
    customer: billingCustomer,
    subscription,
    activePlan,
    hasActiveSubscription,
    checkoutConfigured: isBillingConfigured(),
    portalConfigured: Boolean(getServerEnv().STRIPE_SECRET_KEY && billingCustomer?.stripe_customer_id),
  };
}

export async function ensureBillingCustomerForUser({
  userId,
  email,
  displayName,
}: {
  userId: string;
  email: string;
  displayName?: string | null;
}) {
  const admin = createAdminSupabaseClient();
  const billingCustomers = admin.from("billing_customers") as any;
  const existing = await billingCustomers
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  const existingCustomer = (existing.data ?? null) as BillingCustomerRow | null;

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer;
  }

  const stripe = getStripeServerClient();
  const customer = await stripe.customers.create({
    email,
    name: displayName ?? undefined,
    metadata: {
      userId,
    },
  });

  const payload = {
    user_id: userId,
    email,
    stripe_customer_id: customer.id,
  };

  const result = await billingCustomers
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data as BillingCustomerRow;
}

function resolvePlanKeyFromPriceId(priceId: string | null | undefined): PlatformPlanKey {
  const env = getServerEnv();

  if (priceId && env.STRIPE_PRICE_SEMESTER && priceId === env.STRIPE_PRICE_SEMESTER) {
    return "semester";
  }

  if (priceId && env.STRIPE_PRICE_PRO_MONTHLY && priceId === env.STRIPE_PRICE_PRO_MONTHLY) {
    return "pro";
  }

  return "pro";
}

function toIsoDate(value: number | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

function normalizeStripeSubscriptionStatus(status: Stripe.Subscription.Status): BillingSubscriptionStatus {
  if (status === "trialing") return "trialing";
  if (status === "active") return "active";
  if (status === "past_due") return "past_due";
  if (status === "canceled") return "canceled";
  if (status === "incomplete") return "incomplete";
  if (status === "incomplete_expired") return "incomplete_expired";
  if (status === "unpaid") return "unpaid";
  return "paused";
}

async function resolveUserIdForStripeCustomer({
  stripeCustomerId,
  fallbackUserId,
}: {
  stripeCustomerId: string;
  fallbackUserId?: string | null;
}) {
  if (fallbackUserId) {
    return fallbackUserId;
  }

  const admin = createAdminSupabaseClient();
  const billingCustomers = admin.from("billing_customers") as any;
  const existing = await billingCustomers
    .select("user_id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  const customerLookup = (existing.data ?? null) as { user_id: string } | null;

  return customerLookup?.user_id ?? null;
}

export async function syncStripeSubscriptionToDatabase(subscription: Stripe.Subscription) {
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const fallbackUserId = subscription.metadata.userId ?? null;
  const userId = await resolveUserIdForStripeCustomer({
    stripeCustomerId,
    fallbackUserId,
  });

  if (!userId) {
    return null;
  }

  const primaryItem = subscription.items.data[0];
  const stripePriceId = primaryItem?.price?.id ?? null;
  const planKey = subscription.metadata.planKey
    ? (subscription.metadata.planKey as PlatformPlanKey)
    : resolvePlanKeyFromPriceId(stripePriceId);

  const admin = createAdminSupabaseClient();
  const billingSubscriptionsTable = admin.from("billing_subscriptions") as any;

  const result = await billingSubscriptionsTable
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: stripePriceId,
        plan_key: planKey,
        status: normalizeStripeSubscriptionStatus(subscription.status),
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_start: toIsoDate(primaryItem?.current_period_start ?? null),
        current_period_end: toIsoDate(primaryItem?.current_period_end ?? null),
        metadata: {
          collection_method: subscription.collection_method,
          currency: primaryItem?.price?.currency ?? null,
          product: typeof primaryItem?.price?.product === "string" ? primaryItem?.price?.product : null,
          plan_name: getBillingPlan(planKey).name,
        },
      },
      { onConflict: "stripe_subscription_id" },
    )
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data as BillingSubscriptionRow;
}

export async function syncStripeSubscriptionById(subscriptionId: string) {
  const stripe = getStripeServerClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return syncStripeSubscriptionToDatabase(subscription);
}

export async function createBillingCheckoutSession({
  userId,
  email,
  displayName,
  planKey,
}: {
  userId: string;
  email: string;
  displayName?: string | null;
  planKey: PlatformPlanKey;
}) {
  const priceId = getConfiguredPriceId(planKey);

  if (!priceId) {
    throw new Error(`Stripe price is not configured for the ${planKey} plan.`);
  }

  const stripe = getStripeServerClient();
  const customer = await ensureBillingCustomerForUser({
    userId,
    email,
    displayName,
  });
  const appUrl = getServerEnv().NEXT_PUBLIC_APP_URL;

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.stripe_customer_id,
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled&plan=${planKey}`,
    client_reference_id: userId,
    metadata: {
      userId,
      planKey,
    },
    subscription_data: {
      metadata: {
        userId,
        planKey,
      },
    },
  });
}

export async function createBillingPortalSession({
  userId,
  email,
  displayName,
}: {
  userId: string;
  email: string;
  displayName?: string | null;
}) {
  const stripe = getStripeServerClient();
  const customer = await ensureBillingCustomerForUser({
    userId,
    email,
    displayName,
  });
  const appUrl = getServerEnv().NEXT_PUBLIC_APP_URL;

  return stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${appUrl}/billing`,
  });
}
