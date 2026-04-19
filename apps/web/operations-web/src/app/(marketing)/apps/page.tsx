import Image from "next/image";

import { AppAccessLinks } from "@/components/platform/app-access-links";
import { ECOSYSTEM_APP_STORIES } from "@/components/marketing/ecosystem-data";

const appBullets: Record<(typeof ECOSYSTEM_APP_STORIES)[number]["key"], string[]> = {
  ember: [
    "Daily planning, recovery, and assignment awareness in one rhythm-friendly space.",
    "Built to support school load, burnout management, and short-term stability.",
    "Designed as the part of the system that keeps the week usable.",
  ],
  sol: [
    "Credit direction, money decisions, and long-range goal planning.",
    "Built to make financial strategy feel grounded instead of abstract.",
    "Designed as the part of the system that keeps the future legible.",
  ],
  surge: [
    "Application capture, follow-ups, and recruiter or ATS signal tracking.",
    "Built to keep job and internship momentum from turning into scattered notes.",
    "Designed as the part of the system that keeps opportunity progress visible.",
  ],
};

export default function AppsPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Apps</p>
            <h1>Three focused products inside one ecosystem.</h1>
          </div>
          <p>
            Ember, Sol, and Surge are not meant to compete for attention. Each one owns a specific
            zone of life so the overall system stays understandable.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell platform-app-stack">
          {ECOSYSTEM_APP_STORIES.map((app) => (
            <article className="platform-app-detail" id={app.key} key={app.key}>
              <div className="platform-app-detail-main">
                <div className="platform-app-brand">
                  <Image alt="" className="platform-app-logo" height={88} src={app.logoPath} width={88} />
                  <div>
                    <p className="platform-module-kicker">{app.platformRole}</p>
                    <h2>{app.label}</h2>
                    <p>{app.summary}</p>
                  </div>
                </div>

                <ul className="platform-detail-list">
                  {appBullets[app.key].map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <aside className="platform-app-detail-side">
                <p className="platform-module-kicker">Access</p>
                <AppAccessLinks targets={app.installTargets} />
                <p className="platform-app-note">{app.installHeadline}</p>
              </aside>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
