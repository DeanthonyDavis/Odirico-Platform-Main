import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EcosystemCommandCenter } from "@/components/platform/ecosystem-command-center";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const overviewNav = [
  { href: "/overview#command", label: "Command" },
  { href: "/overview#signals", label: "Signals" },
  { href: "/overview#apps", label: "Apps" },
];

export default async function OverviewPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/overview"
      title="Overview"
      subtitle="A cross-app command center for today’s academic pressure, money decisions, and career momentum."
      userContext={userContext}
      variant="ecosystem"
      localNav={overviewNav}
    >
      <EcosystemCommandCenter />

      <section className="panel" id="apps">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Ecosystem paths</p>
            <h3>Move straight into the app that matches the pressure in front of you</h3>
          </div>
        </div>
        <div className="access-link-row access-link-row-compact">
          <Link className="access-link access-link-live" href="/ember">
            <span>Open Ember</span>
            <small>Today</small>
          </Link>
          <Link className="access-link access-link-live" href="/sol">
            <span>Open Sol</span>
            <small>Money</small>
          </Link>
          <Link className="access-link access-link-live" href="/surge">
            <span>Open Surge</span>
            <small>Career</small>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
