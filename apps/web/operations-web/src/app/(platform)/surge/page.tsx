import { AppShell } from "@/components/layout/app-shell";
import { AppAccessLinks } from "@/components/platform/app-access-links";
import { SurgeRuntimeFrame } from "@/components/platform/surge-runtime-frame";
import { requireUserContext } from "@/lib/auth/session";
import { getOdiricoEcosystemApp } from "@odirico/core/apps";

export const dynamic = "force-dynamic";

export default async function SurgePage() {
  const userContext = await requireUserContext();
  const surge = getOdiricoEcosystemApp("surge");

  return (
    <AppShell
      currentPath="/surge"
      title="Surge"
      subtitle="A universal application command center that captures signals wherever the job search happens."
      userContext={userContext}
      eyebrow="Odirico / Platform / Surge"
      variant="ecosystem"
    >
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Status</span>
          <strong>Live</strong>
          <p className="muted">The actual Surge runtime is now mounted inside this route.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Capture model</span>
          <strong>Signals</strong>
          <p className="muted">Manual captures, browser handoff, recruiter email parsing, and calendar sync flow into one memory.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Access</span>
          <strong>Shared</strong>
          <p className="muted">Use the same platform account while the Surge runtime stays self-contained and usable today.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <p className="sidebar-label">Install and handoff</p>
          <h3>Use the integrated route as your main Surge URL</h3>
          <p className="muted">
            If you update the browser extension or your manual setup, point it at <code>/surge</code>
            instead of the old standalone HTML file path. The route will forward capture payloads
            into the live runtime below.
          </p>
          <AppAccessLinks targets={surge.installTargets} />
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Data note</p>
            <h3>Backup import may still be needed once</h3>
            <p className="muted">
              If your existing Surge data lives in a different origin like a local file or a
              separate localhost port, export a JSON backup there and import it here from inside
              Surge once.
            </p>
          </section>
        </aside>
      </div>

      <SurgeRuntimeFrame />
    </AppShell>
  );
}
