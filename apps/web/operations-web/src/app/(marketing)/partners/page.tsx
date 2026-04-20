import Link from "next/link";

const PARTNER_OPTIONS = [
  {
    title: "Advisors and mentors",
    copy: "Partners who help people stay on track across school, money, and opportunity decisions.",
  },
  {
    title: "Schools and support programs",
    copy: "Organizations that want students to use one clearer operating system instead of fragmented tools.",
  },
  {
    title: "Career and accountability ecosystems",
    copy: "Programs that care about follow-through and measurable momentum, not just static resources.",
  },
] as const;

export default function PartnersPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Partners</p>
            <h1>Partnership should support the product, not distract from it.</h1>
          </div>
          <p>
            The platform story comes first. Partner routes exist for institutions, advisors, and
            support ecosystems that want to plug into that consumer system responsibly.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-priority-list">
          {PARTNER_OPTIONS.map((partner) => (
            <article className="platform-priority" key={partner.title}>
              <h2>{partner.title}</h2>
              <p>{partner.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-final">
        <div className="marketing-shell platform-final-grid">
          <div>
            <p className="platform-kicker">Talk to Odirico</p>
            <h2>Use the contact route when the conversation is about partnership, not pricing.</h2>
          </div>
          <div className="platform-hero-actions">
            <Link className="marketing-button marketing-button-primary" href="/contact">
              Contact Odirico
            </Link>
            <Link className="marketing-button marketing-button-secondary" href="/company">
              Company page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
