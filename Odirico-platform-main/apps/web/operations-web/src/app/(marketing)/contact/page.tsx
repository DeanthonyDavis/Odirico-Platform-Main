import { MarketingCardGrid, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function ContactPage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "mailto:contact@odirico.com", label: "Email Odirico", variant: "primary" },
          { href: "/capability", label: "Request Capability Direction", variant: "secondary" },
        ]}
        copy="Start with the right path: consulting, product, or capability statement. The point is to move the conversation into the right lane quickly."
        eyebrow="Contact"
        title="Start with the right path: consulting, product, or capability statement."
      />

      <MarketingSection
        copy="If you want this page to become a real lead intake workflow later, we can wire the form to email, CRM, or automation. For now, the clearest live path is direct contact."
        eyebrow="Start the conversation"
        title="Choose the path that matches the need."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Consulting inquiry",
              copy: "Project services, surveying, infrastructure support, or execution coordination conversations.",
              bullets: ["Use this for field-heavy project scopes.", "Best for active delivery needs.", "Leads into consulting fit discussion."],
              href: "mailto:contact@odirico.com?subject=Odirico%20Consulting%20Inquiry",
              hrefLabel: "Email about consulting",
            },
            {
              title: "Product inquiry",
              copy: "PoleQA, Ember, Sol, Surge, or the route-based platform shell.",
              bullets: ["Use this for demos and product questions.", "Best for platform fit conversations.", "Leads into ecosystem discussion."],
              href: "mailto:contact@odirico.com?subject=Odirico%20Product%20Inquiry",
              hrefLabel: "Email about products",
            },
            {
              title: "Capability request",
              copy: "Procurement-ready overviews, summaries, and buyer-facing materials.",
              bullets: ["Use this for partnership and procurement contexts.", "Best for qualification conversations.", "Leads into capability package tailoring."],
              href: "mailto:contact@odirico.com?subject=Odirico%20Capability%20Statement",
              hrefLabel: "Request capability statement",
            },
          ]}
        />
      </MarketingSection>
    </>
  );
}
