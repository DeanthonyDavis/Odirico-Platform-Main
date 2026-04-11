"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type MarketingShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/expertise", label: "Consulting" },
  { href: "/products", label: "Products" },
  { href: "/sectors", label: "Markets" },
  { href: "/capability", label: "Capability" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
          <Link className="marketing-brand" href="/" onClick={() => setIsOpen(false)}>
            <img alt="Odirico" src="/assets/logo-primary.svg" />
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
              <Link className="marketing-button marketing-button-secondary" href="/login">
                Platform Login
              </Link>
              <Link className="marketing-button marketing-button-primary" href="/contact">
                Work With Odirico
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="marketing-main">{children}</main>

      <footer className="marketing-footer">
        <div className="marketing-shell marketing-footer-grid">
          <div className="marketing-footer-brand">
            <img alt="Odirico" src="/assets/logo-white.svg" />
            <p>
              Odirico combines infrastructure consulting with a route-based platform ecosystem for
              operations, readiness, planning, and application command workflows.
            </p>
          </div>

          <div>
            <h3>Navigate</h3>
            <ul className="marketing-footer-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href as never}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Platform</h3>
            <ul className="marketing-footer-list">
              <li>
                <Link href="/dashboard">PoleQA</Link>
              </li>
              <li>
                <Link href="/ember">Ember</Link>
              </li>
              <li>
                <Link href="/sol">Sol</Link>
              </li>
              <li>
                <Link href="/surge">Surge</Link>
              </li>
            </ul>
            <p className="marketing-footer-note">© {currentYear} Odirico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
