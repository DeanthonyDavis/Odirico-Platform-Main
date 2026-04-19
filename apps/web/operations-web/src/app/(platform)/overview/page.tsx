import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EcosystemCommandCenter } from "@/components/platform/ecosystem-command-center";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/overview"
      title="Overview"
      subtitle="Your shared command center for assignments, money direction, and application momentum across Ember, Sol, and Surge."
      userContext={userContext}
      variant="ecosystem"
    >
      <EcosystemCommandCenter />

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Platform install</p>
            <h3>Install one platform and keep the same account everywhere</h3>
          </div>
        </div>
        <div className="access-link-row access-link-row-compact">
          <Link className="access-link access-link-live" href="/install">
            <span>Install guide</span>
            <small>Live</small>
          </Link>
          <Link className="access-link access-link-guided" href="/pricing">
            <span>Plan details</span>
            <small>View</small>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
