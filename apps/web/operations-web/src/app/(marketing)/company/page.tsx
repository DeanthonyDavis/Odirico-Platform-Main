import Link from "next/link";

import { WHY_IT_EXISTS } from "@/components/marketing/ecosystem-data";

export default function CompanyPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Company</p>
            <h1>Odirico is the company behind the platform ecosystem.</h1>
          </div>
          <p>
            The product users should care about is the connected platform. The company page exists
            to make that relationship clear without burying the user in unrelated product stacks.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-why-list">
          {WHY_IT_EXISTS.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Best next step</p>
            <h2>The company story should lead back into the product, not away from it.</h2>
          </div>
          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/get-started">
              Get started
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/product-tour">
              Product tour
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
