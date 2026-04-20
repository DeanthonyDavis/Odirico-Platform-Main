export type PlatformPlanKey = "free" | "pro" | "semester";

export type BillingPlanDefinition = {
  key: PlatformPlanKey;
  name: string;
  price: string;
  cadence: string;
  audience: string;
  ctaLabel: string;
  features: readonly string[];
  highlight?: boolean;
  badge?: string;
  paywalled?: boolean;
};

export const BILLING_PLANS: readonly BillingPlanDefinition[] = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    cadence: "to explore",
    audience: "See the product shell, installation flow, and billing surface before you commit.",
    ctaLabel: "Start free",
    features: [
      "Create an Odirico account and open the shared shell",
      "View the billing route, install route, and account settings",
      "Preview the platform before unlocking app workspaces",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$14.99",
    cadence: "per month",
    audience: "For consistent weekly use across Ember, Sol, and Surge.",
    ctaLabel: "Choose Pro",
    highlight: true,
    badge: "Recommended",
    paywalled: true,
    features: [
      "Unlock Overview, Ember, Sol, and Surge from one account",
      "Shared access across the full connected consumer platform",
      "Upgrade path built for active weekly use instead of separate app billing",
    ],
  },
  {
    key: "semester",
    name: "Semester",
    price: "$59",
    cadence: "per term",
    audience: "For school cycles, internship pushes, and focused growth seasons.",
    ctaLabel: "Choose Semester",
    paywalled: true,
    features: [
      "Paid platform access at a lower effective monthly rate",
      "Made for school, work, and application seasons that move together",
      "One plan model that still unlocks the same ecosystem routes",
    ],
  },
] as const;

export function getBillingPlan(key: PlatformPlanKey) {
  return BILLING_PLANS.find((plan) => plan.key === key) ?? BILLING_PLANS[0];
}

export function isPaidPlanKey(key: PlatformPlanKey) {
  return key !== "free";
}
