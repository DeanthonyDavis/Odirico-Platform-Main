import Image from "next/image";
import Link from "next/link";

import { AppAccessLinks } from "@/components/platform/app-access-links";
import {
  CONNECTION_FLOWS,
  ECOSYSTEM_APP_STORIES,
  ECOSYSTEM_TAGLINE,
  PRICING_PLANS,
  SYSTEM_PILLARS,
  WHY_IT_EXISTS,
} from "@/components/marketing/ecosystem-data";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSession();
  const primaryHref = user ? "/overview" : "/signup";
  const primaryLabel = user ? "Open Platform" : "Create your account";

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
                Install Platform
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
                    <Image alt="" className="platform-module-logo" height={58} src={app.logoPath} width={58} />
                    <div>
                      <p className="platform-module-kicker">{app.platformRole}</p>
                      <h2>{app.label}</h2>
                    </div>
                  </div>
                  <p>{app.tagline}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">System</p>
              <h2>Three focused products. One connected platform.</h2>
            </div>
            <p>
              Ember handles your week. Sol handles your money and direction. Surge handles
              opportunities and execution. The platform ties them together so the same context does
              not need to be rebuilt three times.
            </p>
          </div>

          <div className="platform-pillars">
            {SYSTEM_PILLARS.map((pillar) => (
              <article className="platform-pillar" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Connection</p>
              <h2>The value is in how the apps connect.</h2>
            </div>
            <p>
              This only works if the handoff between modules feels natural. The ecosystem is meant
              to remember what happened and move the next useful signal into the right place.
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
              <p className="platform-kicker">Apps</p>
              <h2>Each module has a clear job inside the system.</h2>
            </div>
            <p>
              The platform should feel like one place to live, not a random pile of tools. Each
              module owns a different pressure zone in real life.
            </p>
          </div>

          <div className="platform-app-stack">
            {ECOSYSTEM_APP_STORIES.map((app) => (
              <article className="platform-app-row" id={app.key} key={app.key}>
                <div className="platform-app-brand">
                  <Image alt="" className="platform-app-logo" height={76} src={app.logoPath} width={76} />
                  <div>
                    <p className="platform-module-kicker">{app.integrationRole}</p>
                    <h3>{app.label}</h3>
                    <p>{app.summary}</p>
                  </div>
                </div>

                <div className="platform-app-actions">
                  <AppAccessLinks compact targets={app.installTargets} />
                  <Link className="platform-inline-link" href={app.accessHref}>
                    Enter {app.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-pricing">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Pricing</p>
              <h2>One plan model for the whole ecosystem.</h2>
            </div>
            <p>Pricing applies across Ember, Sol, and Surge instead of splitting access by module.</p>
          </div>

          <div className="pricing-grid">
            {PRICING_PLANS.map((plan) => (
              <article className="pricing-card" key={plan.name}>
                <p className="platform-module-kicker">{plan.audience}</p>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Why this exists</p>
            <h2>Most apps only solve one piece of life at a time.</h2>
          </div>

          <div className="platform-why-list">
            {WHY_IT_EXISTS.map((item) => (
              <p key={item}>{item}</p>
            ))}

            <div className="platform-hero-actions">
              <Link className="marketing-button marketing-button-primary" href={primaryHref}>
                {primaryLabel}
              </Link>
              <Link className="marketing-button marketing-button-secondary" href="/pricing">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
