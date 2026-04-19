import Image from "next/image";
import Link from "next/link";

import {
  CONNECTION_FLOWS,
  ECOSYSTEM_APP_STORIES,
  ECOSYSTEM_TAGLINE,
  PRICING_PLANS,
  PLATFORM_SUPPORT_POINTS,
  PRICING_PROOF_POINTS,
  TRUST_PROMISES,
} from "@/components/marketing/ecosystem-data";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSession();
  const primaryHref = user ? "/overview" : "/signup";
  const primaryLabel = user ? "Open platform" : "Get started";

  return (
    <>
      <section className="platform-hero">
        <div className="marketing-shell platform-hero-grid">
          <div className="platform-hero-copy">
            <p className="platform-kicker">Odirico Platform</p>
            <h1>
              Your life,
              <br />
              organized
              <br />
              into one
              <br />
              system.
            </h1>
            <p className="platform-lead">{ECOSYSTEM_TAGLINE}</p>

            <div className="platform-hero-actions">
              <Link className="marketing-button marketing-button-primary" href={primaryHref}>
                {primaryLabel}
              </Link>
              <Link className="marketing-button marketing-button-secondary" href="/apps">
                Explore Apps
              </Link>
              <Link className="marketing-button marketing-button-ghost" href="/install">
                Install platform
              </Link>
            </div>

            <div className="platform-trust-row">
              <span>One login</span>
              <span>One subscription</span>
              <span>Shared memory</span>
            </div>
          </div>

          <div className="platform-hero-visual">
            <div className="platform-mark-stage">
              <Image
                alt="Odirico Platform mark"
                className="platform-mark-image"
                height={240}
                priority
                src="/branding/odirico-platform.jpg"
                width={240}
              />
            </div>

            <div className="platform-hero-modules">
              {ECOSYSTEM_APP_STORIES.map((app) => (
                <article className="platform-module" key={app.key}>
                  <div className="platform-module-head">
                    <p className="platform-module-kicker">{app.platformRole}</p>
                    <Image alt="" className="platform-module-logo" height={58} src={app.logoPath} width={58} />
                    <h2>{app.label}</h2>
                  </div>
                  <p>{app.tagline}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-support">
        <div className="marketing-shell">
          <div className="platform-support-strip">
            {PLATFORM_SUPPORT_POINTS.map((point) => (
              <article className="platform-support-card" key={point.title}>
                <p className="platform-module-kicker">Platform support</p>
                <h2>{point.title}</h2>
                <p>{point.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Apps</p>
              <h2>Each app keeps one pressure zone clear.</h2>
            </div>
            <p>
              Ember handles weekly load. Sol keeps money and direction legible. Surge holds
              applications and outward momentum. The platform matters because these jobs stay
              distinct while the account stays shared.
            </p>
          </div>

          <div className="platform-app-showcase">
            {ECOSYSTEM_APP_STORIES.map((app) => (
              <article className="platform-app-card" id={app.key} key={app.key}>
                <div className="platform-app-card-head">
                  <Image alt="" className="platform-app-logo" height={72} src={app.logoPath} width={72} />
                  <div>
                    <p className="platform-module-kicker">{app.platformRole}</p>
                    <h3>{app.label}</h3>
                  </div>
                </div>
                <p>{app.summary}</p>
                <div className="platform-card-footer">
                  <span className="platform-status-pill">{app.statusLabel}</span>
                  <Link className="platform-inline-link" href={app.accessHref}>
                    Enter {app.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">How it connects</p>
              <h2>The value grows when one useful signal moves into the next app.</h2>
            </div>
            <p>
              Search, planning, money direction, and follow-through are usually overlapping
              pressures. The platform should reduce setup cost between them instead of creating one
              more dashboard to babysit.
            </p>
          </div>

          <div className="connection-flow-list">
            {CONNECTION_FLOWS.map((flow, index) => (
              <article className="connection-flow" key={flow.title}>
                <span className="connection-flow-index">0{index + 1}</span>
                <div>
                  <h3>{flow.title}</h3>
                  <p>{flow.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Pricing</p>
              <h2>One plan model across the connected system.</h2>
            </div>
            <p>
              Pricing stays visible, but it should communicate one ecosystem instead of separate app
              billing. Free comes first, one paid plan is clearly recommended, and the rest stays
              easy to understand.
            </p>
          </div>

          <div className="pricing-grid">
            {PRICING_PLANS.map((plan) => (
              <article
                className={plan.highlight ? "pricing-card pricing-card-highlight" : "pricing-card"}
                key={plan.name}
              >
                <p className="platform-module-kicker">{plan.audience}</p>
                {plan.badge ? <span className="pricing-badge">{plan.badge}</span> : null}
                <h3>{plan.name}</h3>
                <p className="pricing-price">
                  {plan.price}
                  <span>{plan.cadence}</span>
                </p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link className="marketing-button marketing-button-secondary pricing-card-cta" href={plan.ctaHref}>
                  {plan.ctaLabel}
                </Link>
              </article>
            ))}
          </div>

          <div className="pricing-proof-strip">
            {PRICING_PROOF_POINTS.map((point) => (
              <article className="pricing-proof-card" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </article>
            ))}
          </div>

          <div className="platform-section-cta-row">
            <Link className="marketing-button marketing-button-primary" href="/pricing">
              See full pricing
            </Link>
            <Link className="marketing-button marketing-button-secondary" href={primaryHref}>
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Trust and next step</p>
            <h2>A calmer system only works if the shell feels trustworthy too.</h2>
          </div>

          <div className="platform-trust-grid">
            {TRUST_PROMISES.map((promise) => (
              <article className="platform-trust-card" key={promise.title}>
                <h3>{promise.title}</h3>
                <p>{promise.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="marketing-shell platform-final-cta">
          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/privacy">
              Review privacy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
