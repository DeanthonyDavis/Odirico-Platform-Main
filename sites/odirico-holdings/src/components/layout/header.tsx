"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";
import { Wordmark } from "@/components/ui/wordmark";

export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.setAttribute("aria-expanded", "false");
  }
  function open() {
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    trigger.current?.setAttribute("aria-expanded", "true");
  }
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Odirico — home">
        <Wordmark />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(({ href, label }) => (
          <Link
            href={href}
            key={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
            {href === "/contact" && (
              <ArrowUpRight size={15} aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>
      <button
        ref={trigger}
        type="button"
        className="menu-trigger"
        onClick={open}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-controls="mobile-navigation"
        aria-expanded="false"
      >
        <span>Menu</span>
        <Menu size={23} />
      </button>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Main navigation"
        onClose={close}
        onCancel={close}
      >
        <div className="mobile-menu-top">
          <Wordmark />
          <button
            type="button"
            onClick={close}
            className="close-menu"
            aria-label="Close navigation"
          >
            <X size={28} />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {navigation.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              aria-current={pathname === href ? "page" : undefined}
            >
              <span className="menu-number">0{index + 1}</span>
              {label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <p className="eyebrow">A long-term perspective.</p>
      </dialog>
      <noscript>
        <style>{`.site-header{height:auto;min-height:94px;flex-wrap:wrap;padding-block:15px;gap:12px}.menu-trigger,.desktop-nav{display:none}.noscript-nav{flex-basis:100%;font-size:14px}noscript{display:contents}`}</style>
        <nav className="noscript-nav" aria-label="Navigation">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
