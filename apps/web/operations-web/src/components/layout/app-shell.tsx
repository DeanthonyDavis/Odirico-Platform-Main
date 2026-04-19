"use client";

import Image from "next/image";
import Link from "next/link";

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
};

const operationsNavItems: Array<{ href: string; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/settings", label: "Settings" },
];

const ecosystemNavItems: Array<{ href: string; label: string }> = [
  { href: "/ember", label: "Ember" },
  { href: "/sol", label: "Sol" },
  { href: "/surge", label: "Surge" },
];

const ecosystemUtilityLinks: Array<{ href: string; label: string }> = [
  { href: "/overview", label: "Overview" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  currentPath,
  title,
  subtitle,
  children,
  userContext,
  eyebrow,
  variant = "operations",
}: AppShellProps) {
  const settings = useSettings(userContext.user.email);
  const canManageOrg = canManageOrganization(userContext.roles);
  const roleSummary = userContext.roles.map((role) => settings.roleLabel(role)).join(" | ");
  const defaultEyebrow = variant === "ecosystem" ? "Odirico / Platform" : "Odirico / Operations";

  if (variant === "ecosystem") {
    return (
      <div className="app-shell app-shell-ecosystem">
        <aside className="sidebar sidebar-ecosystem sidebar-ecosystem-slim">
          <Link className="brand-block brand-block-ecosystem" href="/overview">
            <Image alt="" className="brand-mark-image" height={52} src="/branding/odirico-platform.jpg" width={52} />

            <div>
              <div className="brand-name">Odirico</div>
              <div className="brand-subtitle">Connected platform</div>
            </div>
          </Link>

          <div className="sidebar-module-panel sidebar-module-panel-ecosystem">
            <p className="sidebar-label">Platform</p>
            <Link
              className={currentPath === "/overview" ? "sidebar-home-link active" : "sidebar-home-link"}
              href="/overview"
            >
              <span className="sidebar-home-icon">O</span>
              <span>Overview</span>
            </Link>
          </div>

          <div className="sidebar-module-panel sidebar-module-panel-ecosystem">
            <p className="sidebar-label">Apps</p>
            <div className="sidebar-module-list sidebar-module-list-slim">
              {ODIRICO_ECOSYSTEM_APPS.map((item) => {
                const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.key}
                    className={active ? "sidebar-module-link sidebar-module-link-slim active" : "sidebar-module-link sidebar-module-link-slim"}
                    href={item.href as never}
                  >
                    <span className="sidebar-module-copy">
                      <Image alt="" className="sidebar-module-logo" height={30} src={item.logoPath} width={30} />
                      <span>{item.label}</span>
                    </span>
                    <span className="module-pill">{item.statusLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="sidebar-footer sidebar-footer-ecosystem">
            <p>{roleSummary}</p>
            <p>{userContext.displayName}</p>
            <p>Move across planning, money, and applications without changing products or projects.</p>
          </div>
        </aside>

        <main className="page-frame page-frame-ecosystem">
          <header className="page-header page-header-ecosystem">
            <div className="page-header-main">
              <div>
                <p className="eyebrow">{eyebrow ?? defaultEyebrow}</p>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </div>
            </div>

            <div className="page-utility-bar">
              <RouteSearchLauncher
                className="page-search-trigger"
                items={PLATFORM_SEARCH_DESTINATIONS}
                label="Search routes"
                title="Search the Odirico platform"
              />

              <nav aria-label="Utility" className="page-utility-links">
                {ecosystemUtilityLinks.map((item) => {
                  const active =
                    item.href === "/overview"
                      ? currentPath === item.href
                      : currentPath === item.href || currentPath.startsWith(`${item.href}/`);

                  return (
                    <Link
                      className={active ? "page-utility-link active" : "page-utility-link"}
                      href={item.href as never}
                      key={item.href}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <AccountMenu displayName={userContext.displayName} email={userContext.user.email} />
            </div>
          </header>

          <section className="page-content">{children}</section>
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
