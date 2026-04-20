import Link from "next/link";

const CUSTOMER_GROUPS = [
  {
    title: "Students managing weekly load",
    copy: "People who need planning, money direction, and academic pressure management to stop competing with each other.",
  },
  {
    title: "Early-career users building momentum",
    copy: "People balancing job search, money pressure, and daily execution at the same time.",
  },
  {
    title: "Users who need one connected system",
    copy: "People who do not want three unrelated tools for planning, money, and applications.",
  },
] as const;

export default function CustomersPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Customers</p>
            <h1>The platform is being built for overlapping real-life pressure.</h1>
          </div>
          <p>
            Odirico is not aimed at abstract enterprise personas here. The core customer is a
            person managing planning, money, and outward momentum at the same time.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-priority-list">
          {CUSTOMER_GROUPS.map((group) => (
            <article className="platform-priority" key={group.title}>
              <h2>{group.title}</h2>
              <p>{group.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">See the product</p>
            <h2>If the customer story fits, the next move is the product tour or the live shell.</h2>
          </div>
          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/product-tour">
              Product tour
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/get-started">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
