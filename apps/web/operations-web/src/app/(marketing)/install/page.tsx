import Link from "next/link";

import { INSTALL_SURFACES } from "@/components/marketing/ecosystem-data";
import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";

export default function InstallPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">Install</p>
            <h1>Install the platform once, then open the module you need.</h1>
          </div>
          <p>
            Because Ember, Sol, and Surge live inside one deploy, the install path is the platform
            itself. Once it is installed, each module becomes a destination inside the same system.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell install-surface-grid">
          {INSTALL_SURFACES.map((surface) => (
            <article className="install-surface-card" id={surface.id} key={surface.id}>
              <p className="platform-module-kicker">{surface.label}</p>
              <p>{surface.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Module routes</p>
              <h2>Direct links for each module.</h2>
            </div>
            <p>
              Use these when you want to jump directly into a specific module. The web route is
              live now. The device install links point you to the platform install path for that
              module.
            </p>
          </div>

          <div className="install-app-grid">
            {ODIRICO_ECOSYSTEM_APPS.map((app) => (
              <article className="install-app-card" key={app.key}>
                <h3>{app.label}</h3>
                <p>{app.tagline}</p>
                <ul className="install-link-list">
                  {app.installTargets.map((target) => (
                    <li id={`${app.key}-${target.surface}`} key={`${app.key}-${target.surface}`}>
                      <Link href={target.href as never}>
                        {target.label}
                      </Link>
                      <span>{target.note}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
