"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";
import { AccountMenu } from "@/components/layout/account-menu";
import { RouteSearchLauncher } from "@/components/layout/route-search-launcher";
import { PLATFORM_SEARCH_DESTINATIONS } from "@/components/marketing/ecosystem-data";
import { canManageOrganization, type UserContext } from "@/lib/auth/roles";
import { useSettings } from "@/lib/settings/client";

type ShellVariant = "operations" | "ecosystem";

type AppShellProps = {
  currentPath: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  userContext: UserContext;
  eyebrow?: string;
  variant?: ShellVariant;
  localNav?: Array<{ href: string; label: string }>;
};

const operationsNavItems: Array<{ href: string; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/settings", label: "Settings" },
];

const ecosystemRailLinks: Array<{ href: string; label: string; shortLabel: string }> = [
  { href: "/overview", label: "Overview", shortLabel: "OV" },
  ...ODIRICO_ECOSYSTEM_APPS.map((app) => ({
    href: app.href,
    label: app.label,
    shortLabel: app.label.slice(0, 2).toUpperCase(),
  })),
  { href: "/settings", label: "Settings", shortLabel: "ST" },
];

export function AppShell({
  currentPath,
  title,
  subtitle,
  children,
  userContext,
  eyebrow,
  variant = "operations",
  localNav = [],
}: AppShellProps) {
  const settings = useSettings(userContext.user.email);
  const canManageOrg = canManageOrganization(userContext.roles);
  const roleSummary = userContext.roles.map((role) => settings.roleLabel(role)).join(" | ");
  const defaultEyebrow = variant === "ecosystem" ? "Odirico / Platform" : "Odirico / Operations";
  const [activeHash, setActiveHash] = useState("");
  const activeEcosystemApp = useMemo(
    () =>
      variant === "ecosystem"
        ? ODIRICO_ECOSYSTEM_APPS.find(
            (item) => currentPath === item.href || currentPath.startsWith(`${item.href}/`),
          ) ?? null
        : null,
    [currentPath, variant],
  );

  useEffect(() => {
    if (variant !== "ecosystem") {
      return;
    }

    const syncHash = () => {
      setActiveHash(window.location.hash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, [variant]);

  if (variant === "ecosystem") {
    return (
      <div className="app-shell app-shell-ecosystem app-shell-ecosystem-refined">
        <aside className="ecosystem-rail">
          <Link className="ecosystem-rail-brand" href="/overview">
            <Image alt="" className="brand-mark-image" height={48} src="/branding/odirico-platform.jpg" width={48} />
            <span>Odirico</span>
          </Link>

          <nav aria-label="Platform spaces" className="ecosystem-rail-nav">
            {ecosystemRailLinks.map((item) => {
              const active =
                currentPath === item.href || currentPath.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  className={active ? "ecosystem-rail-link active" : "ecosystem-rail-link"}
                  href={item.href as never}
                  title={item.label}
                >
                  <span className="ecosystem-rail-mark">{item.shortLabel}</span>
                  <span className="ecosystem-rail-copy">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ecosystem-rail-footer">
            <p>{activeEcosystemApp?.label ?? title}</p>
            <span>{roleSummary}</span>
          </div>
        </aside>

        <main className="page-frame page-frame-ecosystem page-frame-ecosystem-refined">
          <header className="ecosystem-header">
            <div className="ecosystem-header-main">
              <div>
                <p className="eyebrow">{eyebrow ?? defaultEyebrow}</p>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </div>
              {localNav.length > 0 ? (
                <nav aria-label={`${title} navigation`} className="workspace-local-nav">
                  {localNav.map((item) => {
                    const baseHref = item.href.split("#")[0] ?? item.href;
                    const itemHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : "";
                    const active =
                      itemHash
                        ? currentPath === baseHref &&
                          (activeHash
                            ? activeHash === itemHash
                            : localNav[0]?.href === item.href)
                        : currentPath === baseHref || currentPath.startsWith(baseHref);

                    return (
                      <Link
                        key={item.href}
                        className={active ? "workspace-local-link active" : "workspace-local-link"}
                        href={item.href as never}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              ) : null}
            </div>

            <div className="ecosystem-header-actions">
              <RouteSearchLauncher
                className="page-search-trigger"
                items={PLATFORM_SEARCH_DESTINATIONS}
                label="Search"
                showShortcut={false}
                title="Search the Odirico ecosystem"
              />
              <AccountMenu displayName={userContext.displayName} email={userContext.user.email} />
            </div>
          </header>

          <section className="page-content page-content-ecosystem">{children}</section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell app-shell-operations">
      <aside className="sidebar sidebar-operations">
        <div className="brand-block">
          <div className="brand-mark brand-mark-operations">PQ</div>

          <div>
            <div className="brand-name">PoleQA</div>
            <div className="brand-subtitle">Inspection and QA/QC operations inside the Odirico company stack.</div>
          </div>
        </div>

        <div className="sidebar-module-panel">
          <p className="sidebar-label">Workspace</p>
          <div className="sidebar-module-list">
            <Link
              className={currentPath.startsWith("/dashboard") || currentPath.startsWith("/tickets") ? "sidebar-module-link active" : "sidebar-module-link"}
              href="/dashboard"
            >
              <span>PoleQA</span>
              <span className="module-pill live">Live</span>
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav">
          {operationsNavItems.map((item) => {
            const active =
              item.href === "/overview"
                ? currentPath === item.href
                : currentPath === item.href || currentPath.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href as never}
                className={active ? "sidebar-link active" : "sidebar-link"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>{roleSummary}</p>
          <p>{userContext.displayName}</p>
          <p>
            {canManageOrg
              ? "Use Settings to manage teams, rename role labels, and tune the operations workspace."
              : "Use Settings to tune the operations workspace and your personal layout preferences."}
          </p>
        </div>
      </aside>

      <main className="page-frame">
        <header className="page-header">
          <div>
            <p className="eyebrow">{eyebrow ?? defaultEyebrow}</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
