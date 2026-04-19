import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { EcosystemAppGrid } from "@/components/platform/ecosystem-app-grid";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/overview"
      title="Your ecosystem"
      subtitle="One connected platform for time, money, and momentum across Ember, Sol, and Surge."
      userContext={userContext}
      variant="ecosystem"
    >
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Today</span>
          <strong>Ember</strong>
          <p className="muted">Use Ember to anchor routines, recovery, assignments, and the shape of the week.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Direction</span>
          <strong>Sol</strong>
          <p className="muted">Use Sol to keep money decisions, credit, and long-range goals working together.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Momentum</span>
          <strong>Surge</strong>
          <p className="muted">Use Surge to keep applications, opportunities, and follow-up actions from getting lost.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Modules</p>
              <h3>Open the part of the system you need now</h3>
            </div>
          </div>

          <EcosystemAppGrid />
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Cross-app logic</p>
            <ul className="feature-list">
              <li>Ember owns time, routines, assignments, and recovery rhythm.</li>
              <li>Sol owns money, direction, goals, and future planning.</li>
              <li>Surge owns opportunities, applications, and outward momentum.</li>
            </ul>
          </section>

          <section className="panel">
            <p className="sidebar-label">Install once</p>
            <h3>Install the platform, not three separate apps</h3>
            <p className="muted">
              The platform shell is the install surface. Once it is installed, the modules live
              inside the same account and navigation system.
            </p>
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
        </aside>
      </div>
    </AppShell>
  );
}
