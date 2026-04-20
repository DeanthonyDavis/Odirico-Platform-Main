import Link from "next/link";

const DEMO_PATHS = [
  {
    title: "Open the live platform shell",
    copy: "Start from the actual Odirico shell if you already want to see the product in motion.",
    href: "/signup",
    cta: "Create account",
  },
  {
    title: "Use the product tour first",
    copy: "Walk through Ember, Sol, and Surge separately before you make a pricing decision.",
    href: "/product-tour",
    cta: "Open product tour",
  },
  {
    title: "Talk to Odirico directly",
    copy: "If you want the product framed around your actual use case, use the direct contact route.",
    href: "/contact",
    cta: "Contact Odirico",
  },
] as const;

export default function ProductDemoPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Product demo</p>
            <h1>Choose the cleanest path into a real demo.</h1>
          </div>
          <p>
            The demo flow should feel intentional. Start in the live shell, walk the product tour,
            or go straight to contact if you want a more guided explanation.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell get-started-grid">
          {DEMO_PATHS.map((path) => (
            <article className="get-started-card" key={path.title}>
              <p className="platform-module-kicker">Demo option</p>
              <h2>{path.title}</h2>
              <p>{path.copy}</p>
              <Link className="marketing-button marketing-button-secondary get-started-card-cta" href={path.href}>
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
