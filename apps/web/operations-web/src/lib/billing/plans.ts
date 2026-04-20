export type PlatformPlanKey = "free" | "basic" | "pro" | "semester";

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
    audience: "Enough access to understand the system across Ember, Sol, and Surge before you commit.",
    ctaLabel: "Start free",
    features: [
      "Basic access across Ember, Sol, and Surge",
      "Simple dashboards with limited AI actions",
      "Limited tracking, history, and saved activity",
      "Enough visibility to understand how the ecosystem works",
    ],
  },
  {
    key: "basic",
    name: "Basic",
    price: "$7.99",
    cadence: "per month",
    audience: "For people who want more than free without paying for the full system yet.",
    ctaLabel: "Choose Basic",
    paywalled: true,
    features: [
      "Lighter access across Ember, Sol, and Surge",
      "More saved history, sync, and daily planner or tracker usage",
      "Basic AI assistance with fewer day-to-day restrictions",
      "No advanced analytics or automation layers",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$14.99",
    cadence: "per month",
    audience: "The full Odirico ecosystem for people actively using Ember, Sol, and Surge together.",
    ctaLabel: "Choose Pro",
    highlight: true,
    badge: "Recommended",
    paywalled: true,
    features: [
      "Full access across Ember, Sol, and Surge",
      "Full cross-device sync and richer dashboards",
      "Full AI features, planning tools, and tracking depth",
      "Better customization, history, and full application and finance management",
    ],
  },
  {
    key: "semester",
    name: "Semester Pass",
    price: "$39",
    cadence: "per semester",
    audience: "Student-friendly full access for one semester without monthly billing.",
    ctaLabel: "Choose Semester Pass",
    paywalled: true,
    features: [
      "Everything in Pro billed once for the semester",
      "Built for school cycles, internship pushes, and focused growth seasons",
      "Lower-friction student pricing without monthly billing overhead",
    ],
  },
] as const;

export function getBillingPlan(key: PlatformPlanKey) {
  return BILLING_PLANS.find((plan) => plan.key === key) ?? BILLING_PLANS[0];
}

export function isPaidPlanKey(key: PlatformPlanKey) {
  return key !== "free";
}
