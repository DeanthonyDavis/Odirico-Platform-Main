import { notFound } from "next/navigation";
import { getPublishedCompanies } from "@/config/portfolio";
import { PageIntro, CompanyOverview } from "@/components/sections/shared";
import { TextLink } from "@/components/ui/link-button";
import { pageMetadata } from "@/lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getPublishedCompanies().map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getPublishedCompanies().find((c) => c.slug === slug);
  if (!item) notFound();
  return pageMetadata(item.name, item.description, `/portfolio/${item.slug}`);
}
export default async function CompanyDetail({ params }: Props) {
  const { slug } = await params;
  const item = getPublishedCompanies().find((c) => c.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageIntro label={item.industry} title={item.name}>
        <p>{item.description}</p>
      </PageIntro>
      <section className="wrap section-space company-detail">
        <CompanyOverview item={item} detail />
        <TextLink href="/portfolio">Back to portfolio</TextLink>
      </section>
    </>
  );
}
