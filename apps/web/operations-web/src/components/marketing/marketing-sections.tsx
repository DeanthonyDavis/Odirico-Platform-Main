import Link from "next/link";
import type { ReactNode } from "react";

type Stat = {
  label: string;
  value: string;
};

type Card = {
  badge?: string;
  title: string;
  copy: string;
  bullets?: string[];
  href?: string;
  hrefLabel?: string;
};

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "dark";
};

function isExternalHref(href: string) {
  return href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://");
}

export function MarketingHero({
  eyebrow,
  title,
  copy,
  actions,
  side,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  actions: HeroAction[];
  side?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={dark ? "marketing-hero marketing-hero-dark" : "marketing-hero"}>
      <div className="marketing-shell marketing-hero-grid">
        <div className="marketing-hero-copy">
          <p className="marketing-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="marketing-lead">{copy}</p>
          <div className="marketing-button-row">
            {actions.map((action) => (
              isExternalHref(action.href) ? (
                <a
                  className={`marketing-button marketing-button-${action.variant ?? "primary"}`}
                  href={action.href}
                  key={`${action.href}-${action.label}`}
                >
                  {action.label}
                </a>
              ) : (
                <Link
                  className={`marketing-button marketing-button-${action.variant ?? "primary"}`}
                  href={action.href as never}
                  key={`${action.href}-${action.label}`}
                >
                  {action.label}
                </Link>
              )
            ))}
          </div>
        </div>

        {side ? <aside className="marketing-hero-panel">{side}</aside> : null}
      </div>
    </section>
  );
}

export function MarketingSection({
  eyebrow,
  title,
  copy,
  children,
  muted = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={muted ? "marketing-section marketing-section-muted" : "marketing-section"}>
      <div className="marketing-shell">
        <div className="marketing-section-head">
          <div>
            {eyebrow ? <p className="marketing-section-kicker">{eyebrow}</p> : null}
            <h2>{title}</h2>
          </div>
          {copy ? <p className="marketing-section-copy">{copy}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function MarketingStats({ items }: { items: Stat[] }) {
  return (
    <div className="marketing-stats-grid">
      {items.map((item) => (
        <article className="marketing-stat-card" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </div>
  );
}

export function MarketingCardGrid({
  cards,
  columns = 3,
}: {
  cards: Card[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <div className={`marketing-card-grid columns-${columns}`}>
      {cards.map((card) => {
        const body = (
          <>
            {card.badge ? <span className="marketing-card-badge">{card.badge}</span> : null}
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            {card.bullets?.length ? (
              <ul className="marketing-list">
                {card.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {card.href && card.hrefLabel ? (
              <span className="marketing-card-link">{card.hrefLabel}</span>
            ) : null}
          </>
        );

        return card.href ? (
          isExternalHref(card.href) ? (
            <a className="marketing-card marketing-card-linkable" href={card.href} key={card.title}>
              {body}
            </a>
          ) : (
            <Link className="marketing-card marketing-card-linkable" href={card.href as never} key={card.title}>
              {body}
            </Link>
          )
        ) : (
          <article className="marketing-card" key={card.title}>
            {body}
          </article>
        );
      })}
    </div>
  );
}

export function MarketingCta({
  title,
  copy,
  primary,
  secondary,
}: {
  title: string;
  copy: string;
  primary: HeroAction;
  secondary?: HeroAction;
}) {
  return (
    <section className="marketing-cta-band">
      <div className="marketing-shell">
        <div className="marketing-cta-card">
          <div>
            <p className="marketing-section-kicker">Next step</p>
            <h2>{title}</h2>
            <p className="marketing-section-copy">{copy}</p>
          </div>
          <div className="marketing-button-row">
            {isExternalHref(primary.href) ? (
              <a className={`marketing-button marketing-button-${primary.variant ?? "dark"}`} href={primary.href}>
                {primary.label}
              </a>
            ) : (
              <Link className={`marketing-button marketing-button-${primary.variant ?? "dark"}`} href={primary.href as never}>
                {primary.label}
              </Link>
            )}
            {secondary ? (
              isExternalHref(secondary.href) ? (
                <a className={`marketing-button marketing-button-${secondary.variant ?? "secondary"}`} href={secondary.href}>
                  {secondary.label}
                </a>
              ) : (
                <Link
                  className={`marketing-button marketing-button-${secondary.variant ?? "secondary"}`}
                  href={secondary.href as never}
                >
                  {secondary.label}
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
