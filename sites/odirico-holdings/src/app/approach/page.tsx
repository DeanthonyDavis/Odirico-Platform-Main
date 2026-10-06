import { PageIntro, SectionLabel, Closing } from "@/components/sections/shared";
import { approach, principles } from "@/config/company";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Approach",
  "Build, acquire, operate, and allocate with a long time horizon. The Odirico approach to ownership.",
  "/approach",
);
export default function Approach() {
  return (
    <>
      <PageIntro
        label="Approach"
        title={
          <>
            Deliberate by design.
            <br />
            Long-term by choice.
          </>
        }
      >
        <p>
          Our approach starts with the business: what it does well, what it
          needs, and how patient ownership can support its future.
        </p>
      </PageIntro>
      <section className="wrap section-space editorial ruled">
        <SectionLabel>How we work</SectionLabel>
        <div className="activity-list">
          {approach.map((item, i) => (
            <article key={item.title}>
              <span className="index">0{i + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="soft-section">
        <div className="wrap section-space editorial">
          <SectionLabel>Ownership principles</SectionLabel>
          <div className="principles-list">
            {principles.map((p) => (
              <article key={p.title}>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Closing compact />
    </>
  );
}
