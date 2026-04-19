"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "odirico-cookie-consent";

type ConsentChoice = "accepted" | "essential";

export function CookieConsentBanner() {
  const [isReady, setIsReady] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setChoice(window.localStorage.getItem(COOKIE_CONSENT_KEY));
    } catch {
      setChoice(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  function saveChoice(value: ConsentChoice) {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      // If storage is unavailable, close the banner for the current session.
    }

    setChoice(value);
  }

  if (!isReady || choice) {
    return null;
  }

  return (
    <aside aria-label="Cookie consent" className="cookie-banner">
      <p className="cookie-banner-kicker">Cookie notice</p>
      <h2>We use essential cookies and local storage to keep Odirico secure and signed in.</h2>
      <p className="cookie-banner-copy">
        This includes sign-in continuity, session security, and saving your cookie preference on
        this device. If we add non-essential analytics or payment-related storage later, we will
        update this notice and the cookie policy first.
      </p>
      <div className="cookie-banner-actions">
        <button className="primary-button" onClick={() => saveChoice("accepted")} type="button">
          Accept
        </button>
        <button className="ghost-button" onClick={() => saveChoice("essential")} type="button">
          Essential only
        </button>
        <Link className="inline-link" href="/cookies">
          Read cookies
        </Link>
      </div>
    </aside>
  );
}
