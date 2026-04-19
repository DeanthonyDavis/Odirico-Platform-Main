import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Odirico Platform",
    template: "%s | Odirico Platform",
  },
  description:
    "Plan your time, manage your money, and track your future across Ember, Sol, and Surge inside one connected Odirico platform.",
};

export const viewport: Viewport = {
  themeColor: "#ff5a43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
