import Link from "next/link";

import {
  INSTALL_DESTINATIONS,
  INSTALL_SURFACES,
  WINDOWS_PORTABLE_RELEASE,
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
            <h1>Download Odirico for Windows, install on phone, or stay in the browser.</h1>
            <p className="platform-lead">
              Odirico now has a live portable Windows desktop build, active mobile web install
              flows, and the same browser routes underneath all of them. The shared platform shell
              still keeps Ember, Sol, and Surge inside one product.
            </p>

            <div className="platform-hero-actions">
              <InstallCta />
              <a
                className="marketing-button marketing-button-secondary"
                download
                href={WINDOWS_PORTABLE_RELEASE.href}
              >
                Download Windows build
              </a>
              <Link className="marketing-button marketing-button-ghost" href="/login?next=/overview">
                Open in browser
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

            <div className="platform-install-release-row">
              <span>Windows portable live</span>
              <span>v{WINDOWS_PORTABLE_RELEASE.version}</span>
              <span>{WINDOWS_PORTABLE_RELEASE.sizeLabel}</span>
              <a href={WINDOWS_PORTABLE_RELEASE.checksumHref}>SHA-256</a>
            </div>
          </div>

          <aside className="platform-install-highlight">
            <p className="platform-module-kicker">Availability now</p>
            <h2>Windows native download is live. Mobile store packaging is next.</h2>
            <ul className="platform-detail-list">
              <li>Windows can download the portable native desktop build right now.</li>
              <li>MSI installer packaging is the remaining Windows release task.</li>
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
              <h2>Native Windows download plus honest mobile and browser paths.</h2>
            </div>
            <p>
              The install layer now shows what is truly live: a Windows portable build, mobile web
              install paths, and the browser shell. Anything that is not finished yet is labeled as
              the next release step instead of being implied.
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
                {destination.href.startsWith("/downloads/") ? (
                  <a
                    className="marketing-button marketing-button-secondary install-destination-cta"
                    download
                    href={destination.href}
                  >
                    {destination.ctaLabel}
                  </a>
                ) : (
                  <Link
                    className="marketing-button marketing-button-secondary install-destination-cta"
                    href={destination.href}
                  >
                    {destination.ctaLabel}
                  </Link>
                )}
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
              These are the current live paths for the shared platform shell. Native Windows now
              exists as a portable desktop build, while the browser install flow still covers the
              rest of the active surfaces.
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
              The routes stay shared underneath every access layer. Downloading Windows, installing
              the mobile web app, or staying in the browser still lands you in the same connected
              Odirico platform.
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
