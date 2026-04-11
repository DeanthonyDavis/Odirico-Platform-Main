import Link from "next/link";

import { WHY_IT_EXISTS } from "@/components/marketing/ecosystem-data";

export default function AboutPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">About</p>
            <h1>Odirico is the company. The platform is the user-facing system.</h1>
          </div>
          <p>
            The brand should be simple. Odirico is the parent company. Ember, Sol, and Surge are
            the connected products users actually live inside. The public experience should reflect
            that without pretending the company name itself is the product.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Why build it this way</p>
            <h2>It should feel like a life system, not a folder of apps.</h2>
          </div>
          <div className="platform-why-list">
            {WHY_IT_EXISTS.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell platform-priority-list">
          <article className="platform-priority">
            <h3>Odirico</h3>
            <p>The parent company behind the ecosystem, infrastructure, and future products.</p>
          </article>
          <article className="platform-priority">
            <h3>Odirico Platform</h3>
            <p>The connected consumer product layer built around Ember, Sol, and Surge.</p>
          </article>
          <article className="platform-priority">
            <h3>Consumer focus</h3>
            <p>The public platform experience should stay centered on time, money, and momentum instead of mixing unrelated products into the story.</p>
          </article>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Next step</p>
            <h2>Enter the ecosystem or review the app layer first.</h2>
          </div>
          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/login">
              Get Started
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/apps">
              Explore Apps
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
