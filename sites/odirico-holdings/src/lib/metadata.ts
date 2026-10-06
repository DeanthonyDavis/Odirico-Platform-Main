import type { Metadata } from "next";
import { company } from "@/config/company";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://odirico.com";
export const indexingEnabled =
  process.env.SITE_INDEXING_ENABLED === "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
  siteUrl.startsWith("https://");
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | ${company.name}` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: path,
      type: "website",
      siteName: company.name,
      images: [
        {
          url: "/images/odirico-ownership-social.png",
          width: 1200,
          height: 630,
          alt: "Odirico. Built to own. Built to endure.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${company.name}`,
      description,
      images: ["/images/odirico-ownership-social.png"],
    },
  };
}
