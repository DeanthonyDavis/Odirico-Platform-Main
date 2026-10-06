import { permanentRedirect, notFound } from "next/navigation";
import { getPublishedCompanies } from "@/config/portfolio";
export default async function LegacyCompany({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getPublishedCompanies().some((c) => c.slug === slug)) notFound();
  permanentRedirect(`/portfolio/${slug}`);
}
