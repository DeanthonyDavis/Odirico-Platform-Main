import { MarketingCardGrid, MarketingCta, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function CapabilityPage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "mailto:contact@odirico.com?subject=Odirico%20Capability%20Statement", label: "Request the Statement", variant: "primary" },
          { href: "/expertise", label: "Review Consulting", variant: "secondary" },
        ]}
        copy="A concise firm overview for buyers, partners, and procurement conversations."
        eyebrow="Capability statement"
        title="A concise firm overview for buyers, partners, and procurement conversations."
      />

      <MarketingSection
        copy="The capability story should be brief, credible, and directly useful in outreach and qualification conversations."
        eyebrow="Firm snapshot"
        title="What Odirico should say clearly."
      >
        <MarketingCardGrid
          cards={[
            { title: "Firm", copy: "Odirico" },
            { title: "Consulting arm", copy: "Project services, surveying, and engineering support." },
            { title: "Software arm", copy: "Odirico OS for operations, planning, readiness, and application workflows." },
            { title: "Location", copy: "Houston, Texas" },
          ]}
          columns={4}
        />
      </MarketingSection>

      <MarketingSection
        copy="Core capabilities should stay close to execution, field clarity, and infrastructure communication."
        eyebrow="Core capabilities"
        muted
        title="Capabilities that support real field-heavy work."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Project services",
              copy: "Execution support, coordination, reporting, and operational follow-through for active infrastructure scopes.",
              bullets: [
                "Project coordination and stakeholder handoff support.",
                "Status visibility and execution discipline.",
                "Client-ready reporting structure.",
              ],
            },
            {
              title: "Surveying and field documentation",
              copy: "Field capture and reporting support where the quality of records affects project decisions and closeout.",
              bullets: [
                "Structured field observations and issue documentation.",
                "Inspection-adjacent reporting workflows.",
                "Clear linkage between field activity and action.",
              ],
            },
            {
              title: "Engineering support",
              copy: "Technical infrastructure context for teams working across field, project, and documentation layers.",
              bullets: [
                "Engineering-adjacent delivery support.",
                "Utility and field workflow understanding.",
                "Clear communication for owners, contractors, and operators.",
              ],
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection
        copy="The software platform should reinforce the consulting story, not compete with it."
        eyebrow="Products and platform direction"
        title="Where Odirico OS fits into the capability story."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "PoleQA",
              copy: "Inspection and QA/QC ticketing workflows with field issue capture and documentation-heavy support.",
            },
            {
              title: "Ecosystem shell",
              copy: "A unified route-based platform that now houses the website, product routes, and live operational workspace in one deploy.",
            },
            {
              title: "Future modules",
              copy: "Ember, Sol, and Surge show how Odirico can extend the shell into readiness, strategy, and command-center workflows.",
            },
          ]}
          columns={3}
        />
      </MarketingSection>

      <MarketingCta
        copy="This page can become the downloadable package and procurement handout once contact details, identifiers, and final buyer language are finalized."
        primary={{ href: "/contact", label: "Request the Capability Version", variant: "dark" }}
        secondary={{ href: "/products", label: "Review Products", variant: "secondary" }}
        title="Turn this into the downloadable package and procurement handout."
      />
    </>
  );
}
