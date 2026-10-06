import type { MetadataRoute } from "next";
import { getPublishedCompanies } from "@/config/portfolio";
import { siteUrl } from "@/lib/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/company",
    "/approach",
    "/portfolio",
    "/acquisitions",
    "/contact",
    ...getPublishedCompanies().map((c) => `/portfolio/${c.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.7 : 1,
  }));
}
