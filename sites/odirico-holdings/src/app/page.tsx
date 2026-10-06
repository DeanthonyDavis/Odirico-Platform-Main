import { Closing, Portfolio, SectionLabel } from "@/components/sections/shared";
import { TextLink, LinkButton } from "@/components/ui/link-button";
import { Wordmark } from "@/components/ui/wordmark";
import { activities, principles } from "@/config/company";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Built to own. Built to endure.",
  "Odirico is a private holding company focused on building, acquiring, and supporting businesses for the long term.",
  "/",
);
export default function Home() {
  return (
    <>
      <section className="hero wrap" aria-labelledby="home-title">
        <div className="hero-topline">
          <span className="eyebrow">A private holding company</span>
          <span className="eyebrow">An enduring perspective</span>
        </div>
        <h1 id="home-title">
          <Wordmark />
        </h1>
        <div className="hero-baseline">
          <h2>
            Built to own.
            <br />
            Built to endure.
          </h2>
          <div className="hero-summary">
            <p>
              ŌDIRICO is a private holding company focused on building,
              acquiring, and supporting businesses for the long term.
            </p>
            <div className="hero-actions">
              <LinkButton href="/company">Explore ŌDIRICO</LinkButton>
              <TextLink href="/approach">Our approach</TextLink>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>Independent businesses. A long-term view.</span>
          <a href="#introduction" aria-label="Discover Odirico below">
            Discover ↓
          </a>
        </div>
      </section>
      <section id="introduction" className="wrap section-space editorial">
        <SectionLabel>01 / The company</SectionLabel>
        <div className="editorial-body">
          <h2>
            Ownership with
            <br />a longer view.
          </h2>
          <p className="lead">
            We are building the foundations of a holding company designed to own
            and support independent businesses across industries.
          </p>
          <p>
            Our role is to provide direction, allocate resources with
            discipline, and help operating companies develop on their own terms.
            We are at the beginning of that work.
          </p>
          <TextLink href="/company">Meet ŌDIRICO</TextLink>
        </div>
      </section>
      <section className="soft-section">
        <div className="wrap section-space editorial">
          <SectionLabel>02 / What we do</SectionLabel>
          <div className="activity-list">
            {activities.map((item, i) => (
              <article key={item.title}>
                <span className="index">0{i + 1}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section-space editorial">
        <SectionLabel>03 / Portfolio</SectionLabel>
        <div className="editorial-body">
          <h2>
            Independent businesses.
            <br />
            Shared perspective.
          </h2>
          <Portfolio />
        </div>
      </section>
      <section className="dark-section">
        <div className="wrap section-space editorial">
          <SectionLabel light>04 / Ownership philosophy</SectionLabel>
          <div>
            <h2>
              Time is part
              <br />
              of the approach.
            </h2>
            <p className="lead">
              We intend to own with patience, support with purpose, and give
              good businesses room to develop.
            </p>
            <div className="principles-grid">
              {principles.slice(0, 4).map((p) => (
                <article key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </article>
              ))}
            </div>
            <TextLink href="/approach">Our ownership philosophy</TextLink>
          </div>
        </div>
      </section>
      <section className="wrap section-space editorial">
        <SectionLabel>05 / Acquisitions</SectionLabel>
        <div className="editorial-body">
          <h2>
            Considering
            <br />
            what comes next?
          </h2>
          <p className="lead">
            We welcome conversations with owners and intermediaries who care
            about the next chapter of a durable business.
          </p>
          <p>
            Every business has its own context. An introduction is a place to
            start.
          </p>
          <TextLink href="/acquisitions">Start a conversation</TextLink>
        </div>
      </section>
      <Closing />
    </>
  );
}
