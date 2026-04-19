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
              The shared platform shell works today through browser install flows on desktop and
              mobile, with the same web routes underneath all of them. Signed native Windows
              distribution is being prepared before it is offered publicly again.
            </p>

            <div className="platform-hero-actions">
              <InstallCta />
              <Link className="marketing-button marketing-button-secondary" href="/login?next=/overview">
                Open in browser
              </Link>
              <Link className="marketing-button marketing-button-ghost" href="/contact">
                Ask about desktop access
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
            <p className="platform-module-kicker">Availability now</p>
            <h2>Public Windows binaries are paused until signed distribution is ready.</h2>
            <ul className="platform-detail-list">
              <li>Desktop install remains live through the browser install flow in Edge or Chrome.</li>
              <li>Public Windows executable downloads have been removed to avoid blocked or dangerous download warnings.</li>
              <li>Code signing and trusted Windows packaging are the remaining desktop release tasks.</li>
              <li>iPhone and Android currently use the web install flow while store packages are finalized.</li>
              <li>Browser access stays live on every platform if you do not want to install yet.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Install surfaces</p>
              <h2>Honest desktop, mobile, and browser paths.</h2>
            </div>
            <p>
              The install layer now shows only what is safe and truly live: desktop browser install
              paths, mobile web install paths, and the browser shell. Public Windows binaries are
              no longer being served until the signed release path is ready.
            </p>
          </div>

          <div className="install-destination-grid">
            {INSTALL_DESTINATIONS.map((destination) => (
              <article className="install-destination-card" key={destination.id}>
                <div className="install-destination-head">
                  <p className="platform-module-kicker">{destination.family}</p>
                  <span className={`install-status install-status-${destination.availability}`}>
                    {destination.statusLabel}
                  </span>
                  <h3>{destination.label}</h3>
                </div>
                <p>{destination.summary}</p>
                <p className="install-destination-detail">{destination.detail}</p>
                <Link
                  className="marketing-button marketing-button-secondary install-destination-cta"
                  href={destination.href}
                >
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
              <h2>Platform-specific setup instructions.</h2>
            </div>
            <p>
              These are the current live paths for the shared platform shell. Desktop access stays
              on the browser install flow for now, while signed native Windows packaging moves
              through release preparation.
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
              The routes stay shared underneath every access layer. Installing the platform from a
              browser, adding it to a phone home screen, or staying on the web still lands you in
              the same connected Odirico platform.
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
