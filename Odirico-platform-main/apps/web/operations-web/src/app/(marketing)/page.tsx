import { ODIRICO_APPS } from "@odirico/core/apps";
import {
  MarketingCardGrid,
  MarketingCta,
  MarketingHero,
  MarketingSection,
  MarketingStats,
} from "@/components/marketing/marketing-sections";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSession();
  const appHref = user ? "/dashboard" : "/login";
  const appLabel = user ? "Open Platform" : "Platform Login";

  return (
    <>
      <MarketingHero
        actions={[
          { href: "/expertise", label: "Explore Consulting", variant: "dark" },
          { href: "/products", label: "See Odirico OS", variant: "primary" },
          { href: appHref, label: appLabel, variant: "secondary" },
        ]}
        copy="Odirico is the master brand. Odirico Consulting delivers infrastructure support and field execution clarity. Odirico OS turns that same operating logic into one route-based product ecosystem."
        dark
        eyebrow="Houston, Texas · infrastructure consulting · route-based software ecosystem"
        side={
          <div className="marketing-card-grid columns-2">
            {ODIRICO_APPS.map((app) => (
              <article className="marketing-card" key={app.key}>
                <span className="marketing-card-badge">{app.statusLabel}</span>
                <h3>{app.label}</h3>
                <p>{app.tagline}</p>
              </article>
            ))}
          </div>
        }
        title="Consulting, software, and operating systems under one deploy."
      />

      <MarketingSection
        copy="The public story should be simple: one firm, one ecosystem, and clear paths into consulting work or product workflows."
        eyebrow="Platform snapshot"
        title="Built for infrastructure work that cannot afford confusion."
      >
        <MarketingStats
          items={[
            { label: "Apps in the platform shell", value: "4" },
            { label: "Connected divisions", value: "2" },
            { label: "Primary launch market", value: "TX" },
            { label: "Deployment model", value: "1" },
          ]}
        />
      </MarketingSection>

      <MarketingSection
        copy="The consulting arm informs the tools. The tools strengthen delivery. Clients can buy services, software, or both without the story breaking apart."
        eyebrow="One firm. Two divisions."
        muted
        title="The website and the platform now point to the same operating model."
      >
        <MarketingCardGrid
          cards={[
            {
              badge: "Division 01",
              title: "Odirico Consulting",
              copy: "Founder-led infrastructure support for project services, surveying, and engineering-adjacent execution.",
              bullets: [
                "Project services for active utility and infrastructure scopes.",
                "Surveying and field documentation support.",
                "Engineering context for owners, contractors, and public teams.",
              ],
            },
            {
              badge: "Division 02",
              title: "Odirico OS",
              copy: "A unified product platform for operations, planning, readiness, and application command workflows.",
              bullets: [
                "PoleQA for field issue capture and QA/QC.",
                "Ember and Sol for personal operating systems and planning.",
                "Surge for universal job and internship command workflows.",
              ],
            },
            {
              badge: "Market fit",
              title: "Texas-first positioning",
              copy: "Houston-rooted, utility-aware, and credible for outreach, procurement conversations, and product demos.",
              bullets: [
                "Power, utility, and telecom fluency.",
                "Operator-friendly positioning.",
                "Clear story for services plus software.",
              ],
            },
          ]}
        />
      </MarketingSection>

      <MarketingSection
        copy="The platform now has real route homes for every app, so the public site can talk about one ecosystem instead of a fragmented tool list."
        eyebrow="Software ecosystem"
        title="Route-based products, one login, and one shared shell."
      >
        <MarketingCardGrid
          cards={ODIRICO_APPS.map((app) => ({
            badge: app.statusLabel,
            title: app.label,
            copy: app.summary,
            href: app.href,
            hrefLabel: `Open ${app.label}`,
          }))}
          columns={4}
        />
      </MarketingSection>

      <MarketingSection
        copy="The clearest early wins stay close to utility infrastructure, telecom, field reporting, and operational consistency."
        eyebrow="Where Odirico should win first"
        title="Markets where the services story and the software story reinforce each other."
      >
        <MarketingCardGrid
          cards={[
            {
              title: "Power and utilities",
              copy: "Electric co-ops, municipal utilities, and infrastructure operators where field clarity and documentation quality matter.",
              href: "/sectors",
              hrefLabel: "View markets",
            },
            {
              title: "Telecom and broadband",
              copy: "Field-heavy broadband and telecom programs benefit from stronger QA oversight and cleaner reporting paths.",
              href: "/sectors",
              hrefLabel: "View markets",
            },
          ]}
          columns={2}
        />
      </MarketingSection>

      <MarketingCta
        copy="The website, public positioning, and platform shell now all support the same story. That means outreach, proposals, demos, and product onboarding can point to one destination."
        primary={{ href: "/capability", label: "View Capability Page", variant: "dark" }}
        secondary={{ href: "/contact", label: "Start a Conversation", variant: "secondary" }}
        title="Use one deploy for the website, the platform shell, and the product ecosystem."
      />
    </>
  );
}
