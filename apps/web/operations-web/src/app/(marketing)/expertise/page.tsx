import { MarketingCardGrid, MarketingCta, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function ExpertisePage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "/contact", label: "Get in Touch", variant: "primary" },
          { href: "/capability", label: "Capability Statement", variant: "secondary" },
        ]}
        copy="Project services, surveying, and engineering support for infrastructure programs that need stronger field-to-office execution."
        eyebrow="Odirico Consulting"
        title="Project services, surveying, and engineering support for infrastructure programs."
      />

      <MarketingSection
        copy="The consulting arm fits best where documentation quality, field coordination, and execution visibility affect real project outcomes."
        eyebrow="Core service lines"
        title="Consulting work that matches how infrastructure teams actually operate."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Project services",
              copy: "Execution support, handoff coordination, schedule visibility, and project communication that stays useful under pressure.",
              bullets: [
                "Schedule and status support for active scopes.",
                "Owner, contractor, and field coordination.",
                "Documentation usable in closeout, review, and handoff.",
              ],
            },
            {
              title: "Surveying and field documentation",
              copy: "Field observations and structured reporting tied to real project records and follow-through.",
              bullets: [
                "Field observations and structured reporting.",
                "Inspection documentation and issue capture.",
                "Survey support tied to project decisions.",
              ],
            },
            {
              title: "Engineering support",
              copy: "Technical infrastructure context for design-adjacent and field-adjacent workflows without overclaiming scope.",
              bullets: [
                "Utility and power infrastructure understanding.",
                "Support for design-adjacent workflows.",
                "Clear technical communication for owners and contractors.",
              ],
            },
            {
              title: "Program and contractor coordination",
              copy: "A bridge between delivery, documentation, and stakeholder reporting when the work spans multiple teams.",
              bullets: [
                "Execution tracking and issue visibility.",
                "Documentation handoff between teams.",
                "Proposal-ready and client-ready communication structure.",
              ],
            },
          ]}
          columns={2}
        />
      </MarketingSection>

      <MarketingSection
        copy="These are the environments where Odirico Consulting can earn credibility fastest and create the cleanest bridge into Odirico OS."
        eyebrow="Where the consulting arm fits best"
        muted
        title="Built for utility, telecom, and field-heavy public work."
      >
        <MarketingCardGrid
          cards={[
            { title: "Power and utility infrastructure", copy: "Distribution, facilities, structures, inspections, and field coordination work." },
            { title: "Telecom and broadband", copy: "Programs that need structured field documentation and stronger reporting paths." },
            { title: "Public infrastructure", copy: "City, county, and grant-funded work that benefits from tighter process discipline." },
          ]}
          columns={3}
        />
      </MarketingSection>

      <MarketingCta
        copy="The consulting story should be easy to reuse in outreach, proposals, capability statements, and the software story."
        primary={{ href: "/contact", label: "Contact Odirico", variant: "dark" }}
        secondary={{ href: "/capability", label: "View Capability Statement", variant: "secondary" }}
        title="Request a capability statement or start a project conversation."
      />
    </>
  );
}
