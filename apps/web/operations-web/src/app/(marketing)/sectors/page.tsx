import { MarketingCardGrid, MarketingCta, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function SectorsPage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "/contact", label: "Talk With Odirico", variant: "primary" },
          { href: "/capability", label: "Capability Statement", variant: "secondary" },
        ]}
        copy="The best near-term fit stays close to utility infrastructure, telecom, contractors, and public-sector programs where field discipline and reporting quality matter."
        eyebrow="Markets"
        title="Where Odirico can earn credibility fastest."
      />

      <MarketingSection
        copy="Pick the market, then tailor the message. The common thread is operational clarity in environments where confusion gets expensive."
        eyebrow="Target sectors"
        title="Markets where consulting and software strengthen each other."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Power and utilities",
              copy: "Electric utilities, cooperatives, and infrastructure operators with real inspection, reporting, and coordination demands.",
            },
            {
              title: "Telecom and broadband",
              copy: "Programs that need structured field documentation, issue tracking, and cleaner delivery communication.",
            },
            {
              title: "Contractors and EPC teams",
              copy: "Delivery teams that benefit from tighter process visibility between field activity and project controls.",
            },
            {
              title: "Public infrastructure and agencies",
              copy: "Agency and grant-funded work that needs procurement-ready communication and stronger operational clarity.",
            },
          ]}
          columns={2}
        />
      </MarketingSection>

      <MarketingCta
        copy="Use the market path to shape proposals, outreach language, capability statements, and the first product demos."
        primary={{ href: "/contact", label: "Start a Conversation", variant: "dark" }}
        secondary={{ href: "/expertise", label: "Review Consulting", variant: "secondary" }}
        title="Pick the market, then tailor the message."
      />
    </>
  );
}
