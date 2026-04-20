"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";
import { AccountMenu } from "@/components/layout/account-menu";
import { RouteSearchLauncher } from "@/components/layout/route-search-launcher";
import {
  MARKETING_PRIMARY_LINKS,
  PUBLIC_SEARCH_DESTINATIONS,
} from "@/components/marketing/ecosystem-data";
import type { UserContext } from "@/lib/auth/roles";

type MarketingShellProps = {
  children: ReactNode;
  userContext: UserContext | null;
};

export function MarketingShell({ children, userContext }: MarketingShellProps) {
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
              {MARKETING_PRIMARY_LINKS.map((item) => (
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

            <div className="marketing-nav-actions marketing-nav-actions-utility">
              <RouteSearchLauncher
                className="marketing-search-trigger"
                items={PUBLIC_SEARCH_DESTINATIONS}
                label="Search"
                title="Search Odirico routes"
              />

              {userContext ? (
                <>
                  <Link
                    className="marketing-button marketing-button-secondary"
                    href="/overview"
                    onClick={() => setIsOpen(false)}
                  >
                    Open platform
                  </Link>
                  <AccountMenu
                    className="account-menu-trigger-marketing"
                    displayName={userContext.displayName}
                    email={userContext.user.email}
                  />
                </>
              ) : (
                <>
                  <Link className="marketing-utility-link" href="/login" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    className="marketing-button marketing-button-primary"
                    href="/get-started"
                    onClick={() => setIsOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
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
            <h3>Product</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/apps">Products</Link>
              </li>
              <li>
                <Link href="/product-tour">Product tour</Link>
              </li>
              <li>
                <Link href="/product-demo">Product demo</Link>
              </li>
              <li>
                <Link href="/get-started">Get started</Link>
              </li>
              <li>
                <Link href="/install">Install</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Trust</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms &amp; conditions</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie policy</Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link href="/delete-account">Delete account</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Company</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/customers">Customers</Link>
              </li>
              <li>
                <Link href="/partners">Partners</Link>
              </li>
              <li>
                <Link href="/resources">Resources</Link>
              </li>
              <li>
                <Link href="/company">Company</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3>Access</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/get-started">Get started</Link>
              </li>
              <li>
                <Link href="/login">Log in</Link>
              </li>
              <li>
                <Link href="/overview">Overview</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
            <p className="marketing-footer-note">&copy; {currentYear} Odirico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
