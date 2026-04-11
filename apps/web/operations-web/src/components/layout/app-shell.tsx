"use client";

import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";
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
  { href: "/overview", label: "Overview" },
  { href: "/ember", label: "Ember" },
  { href: "/sol", label: "Sol" },
  { href: "/surge", label: "Surge" },
  { href: "/billing", label: "Billing" },
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
  const navItems = variant === "ecosystem" ? ecosystemNavItems : operationsNavItems;
  const defaultEyebrow = variant === "ecosystem" ? "Odirico / Platform" : "Odirico / Operations";

  return (
    <div className={variant === "ecosystem" ? "app-shell app-shell-ecosystem" : "app-shell app-shell-operations"}>
      <aside className={variant === "ecosystem" ? "sidebar sidebar-ecosystem" : "sidebar sidebar-operations"}>
        <div className="brand-block">
          {variant === "ecosystem" ? (
            <Image alt="" className="brand-mark-image" height={58} src="/branding/odirico-platform.jpg" width={58} />
          ) : (
            <div className="brand-mark brand-mark-operations">PQ</div>
          )}

          <div>
            <div className="brand-name">{variant === "ecosystem" ? "Odirico Platform" : "PoleQA"}</div>
            <div className="brand-subtitle">
              {variant === "ecosystem"
                ? "Ember, Sol, and Surge under one connected system."
                : "Inspection and QA/QC operations inside the Odirico company stack."}
            </div>
          </div>
        </div>

        <div className="sidebar-module-panel">
          <p className="sidebar-label">{variant === "ecosystem" ? "Modules" : "Workspace"}</p>
          <div className="sidebar-module-list">
            {variant === "ecosystem" ? (
              ODIRICO_ECOSYSTEM_APPS.map((item) => {
                const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.key}
                    className={active ? "sidebar-module-link active" : "sidebar-module-link"}
                    href={item.href as never}
                  >
                    <span className="sidebar-module-copy">
                      <Image alt="" className="sidebar-module-logo" height={28} src={item.logoPath} width={28} />
                      <span>{item.label}</span>
                    </span>
                    <span className="module-pill">{item.statusLabel}</span>
                  </Link>
                );
              })
            ) : (
              <Link
                className={currentPath.startsWith("/dashboard") || currentPath.startsWith("/tickets") ? "sidebar-module-link active" : "sidebar-module-link"}
                href="/dashboard"
              >
                <span>PoleQA</span>
                <span className="module-pill live">Live</span>
              </Link>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
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
            {variant === "ecosystem"
              ? "Your shared account moves across Ember, Sol, Surge, and billing without changing projects."
              : canManageOrg
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
