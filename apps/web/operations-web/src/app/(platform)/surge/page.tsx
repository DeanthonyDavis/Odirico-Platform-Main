import { AppShell } from "@/components/layout/app-shell";
import { AppAccessLinks } from "@/components/platform/app-access-links";
import { SurgeRuntimeFrame } from "@/components/platform/surge-runtime-frame";
import { requireUserContext } from "@/lib/auth/session";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { getOdiricoEcosystemApp } from "@odirico/core/apps";
import { getOdiricoEcosystemSnapshot } from "@odirico/core/ecosystem";

export const dynamic = "force-dynamic";

const surgeNav = [
  { href: "/surge#dashboard", label: "Dashboard" },
  { href: "/surge#pipeline", label: "Pipeline" },
  { href: "/surge#companies", label: "Companies" },
  { href: "/surge#activity", label: "Activity" },
  { href: "/surge#connections", label: "Connections" },
];

export default async function SurgePage() {
  const userContext = await requireUserContext();
  await getBillingSnapshotForUser(userContext.user.id);
  const surge = getOdiricoEcosystemApp("surge");
  const snapshot = getOdiricoEcosystemSnapshot();
  const topApplications = snapshot.surge.applications.slice(0, 4);
  const followUps = snapshot.surge.applications.filter((application) => application.nextActionDate).slice(0, 3);
  const activeCompanies = Array.from(new Set(snapshot.surge.applications.map((application) => application.company)));

  return (
    <AppShell
      currentPath="/surge"
      title="Surge"
      subtitle="An opportunity command center for applications, recruiter signals, follow-ups, and pipeline momentum."
      userContext={userContext}
      eyebrow="Odirico / Platform / Surge"
      variant="ecosystem"
      localNav={surgeNav}
    >
      <div className="stats-grid" id="dashboard">
        <article className="stat-card">
          <span className="sidebar-label">Active applications</span>
          <strong>{snapshot.surge.summary.activeApplications}</strong>
          <p className="muted">Use the dashboard to see what is moving, what stalled, and what needs a follow-up today.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Interviews</span>
          <strong>{snapshot.surge.summary.interviews}</strong>
          <p className="muted">Interview loops should stay visible enough that prep, thank-yous, and scheduling never get dropped.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Offers</span>
          <strong>{snapshot.surge.summary.offers}</strong>
          <p className="muted">Offer activity belongs in the same system so compensation comparison and next-step logic stay connected.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Companies tracked</span>
          <strong>{activeCompanies.length}</strong>
          <p className="muted">Surge should feel like a live opportunity database, not a setup note wrapped around an iframe.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel" id="pipeline">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Today’s queue</p>
              <h3>What needs action across the pipeline</h3>
            </div>
          </div>
          <div className="task-list-grid">
            {followUps.map((application) => (
              <article className="task-card" key={application.id}>
                <div className="task-card-top">
                  <div>
                    <strong>{application.company}</strong>
                    <p className="muted">{application.role}</p>
                  </div>
                  <span className={`module-pill task-status-pill task-status-${application.status}`}>
                    {application.status}
                  </span>
                </div>
                <p className="muted">{application.nextAction}</p>
                <div className="context-row">
                  <span className="status-pill">{application.nextActionDate}</span>
                  <span className="status-pill">{application.source}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar-panels" id="companies">
          <section className="panel">
            <p className="sidebar-label">Company tracker</p>
            <div className="signal-list">
              {activeCompanies.slice(0, 5).map((company) => (
                <article className="signal-card-mini" key={company}>
                  <strong>{company}</strong>
                  <p className="muted">
                    {snapshot.surge.applications.filter((application) => application.company === company).length} active record(s)
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel" id="activity">
            <p className="sidebar-label">Recent activity</p>
            <div className="signal-list">
              {topApplications.map((application) => (
                <article className="signal-card-mini" key={`${application.id}-activity`}>
                  <strong>{application.company}</strong>
                  <p className="muted">{application.nextAction}</p>
                  <span className="mini-meta">{application.nextActionDate}</span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="panel" id="connections">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Capture and connections</p>
            <h3>Keep capture tools available without letting setup language dominate the workspace</h3>
          </div>
        </div>
        <AppAccessLinks targets={surge.installTargets} />
      </section>

      <SurgeRuntimeFrame />
    </AppShell>
  );
}
