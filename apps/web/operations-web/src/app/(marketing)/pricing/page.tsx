import Link from "next/link";

import { PRICING_PLANS } from "@/components/marketing/ecosystem-data";

export default function PricingPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Pricing</p>
            <h1>One plan model for Ember, Sol, and Surge.</h1>
          </div>
          <p>
            Pricing should reinforce the ecosystem. You are paying for a connected system, not
            signing up to manage three separate subscriptions.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <article className="pricing-card" key={plan.name}>
              <p className="platform-module-kicker">{plan.audience}</p>
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
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">What pricing should communicate</p>
            <h2>The plan applies across the full consumer ecosystem.</h2>
          </div>
          <div className="platform-why-list">
            <p>No separate module billing.</p>
            <p>No confusing upgrade path because you used more than one app.</p>
            <p>One system means one access model.</p>

            <div className="platform-hero-actions">
              <Link className="marketing-button marketing-button-primary" href="/login">
                Get Started
              </Link>
              <Link className="marketing-button marketing-button-secondary" href="/apps">
                Explore Apps
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
