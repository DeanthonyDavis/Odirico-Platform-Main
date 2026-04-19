"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { RouteSearchDestination } from "@/components/marketing/ecosystem-data";

type RouteSearchLauncherProps = {
  items: readonly RouteSearchDestination[];
  className?: string;
  title?: string;
  label?: string;
  showShortcut?: boolean;
};

export function RouteSearchLauncher({
  items,
  className,
  title = "Search routes",
  label = "Search",
  showShortcut = true,
}: RouteSearchLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) =>
      [item.label, item.description, item.tag, item.href].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [items, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  const triggerClassName = className ? `route-search-trigger ${className}` : "route-search-trigger";

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={triggerClassName}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span aria-hidden="true" className="route-search-icon">
          <span />
        </span>
        <span>{label}</span>
        {showShortcut ? <span className="route-search-shortcut">Ctrl K</span> : null}
      </button>

      {isOpen ? (
        <div className="route-search-overlay" onClick={() => setIsOpen(false)} role="presentation">
          <div
            aria-labelledby="route-search-title"
            aria-modal="true"
            className="route-search-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="route-search-head">
              <div>
                <p className="route-search-kicker">Quick search</p>
                <h2 id="route-search-title">{title}</h2>
              </div>
              <button
                aria-label="Close search"
                className="route-search-close"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <label className="route-search-input-wrap">
              <span className="sr-only">Search destinations</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, apps, billing, settings..."
                ref={inputRef}
                type="search"
                value={query}
              />
            </label>

            <div className="route-search-results">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Link
                    className="route-search-result"
                    href={item.href}
                    key={`${item.tag}-${item.href}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="route-search-result-copy">
                      <strong>{item.label}</strong>
                      <p>{item.description}</p>
                    </div>
                    <div className="route-search-result-meta">
                      <span className="route-search-tag">{item.tag}</span>
                      {item.requiresAuth ? <span className="route-search-lock">Sign in</span> : null}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="route-search-empty">
                  <strong>No matches</strong>
                  <p>Try another route, app, or billing keyword.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
