import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { company } from "@/config/company";
import { indexingEnabled, siteUrl } from "@/lib/metadata";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Odirico | Built to own. Built to endure.",
    template: "%s | Odirico",
  },
  description: company.description,
  robots: { index: indexingEnabled, follow: indexingEnabled },
  icons: {
    icon: [
      { url: "/icons/odirico-macron.svg", type: "image/svg+xml" },
      { url: "/icons/odirico-macron-32.png", sizes: "32x32" },
    ],
    apple: "/icons/odirico-macron-apple.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    ...(indexingEnabled ? { url: siteUrl } : {}),
  };
  return (
    <html lang="en" className={GeistSans.variable}>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
