"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";

type MarketingShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/system", label: "System" },
  { href: "/apps", label: "Apps" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export function MarketingShell({ children }: MarketingShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="marketing-site">
      <a className="marketing-skip-link" href="#marketing-main">
        Skip to content
      </a>

      <header className="marketing-header">
        <div className="marketing-shell marketing-nav-shell">
          <Link
            aria-label="Odirico Platform home"
            className="marketing-brand"
            href="/"
            onClick={() => setIsOpen(false)}
          >
            <Image
              alt=""
              className="marketing-brand-mark"
              height={52}
              src="/branding/odirico-platform.jpg"
              width={52}
            />
            <div className="marketing-brand-copy">
              <strong>Odirico</strong>
              <span>Platform</span>
            </div>
          </Link>

          <button
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            className="marketing-nav-toggle"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={isOpen ? "marketing-nav-group is-open" : "marketing-nav-group"}>
            <nav aria-label="Primary" className="marketing-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={isActive(item.href) ? "marketing-nav-link is-active" : "marketing-nav-link"}
                  href={item.href as never}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="marketing-nav-actions">
              <Link
                className="marketing-button marketing-button-secondary"
                href="/install"
                onClick={() => setIsOpen(false)}
              >
                Install
              </Link>
              <Link
                className="marketing-button marketing-button-primary"
                href="/signup"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="marketing-main">{children}</main>

      <footer className="marketing-footer">
        <div className="marketing-shell marketing-footer-grid">
          <div className="marketing-footer-brand">
            <div className="marketing-footer-brand-row">
              <Image
                alt=""
                className="marketing-footer-mark"
                height={48}
                src="/branding/odirico-platform.jpg"
                width={48}
              />
              <div>
                <strong>Odirico Platform</strong>
                <p>One connected system for Ember, Sol, and Surge.</p>
              </div>
            </div>
            <p>
              Odirico is the parent company. The user-facing product is the platform ecosystem that
              connects planning, money, and momentum without splitting your life into disconnected
              tools.
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/system">System</Link>
              </li>
              <li>
                <Link href="/apps">Apps</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/install">Install</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Apps</h3>
            <ul className="marketing-footer-list">
              {ODIRICO_ECOSYSTEM_APPS.map((app) => (
                <li key={app.key}>
                  <Link href={`/apps#${app.key}`}>{app.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Access</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/signup">Create account</Link>
              </li>
              <li>
                <Link href="/login">Sign in</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/install">Platform install</Link>
              </li>
            </ul>
            <p className="marketing-footer-note">&copy; {currentYear} Odirico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
