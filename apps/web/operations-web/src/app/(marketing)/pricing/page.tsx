import Link from "next/link";

import { BillingCheckoutButton } from "@/components/billing/checkout-button";
import { BillingPortalButton } from "@/components/billing/portal-button";
import {
  PRICING_FAQS,
  PRICING_PLANS,
  PRICING_PROOF_POINTS,
} from "@/components/marketing/ecosystem-data";
import { getSession } from "@/lib/auth/session";
import { getBillingSnapshotForUser } from "@/lib/billing/service";

export const dynamic = "force-dynamic";

type PricingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
    plan?: string;
  }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const user = await getSession();
  const billing = user ? await getBillingSnapshotForUser(user.id) : null;
  const signedIn = Boolean(user);
  const params = searchParams ? await searchParams : undefined;
  const checkoutState = params?.checkout;
  const requestedPlan = params?.plan;

  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Pricing</p>
            <h1>One connected plan model for Ember, Sol, and Surge.</h1>
          </div>
          <p>
            Pricing only shows up here when someone intentionally wants plans. The free tier opens
            the shell and the billing route, and paid access unlocks the working Overview, Ember,
            Sol, and Surge routes.
          </p>
        </div>
      </section>

      {checkoutState === "cancelled" ? (
        <section className="platform-section platform-section-support">
          <div className="marketing-shell">
            <article className="platform-support-card">
              <p className="platform-module-kicker">Checkout</p>
              <h2>Checkout was cancelled.</h2>
              <p>
                No charge was started. You can stay on the free preview, reopen billing later, or
                choose {requestedPlan === "semester" ? "the Semester plan" : "Pro"} again when you
                are ready.
              </p>
            </article>
          </div>
        </section>
      ) : null}

      <section className="platform-section">
        <div className="marketing-shell pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <article
              className={plan.highlight ? "pricing-card pricing-card-highlight" : "pricing-card"}
              key={plan.key}
            >
              <p className="platform-module-kicker">{plan.audience}</p>
              {plan.badge ? <span className="pricing-badge">{plan.badge}</span> : null}
              <h2>{plan.name}</h2>
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
                <Link className="marketing-button marketing-button-secondary pricing-card-cta" href={signedIn ? "/billing" : "/get-started"}>
                  {signedIn ? "Open billing" : plan.ctaLabel}
                </Link>
              ) : (
                <BillingCheckoutButton
                  checkoutConfigured={billing?.checkoutConfigured ?? false}
                  className="marketing-button marketing-button-secondary pricing-card-cta"
                  currentPlanKey={billing?.activePlan}
                  hasActiveSubscription={billing?.hasActiveSubscription}
                  label={plan.ctaLabel}
                  planKey={plan.key}
                  signedIn={signedIn}
                />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Why it works</p>
              <h2>Honest proof for the pricing story.</h2>
            </div>
            <p>
              No fake customer logos and no invented enterprise claims. The strongest proof right
              now is the product model itself: one shell, one account, one plan model, and three
              connected consumer apps.
            </p>
          </div>

          <div className="pricing-proof-strip">
            {PRICING_PROOF_POINTS.map((point) => (
              <article className="pricing-proof-card" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">FAQ</p>
              <h2>Questions people should be able to answer quickly.</h2>
            </div>
            <p>
              Pricing friction usually comes from unanswered basics. This version keeps the answers
              visible and direct.
            </p>
          </div>

          <div className="pricing-faq-grid">
            {PRICING_FAQS.map((faq) => (
              <article className="pricing-faq-card" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Next step</p>
            <h2>The plan applies across the full consumer ecosystem once you are ready to unlock it.</h2>
          </div>
          <div className="platform-why-list">
            <p>No separate module billing.</p>
            <p>No confusing upgrade path because you used more than one app.</p>
            <p>One system means one access model.</p>

            <div className="platform-hero-actions">
              {billing?.portalConfigured ? (
                <BillingPortalButton className="marketing-button marketing-button-primary" />
              ) : (
                <Link className="marketing-button marketing-button-primary" href={signedIn ? "/billing" : "/get-started"}>
                  {signedIn ? "Open billing" : "Get started"}
                </Link>
              )}
              <Link className="marketing-button marketing-button-secondary" href="/product-tour">
                Product tour
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
