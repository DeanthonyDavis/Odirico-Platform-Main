import Link from "next/link";

import { BillingCheckoutButton } from "@/components/billing/checkout-button";
import type { BillingPlanDefinition } from "@/lib/billing/plans";
import { BILLING_PLANS, isPaidPlanKey } from "@/lib/billing/plans";

type SubscriptionGateProps = {
  title: string;
  copy: string;
  checkoutConfigured: boolean;
};

export function SubscriptionGate({
  title,
  copy,
  checkoutConfigured,
}: SubscriptionGateProps) {
  const paidPlans = BILLING_PLANS.filter(
    (plan): plan is BillingPlanDefinition & { key: "pro" | "semester" } => isPaidPlanKey(plan.key),
  );

  return (
    <section className="subscription-gate panel">
      <div className="subscription-gate-head">
        <div>
          <p className="sidebar-label">Paid access required</p>
          <h3>{title}</h3>
        </div>
        <p className="muted">{copy}</p>
      </div>

      <div className="subscription-gate-grid">
        {paidPlans.map((plan) => (
          <article
            className={plan.highlight ? "pricing-card pricing-card-highlight subscription-gate-card" : "pricing-card subscription-gate-card"}
            key={plan.key}
          >
            <p className="platform-module-kicker">{plan.audience}</p>
            {plan.badge ? <span className="pricing-badge">{plan.badge}</span> : null}
            <h4>{plan.name}</h4>
            <p className="pricing-price">
              {plan.price}
              <span>{plan.cadence}</span>
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <BillingCheckoutButton
              checkoutConfigured={checkoutConfigured}
              className="marketing-button marketing-button-primary pricing-card-cta"
              label={plan.ctaLabel}
              planKey={plan.key}
              signedIn
            />
          </article>
        ))}
      </div>

      <div className="subscription-gate-footer">
        <Link className="marketing-button marketing-button-secondary" href="/billing">
          Open billing
        </Link>
        <Link className="marketing-button marketing-button-ghost" href="/pricing">
          Review plans
        </Link>
      </div>
    </section>
  );
}
