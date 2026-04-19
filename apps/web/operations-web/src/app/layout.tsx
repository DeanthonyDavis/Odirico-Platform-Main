import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";

import { CookieConsentBanner } from "@/components/marketing/cookie-consent-banner";
import { PwaRegistration } from "@/components/platform/pwa-registration";

export const metadata: Metadata = {
  title: {
    default: "Odirico Platform",
    template: "%s | Odirico Platform",
  },
  description:
    "Plan your time, manage your money, and track your future across Ember, Sol, and Surge inside one connected Odirico platform.",
};

export const viewport: Viewport = {
  themeColor: "#24a47f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PwaRegistration />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
