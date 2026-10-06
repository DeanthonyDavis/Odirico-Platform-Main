import Image from "next/image";
import { TextLink } from "@/components/ui/link-button";
import { Wordmark } from "@/components/ui/wordmark";
import {
  getPublishedCompanies,
  type PortfolioCompany,
} from "@/config/portfolio";
export function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow section-label${light ? " light" : ""}`}>
      {children}
    </p>
  );
}
export function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="page-intro wrap">
      <SectionLabel>{label}</SectionLabel>
      <h1>{title}</h1>
      <div className="intro-copy">{children}</div>
    </section>
  );
}
export function Closing({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`closing wrap ${compact ? "closing--compact" : ""}`}>
      <p>
        We intend to build
        <br />
        something that lasts.
      </p>
      <Wordmark />
      <TextLink href="/contact">Get in touch</TextLink>
    </section>
  );
}
export function CompanyOverview({
  item,
  detail = false,
}: {
  item: PortfolioCompany;
  detail?: boolean;
}) {
  return (
    <article className="company-entry">
      {item.logo && (
        <Image
          src={item.logo}
          alt={item.name + " logo"}
          width={180}
          height={64}
          unoptimized
        />
      )}
      {item.image && (
        <Image
          src={item.image}
          alt=""
          width={960}
          height={600}
          sizes="(max-width: 760px) 90vw, 60vw"
        />
      )}
      <div>
        <p className="eyebrow">{item.industry}</p>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <dl>
          <div>
            <dt>Ownership</dt>
            <dd>{item.ownershipStatus}</dd>
          </div>
          <div>
            <dt>Operating status</dt>
            <dd>{item.operatingStatus}</dd>
          </div>
          <div>
            <dt>Relationship</dt>
            <dd>{item.corporateRelationship}</dd>
          </div>
        </dl>
        {item.showParentDesignation && (
          <p className="parent-designation">An ŌDIRICO Company</p>
        )}
        {item.website && (
          <a
            className="text-link"
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Company website ↗
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {!detail && (
          <TextLink href={`/portfolio/${item.slug}`}>
            About the company
          </TextLink>
        )}
      </div>
    </article>
  );
}
export function Portfolio({ full = false }: { full?: boolean }) {
  const companies = getPublishedCompanies();
  return companies.length ? (
    <div className="portfolio-list">
      {companies.map((item) => (
        <CompanyOverview key={item.slug} item={item} />
      ))}
    </div>
  ) : (
    <div className="portfolio-introduction">
      <div className="portfolio-status">
        <span aria-hidden="true" className="status-dash" />
        <h3>Portfolio developing</h3>
      </div>
      <p>
        We are laying the foundations for long-term ownership. Operating
        companies will be introduced here as they are established and ready to
        be shared.
      </p>
      <TextLink href={full ? "/approach" : "/portfolio"}>
        {full ? "How we approach ownership" : "Explore our portfolio"}
      </TextLink>
    </div>
  );
}
