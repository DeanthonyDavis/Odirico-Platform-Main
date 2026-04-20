import { AppShell } from "@/components/layout/app-shell";
import { BillingCheckoutButton } from "@/components/billing/checkout-button";
import { BillingPortalButton } from "@/components/billing/portal-button";
import { BILLING_PLANS } from "@/lib/billing/plans";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type BillingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
    session_id?: string;
  }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const userContext = await requireUserContext();
  const billing = await getBillingSnapshotForUser(userContext.user.id);
  const params = searchParams ? await searchParams : undefined;
  const checkoutState = params?.checkout;

  return (
    <AppShell
      currentPath="/billing"
      title="Billing"
      subtitle="Free, Basic, Pro, and Semester Pass live here under one connected billing surface."
      userContext={userContext}
      eyebrow="Odirico / Platform / Billing"
      variant="ecosystem"
    >
      {checkoutState === "success" ? (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Checkout</p>
              <h3>Billing is processing your subscription.</h3>
            </div>
          </div>
          <p className="muted">
            Stripe returned successfully. If your paid access card still shows locked, refresh in a
            moment so the webhook sync can finish writing the subscription state back into the
            platform.
          </p>
        </section>
      ) : null}

      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Current plan</span>
          <strong>{billing.activePlan === "free" ? "Free preview" : BILLING_PLANS.find((plan) => plan.key === billing.activePlan)?.name ?? "Paid"}</strong>
          <p className="muted">The shared billing surface now supports a free preview, a starter plan, and full ecosystem access tiers.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Subscription status</span>
          <strong>{billing.subscription?.status ?? "not_started"}</strong>
          <p className="muted">Stripe-backed subscription state now drives whether the paid platform routes are unlocked.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Paid access</span>
          <strong>{billing.hasActiveSubscription ? "Unlocked" : "Locked"}</strong>
          <p className="muted">Basic, Pro, and Semester Pass all stay inside one platform billing model instead of separate product billing.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Checkout setup</span>
          <strong>{billing.checkoutConfigured ? "Ready" : "Needs Stripe env"}</strong>
          <p className="muted">Add the Stripe secret, webhook secret, and all live price IDs to finish production billing.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <p className="sidebar-label">Plans</p>
          <h3>Pick the access level that fits how much of Odirico you want to use</h3>

          <div className="pricing-grid pricing-grid-embedded">
            {BILLING_PLANS.map((plan) => (
              <article
                className={plan.highlight ? "pricing-card pricing-card-highlight" : "pricing-card"}
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
                {plan.key === "free" ? (
                  <button className="marketing-button marketing-button-secondary pricing-card-cta" disabled type="button">
                    Current baseline
                  </button>
                ) : (
                  <BillingCheckoutButton
                    checkoutConfigured={billing.checkoutConfigured}
                    className="marketing-button marketing-button-secondary pricing-card-cta"
                    currentPlanKey={billing.activePlan}
                    hasActiveSubscription={billing.hasActiveSubscription}
                    label={plan.ctaLabel}
                    planKey={plan.key}
                    signedIn
                  />
                )}
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Manage billing</p>
            <h3>Stripe runs the launch billing path</h3>
            <ul className="feature-list">
              <li>Checkout creates the selected Basic, Pro, or Semester Pass subscription in Stripe.</li>
              <li>Webhook sync writes billing state back into Supabase.</li>
              <li>The shared platform can now read one paid state instead of app-by-app billing logic.</li>
            </ul>
            {billing.portalConfigured ? (
              <BillingPortalButton className="marketing-button marketing-button-primary" />
            ) : (
              <p className="muted">
                The customer portal appears automatically after Stripe has a customer record for this account.
              </p>
            )}
          </section>

          <section className="panel">
            <p className="sidebar-label">What still needs live credentials</p>
            <ul className="feature-list">
              <li>`STRIPE_SECRET_KEY`</li>
              <li>`STRIPE_WEBHOOK_SECRET`</li>
              <li>`STRIPE_PRICE_BASIC_MONTHLY`</li>
              <li>`STRIPE_PRICE_PRO_MONTHLY`</li>
              <li>`STRIPE_PRICE_SEMESTER`</li>
            </ul>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
