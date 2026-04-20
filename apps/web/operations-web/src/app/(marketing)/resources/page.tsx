import Link from "next/link";

const RESOURCE_LINKS = [
  {
    title: "Install guides",
    copy: "Desktop and mobile web install paths, plus current release notes about native packaging.",
    href: "/install",
    cta: "Open install",
  },
  {
    title: "Privacy and trust",
    copy: "Privacy policy, cookie policy, disclaimer, and account deletion route in one place.",
    href: "/privacy",
    cta: "Open privacy",
  },
  {
    title: "Get started paths",
    copy: "Choose between product tour, demo, and pricing only when you actually want it.",
    href: "/get-started",
    cta: "Open get started",
  },
] as const;

export default function ResourcesPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Resources</p>
            <h1>Open the practical routes without turning the site into an endless scroll.</h1>
          </div>
          <p>
            Resources should help someone move forward, not force them through the entire marketing
            story again.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell get-started-grid">
          {RESOURCE_LINKS.map((resource) => (
            <article className="get-started-card" key={resource.title}>
              <p className="platform-module-kicker">Resource</p>
              <h2>{resource.title}</h2>
              <p>{resource.copy}</p>
              <Link className="marketing-button marketing-button-secondary get-started-card-cta" href={resource.href}>
                {resource.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
