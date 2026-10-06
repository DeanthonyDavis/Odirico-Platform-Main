import type { MetadataRoute } from "next";
import { indexingEnabled, siteUrl } from "@/lib/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexingEnabled
        ? { allow: "/", disallow: ["/api/", "/privacy", "/terms"] }
        : { disallow: "/" }),
    },
    ...(indexingEnabled ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
