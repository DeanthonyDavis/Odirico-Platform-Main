import { ODIRICO_APPS } from "@odirico/core/apps";
import { MarketingCardGrid, MarketingCta, MarketingHero, MarketingSection } from "@/components/marketing/marketing-sections";

export default function ProductsPage() {
  return (
    <>
      <MarketingHero
        actions={[
          { href: "/login", label: "Platform Login", variant: "primary" },
          { href: "/contact", label: "Request a Demo", variant: "secondary" },
        ]}
        copy="One project, one session model, and app routes for field operations, personal operating systems, planning, and application command workflows."
        dark
        eyebrow="Odirico OS"
        title="One deploy. One login. Multiple operating systems."
        side={
          <MarketingCardGrid
            cards={ODIRICO_APPS.map((app) => ({
              badge: app.statusLabel,
              title: app.label,
              copy: app.tagline,
              href: app.href,
              hrefLabel: `Open ${app.label}`,
            }))}
            columns={2}
          />
        }
      />

      <MarketingSection
        copy="The platform story is stronger when the apps share one login, one billing path, one shell, and one destination."
        eyebrow="Why one platform matters"
        title="A product ecosystem that feels like one product, not four separate experiments."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "One login",
              copy: "Users move between products without re-authenticating or wondering which deployment they are in.",
            },
            {
              title: "Shared operating context",
              copy: "App-level routes, shared contracts, and platform navigation keep the ecosystem legible.",
            },
            {
              title: "Utility-ready posture",
              copy: "Operational clarity, role-aware workflows, and a stronger story for real infrastructure work.",
            },
          ]}
          columns={3}
        />
      </MarketingSection>

      <MarketingSection
        copy="The live module is PoleQA, while the rest of the ecosystem is now being folded into the same platform shell."
        eyebrow="Apps"
        muted
        title="The route map is already in place."
      >
        <MarketingCardGrid
          cards={[
            {
              badge: "Live now",
              title: "PoleQA",
              copy: "Inspection, QA/QC ticketing, and field issue visibility for infrastructure workflows.",
              bullets: [
                "Issue capture and closeout visibility.",
                "Documentation-heavy operational support.",
                "Live inside the current platform shell.",
              ],
              href: "/dashboard",
              hrefLabel: "Open PoleQA",
            },
            {
              badge: "Prototype to platform",
              title: "Ember",
              copy: "A daily survival and recovery operating system that blends planning, school, work, money, and awareness.",
              bullets: [
                "Guided actions and check-ins.",
                "Mobile-first operating model.",
                "Route home already inside the platform shell.",
              ],
              href: "/ember",
              hrefLabel: "View Ember",
            },
            {
              badge: "Active build",
              title: "Sol",
              copy: "Long-range direction, credit optimization, goals, and strategy under the same identity system.",
              bullets: [
                "Long-term planning and simulations.",
                "Shared session and future entitlements.",
                "Ready for deeper runtime migration.",
              ],
              href: "/sol",
              hrefLabel: "View Sol",
            },
            {
              badge: "Active build",
              title: "Surge",
              copy: "A universal application command center that keeps the record no matter where the job search happens.",
              bullets: [
                "Apply-anywhere memory system.",
                "Signal-based application tracking.",
                "First-class home inside the platform shell.",
              ],
              href: "/surge",
              hrefLabel: "View Surge",
            },
          ]}
          columns={2}
        />
      </MarketingSection>

      <MarketingCta
        copy="If the public site and the apps deploy together, the product story stays clear: one ecosystem, one route model, one place to go."
        primary={{ href: "/contact", label: "Talk About Deployment", variant: "dark" }}
        secondary={{ href: "/dashboard", label: "Open the Platform", variant: "secondary" }}
        title="The website and the platform now belong in the same deployment."
      />
    </>
  );
}
