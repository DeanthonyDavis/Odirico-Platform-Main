import Link from "next/link";

import {
  INSTALL_DESTINATIONS,
  INSTALL_SURFACES,
} from "@/components/marketing/ecosystem-data";
import { InstallCta } from "@/components/platform/install-cta";
import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";

const installGuideAnchors: Record<string, string> = {
  desktop: "desktop-guide",
  iphone: "ios-guide",
  android: "android-guide",
  web: "browser-guide",
};

const installGuideTitles: Record<string, string> = {
  desktop: "Desktop install guide",
  iphone: "iPhone and iPad guide",
  android: "Android guide",
  web: "Browser guide",
};

export default function InstallPage() {
  return (
    <>
      <section className="platform-page-hero platform-page-hero-install">
        <div className="marketing-shell platform-install-hero-grid">
          <div className="platform-install-copy">
            <p className="platform-kicker">Install everywhere</p>
            <h1>Install Odirico on desktop, phone, or stay in the browser.</h1>
            <p className="platform-lead">
              The current install path is the shared Odirico platform itself. You install one
              platform shell, then move across Ember, Sol, and Surge without switching products.
            </p>

            <div className="platform-hero-actions">
              <InstallCta />
              <Link className="marketing-button marketing-button-secondary" href="/login?next=/overview">
                Open in browser
              </Link>
              <Link className="marketing-button marketing-button-ghost" href="#desktop-guide">
                Desktop steps
              </Link>
            </div>

            <div className="platform-install-platforms">
              <span>Windows</span>
              <span>macOS</span>
              <span>Linux</span>
              <span>iPhone</span>
              <span>Android</span>
              <span>Browser</span>
            </div>
          </div>

          <aside className="platform-install-highlight">
            <p className="platform-module-kicker">What install means today</p>
            <h2>There is one platform shell, not separate app downloads.</h2>
            <ul className="platform-detail-list">
              <li>Desktop uses the browser install flow from Chrome or Edge.</li>
              <li>iPhone and iPad use Add to Home Screen from Safari.</li>
              <li>Android can use the install prompt or Add to Home screen from Chrome.</li>
              <li>Browser access stays live if you are not ready to install yet.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Install surfaces</p>
              <h2>Desktop and mobile options are visible up front now.</h2>
            </div>
            <p>
              This is the install layer the platform was missing. Instead of hiding desktop access
              in generic text, the page now shows the current supported surfaces directly.
            </p>
          </div>

          <div className="install-destination-grid">
            {INSTALL_DESTINATIONS.map((destination) => (
              <article className="install-destination-card" key={destination.id}>
                <div>
                  <p className="platform-module-kicker">{destination.family}</p>
                  <h3>{destination.label}</h3>
                </div>
                <p>{destination.summary}</p>
                <p className="install-destination-detail">{destination.detail}</p>
                <Link className="marketing-button marketing-button-secondary install-destination-cta" href={destination.href}>
                  {destination.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Guides</p>
              <h2>Platform-specific install instructions.</h2>
            </div>
            <p>
              These are the current instructions for the shared Odirico platform shell. Once you
              install it, the same account and route structure follow you across devices.
            </p>
          </div>

          <div className="install-guide-grid">
            {INSTALL_SURFACES.map((surface) => (
              <article
                className="install-guide-card"
                id={installGuideAnchors[surface.id] ?? surface.id}
                key={surface.id}
              >
                <p className="platform-module-kicker">{surface.label}</p>
                <h3>{installGuideTitles[surface.id] ?? surface.label}</h3>
                <p>{surface.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Module routes</p>
              <h2>Open the module you want after install.</h2>
            </div>
            <p>
              The web routes are live now. Desktop and mobile install still land in the same shared
              platform, then route you into the module you want to use.
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
                      <Link href={target.href as never}>{target.label}</Link>
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
