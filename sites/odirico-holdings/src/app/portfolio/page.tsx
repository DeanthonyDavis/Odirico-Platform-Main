import { PageIntro, Portfolio } from "@/components/sections/shared";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Portfolio",
  "Building the foundations for a portfolio of independent operating businesses. Odirico’s portfolio is developing.",
  "/portfolio",
);
export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        label="Portfolio"
        title={
          <>
            Built independently.
            <br />
            Owned with purpose.
          </>
        }
      >
        <p>
          Our aim is to develop a group of businesses with their own identities,
          supported by a thoughtful approach to ownership.
        </p>
      </PageIntro>
      <section className="wrap portfolio-page">
        <Portfolio full />
      </section>
    </>
  );
}
