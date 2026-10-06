import { PageIntro, SectionLabel, Closing } from "@/components/sections/shared";
import { TextLink } from "@/components/ui/link-button";
import { Wordmark } from "@/components/ui/wordmark";
import { milestones } from "@/config/company";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Company",
  "A private holding company built around long-term ownership, independent businesses, and disciplined oversight.",
  "/company",
);
export default function Company() {
  const verified = milestones.filter((m) => m.verified);
  return (
    <>
      <PageIntro
        label="Company"
        title={
          <>
            A long-term
            <br />
            perspective.
          </>
        }
      >
        <p>
          ŌDIRICO is a private holding company focused on building, acquiring,
          and supporting independent operating businesses.
        </p>
      </PageIntro>
      <section className="soft-section">
        <div className="wrap section-space editorial">
          <SectionLabel>Purpose & structure</SectionLabel>
          <div className="editorial-body">
            <h2>
              A permanent point
              <br />
              of perspective.
            </h2>
            <p className="lead">
              The holding-company structure separates the responsibilities of
              ownership from the daily work of each operating business.
            </p>
            <p>
              ŌDIRICO intends to provide strategic oversight, allocate capital,
              and develop shared infrastructure where it helps. Operating
              companies can retain their own brands, expertise, and
              relationships, supported by a common commitment to accountable
              management.
            </p>
            <p>
              Our interests are not confined to one industry. We consider the
              needs and strengths of each business on its own terms.
            </p>
          </div>
        </div>
      </section>
      <section className="wrap section-space editorial">
        <SectionLabel>Independent by design</SectionLabel>
        <div>
          <div
            className="ownership-diagram"
            aria-label="Intended structure: Odirico as parent, with independent operating companies"
          >
            <Wordmark />
            <p>Parent / Holding company</p>
            <div className="structure-rule" aria-hidden="true" />
            <h2>Operating companies</h2>
            <p>Independent brands. Accountable leadership.</p>
          </div>
          <p className="note">
            This describes our intended structure, not a list of existing
            subsidiaries.
          </p>
          <TextLink href="/portfolio">Portfolio developing</TextLink>
        </div>
      </section>
      <section className="wrap section-space editorial ruled">
        <SectionLabel>Where we are</SectionLabel>
        <div className="editorial-body">
          <h2>
            At the beginning.
            <br />
            Thinking beyond it.
          </h2>
          <p className="lead">
            ŌDIRICO is early-stage. Our focus today is on establishing the
            foundations for thoughtful business development and future
            ownership.
          </p>
          <p>
            We will share operating companies, people, and milestones as there
            is verified information to share.
          </p>
          {verified.length > 0 && (
            <div className="timeline">
              {verified.map((m) => (
                <details key={m.date + m.title}>
                  <summary>
                    {m.date} — {m.title}
                  </summary>
                  <p>{m.description}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
      <Closing compact />
    </>
  );
}
