import { MarketingCardGrid, MarketingCta, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "/capability", label: "Capability Statement", variant: "primary" },
          { href: "/contact", label: "Contact Odirico", variant: "secondary" },
        ]}
        copy="Odirico is structured to support both infrastructure services and software without making either side of the story feel bolted on."
        eyebrow="About Odirico"
        title="A firm brand built to support both infrastructure services and software."
      />

      <MarketingSection
        copy="The immediate message should be simple: Odirico Consulting handles the services. Odirico OS handles the software. The system gets stronger because both sides inform each other."
        eyebrow="What the firm should communicate immediately"
        title="One firm, two divisions, one ecosystem."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Odirico Consulting",
              copy: "Project services, surveying, and engineering-adjacent execution support for infrastructure work.",
            },
            {
              title: "Odirico OS",
              copy: "A route-based product ecosystem for operations, readiness, planning, and application command workflows.",
            },
          ]}
          columns={2}
        />
      </MarketingSection>

      <MarketingSection
        copy="These are the principles that keep the brand coherent as the product ecosystem grows."
        eyebrow="Working principles"
        muted
        title="How Odirico should behave."
      >
        <MarketingCardGrid
          cards={[
            { title: "Clarity first", copy: "Explain the consulting work and the product ecosystem in language buyers can understand quickly." },
            { title: "Operational credibility", copy: "Stay grounded in real infrastructure workflows instead of abstract software language." },
            { title: "One ecosystem", copy: "Make the apps feel connected through one route shell, one identity layer, and one deploy." },
          ]}
          columns={3}
        />
      </MarketingSection>

      <MarketingCta
        copy="Use the firm story to support proposals, demos, outreach, and platform positioning without needing separate narratives."
        primary={{ href: "/contact", label: "Start the Conversation", variant: "dark" }}
        secondary={{ href: "/products", label: "See the Platform", variant: "secondary" }}
        title="Use the firm story to support proposals, demos, and outreach."
      />
    </>
  );
}
