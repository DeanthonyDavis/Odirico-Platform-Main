import Image from "next/image";
import Link from "next/link";

import { ECOSYSTEM_APP_STORIES } from "@/components/marketing/ecosystem-data";

const TOUR_CALLOUTS: Record<(typeof ECOSYSTEM_APP_STORIES)[number]["key"], string[]> = {
  ember: [
    "See how Ember frames week structure, recovery, and academic load.",
    "Tour the kind of planning surface that should feel usable every day.",
  ],
  sol: [
    "See how Sol turns money pressure into steady decisions and visible direction.",
    "Tour the side of the platform that keeps your longer-term path legible.",
  ],
  surge: [
    "See how Surge keeps application momentum organized instead of scattered.",
    "Tour the cross-app execution layer without mixing pricing into the experience.",
  ],
};

export default function ProductTourPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Product tour</p>
            <h1>See the platform by what each app is supposed to do.</h1>
          </div>
          <p>
            This page stays focused on the product experience. No pricing cards, no paywall copy,
            and no plan comparison until you intentionally open pricing.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell product-tour-stack">
          {ECOSYSTEM_APP_STORIES.map((app) => (
            <article className="product-tour-card" key={app.key}>
              <div className="product-tour-copy">
                <div className="platform-app-brand">
                  <Image alt="" className="platform-app-logo" height={88} src={app.logoPath} width={88} />
                  <div>
                    <p className="platform-module-kicker">{app.platformRole}</p>
                    <h2>{app.label}</h2>
                    <p>{app.summary}</p>
                  </div>
                </div>

                <ul className="platform-detail-list">
                  {TOUR_CALLOUTS[app.key].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <aside className="product-tour-side">
                <p className="platform-module-kicker">Best next move</p>
                <h3>Tour the product story first.</h3>
                <p>{app.installHeadline}</p>
                <div className="platform-hero-actions">
                  <Link className="marketing-button marketing-button-secondary" href="/get-started">
                    Back to get started
                  </Link>
                  <Link className="marketing-button marketing-button-ghost" href="/pricing">
                    View pricing when ready
                  </Link>
                </div>
              </aside>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
