import Link from "next/link";

const GET_STARTED_OPTIONS = [
  {
    title: "Product tours",
    copy: "See the platform through Ember, Sol, and Surge without showing pricing first.",
    href: "/product-tour",
    cta: "Open tour",
  },
  {
    title: "Product demo",
    copy: "Start from the live product story and the best route for a guided walkthrough.",
    href: "/product-demo",
    cta: "View demo path",
  },
  {
    title: "Pricing and plans",
    copy: "Only open pricing when you actually want to compare plans and start checkout.",
    href: "/pricing",
    cta: "See pricing",
  },
] as const;

export default function GetStartedPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Get started</p>
            <h1>Start exploring Odirico the right way.</h1>
          </div>
          <p>
            Choose the route you actually want. Product tours stay focused on the experience. Demo
            explains the system. Pricing waits until you intentionally ask for plans.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell get-started-grid">
          {GET_STARTED_OPTIONS.map((option) => (
            <article className="get-started-card" key={option.title}>
              <p className="platform-module-kicker">Next step</p>
              <h2>{option.title}</h2>
              <p>{option.copy}</p>
              <Link className="marketing-button marketing-button-secondary get-started-card-cta" href={option.href}>
                {option.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Need help</p>
            <h2>If you want a guided path instead of guessing, start with the demo route.</h2>
          </div>

          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/product-demo">
              Open demo path
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/contact">
              Contact Odirico
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
