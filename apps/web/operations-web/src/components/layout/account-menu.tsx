"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { createClientSupabaseClient } from "@/lib/supabase/client";

type AccountMenuProps = {
  displayName: string;
  email?: string | null;
  className?: string;
};

function buildInitials(displayName: string, email?: string | null) {
  const fromName = displayName
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (fromName) {
    return fromName;
  }

  return (email ?? "OD").slice(0, 2).toUpperCase();
}

export function AccountMenu({ displayName, email, className }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initials = useMemo(() => buildInitials(displayName, email), [displayName, email]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await Promise.allSettled([
        fetch("/api/auth/demo", { method: "DELETE" }),
        createClientSupabaseClient().auth.signOut(),
      ]);
    } finally {
      setIsOpen(false);
      router.push("/");
      router.refresh();
      window.location.assign("/");
    }
  }

  const triggerClassName = className ? `account-menu-trigger ${className}` : "account-menu-trigger";

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={triggerClassName}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="account-menu-avatar">{initials}</span>
        <span className="account-menu-label">{displayName}</span>
      </button>

      {isOpen ? (
        <div className="account-menu-panel" role="menu">
          <div className="account-menu-summary">
            <strong>{displayName}</strong>
            <p>{email ?? "Signed in"}</p>
          </div>

          <div className="account-menu-links">
            <Link href="/overview" onClick={() => setIsOpen(false)}>
              Overview
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              Settings
            </Link>
            <Link href="/settings#appearance" onClick={() => setIsOpen(false)}>
              Appearance
            </Link>
            <Link href="/billing" onClick={() => setIsOpen(false)}>
              Subscription
            </Link>
          </div>

          <button
            className="account-menu-signout"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
