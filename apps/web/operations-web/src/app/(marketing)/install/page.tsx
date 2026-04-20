import Link from "next/link";

import {
  INSTALL_DESTINATIONS,
  INSTALL_SURFACES,
} from "@/components/marketing/ecosystem-data";
import { InstallCta } from "@/components/platform/install-cta";
import { getPublicEnv } from "@odirico/core/env";
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

const GITHUB_RELEASES_URL = "https://github.com/DeanthonyDavis/Odirico-Platform-Main/releases";

export default function InstallPage() {
  const env = getPublicEnv();
  const directDownloads = [
    {
      title: "Windows desktop",
      status: env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL ? "Direct download ready" : "Release center",
      copy: env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL
        ? "Download the signed Windows installer directly."
        : "Open the release center. Publish the signed Windows installer URL here when the trusted download is ready.",
      href: env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL ?? GITHUB_RELEASES_URL,
      cta: env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL ? "Download for Windows" : "Open release center",
    },
    {
      title: "macOS desktop",
      status: env.NEXT_PUBLIC_MAC_INSTALLER_URL ? "Direct download ready" : "Browser install live",
      copy: env.NEXT_PUBLIC_MAC_INSTALLER_URL
        ? "Download the current macOS build directly."
        : "Use the browser install flow today. Add the signed macOS download URL here when the desktop package is published.",
      href: env.NEXT_PUBLIC_MAC_INSTALLER_URL ?? "#desktop-guide",
      cta: env.NEXT_PUBLIC_MAC_INSTALLER_URL ? "Download for macOS" : "View desktop steps",
    },
    {
      title: "Linux desktop",
      status: env.NEXT_PUBLIC_LINUX_INSTALLER_URL ? "Direct download ready" : "Browser install live",
      copy: env.NEXT_PUBLIC_LINUX_INSTALLER_URL
        ? "Download the current Linux desktop package directly."
        : "Use the browser install path today. Add the Linux package URL here when a signed release is available.",
      href: env.NEXT_PUBLIC_LINUX_INSTALLER_URL ?? "#desktop-guide",
      cta: env.NEXT_PUBLIC_LINUX_INSTALLER_URL ? "Download for Linux" : "View desktop steps",
    },
  ] as const;

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
              distribution can be surfaced here the moment the signed release URL is published.
            </p>

            <div className="platform-hero-actions">
              <InstallCta />
              <Link className="marketing-button marketing-button-secondary" href={GITHUB_RELEASES_URL}>
                Desktop release center
              </Link>
              <Link className="marketing-button marketing-button-secondary" href="/login?next=/overview">
                Open in browser
              </Link>
              <Link className="marketing-button marketing-button-ghost" href="/get-started">
                Product paths
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
            <h2>Desktop downloads are now driven by signed release links, not random binaries.</h2>
            <ul className="platform-detail-list">
              <li>Desktop install remains live through the browser install flow in Edge or Chrome.</li>
              <li>The release center gives you one stable place to publish signed desktop installers.</li>
              <li>Unsafe unsigned downloads are not linked publicly anymore.</li>
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
              <p className="platform-kicker">Desktop downloads</p>
              <h2>Use direct installers when they exist, and the release center when they do not.</h2>
            </div>
            <p>
              This keeps the install page honest. The buttons below can point to signed release
              assets, while the browser install path stays available on every platform in the
              meantime.
            </p>
          </div>

          <div className="platform-download-grid">
            {directDownloads.map((download) => (
              <article className="platform-download-card" key={download.title}>
                <div className="platform-download-meta">
                  <p className="platform-module-kicker">Desktop access</p>
                  <span className="install-status install-status-guide">{download.status}</span>
                </div>
                <h3>{download.title}</h3>
                <p>{download.copy}</p>
                <div className="install-card-actions">
                  <Link className="marketing-button marketing-button-secondary" href={download.href}>
                    {download.cta}
                  </Link>
                  <Link className="marketing-button marketing-button-ghost" href="#desktop-guide">
                    Install steps
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
