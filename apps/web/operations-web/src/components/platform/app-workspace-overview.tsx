import { getOdiricoApp, type OdiricoAppKey } from "@odirico/core/apps";

import { AppShell } from "@/components/layout/app-shell";
import { EcosystemAppGrid } from "@/components/platform/ecosystem-app-grid";
import type { UserContext } from "@/lib/auth/roles";

type AppWorkspaceOverviewProps = {
  appKey: OdiricoAppKey;
  currentPath: string;
  title?: string;
  subtitle: string;
  statusNote: string;
  highlights: string[];
  nextMoves: string[];
  userContext: UserContext;
};

export function AppWorkspaceOverview({
  appKey,
  currentPath,
  title,
  subtitle,
  statusNote,
  highlights,
  nextMoves,
  userContext,
}: AppWorkspaceOverviewProps) {
  const app = getOdiricoApp(appKey);

  return (
    <AppShell
      currentPath={currentPath}
      title={title ?? `${app.label} Workspace`}
      subtitle={subtitle}
      userContext={userContext}
      eyebrow={`Odirico / ${app.label}`}
    >
      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">App brief</p>
              <h3>{app.label}</h3>
            </div>
            <span className={app.status === "live" ? "module-pill live" : "module-pill"}>
              {app.statusLabel}
            </span>
          </div>

          <p className="muted">{app.summary}</p>

          <div className="context-row">
            <span className="status-pill">{app.platformRole}</span>
            <span className="status-pill">{app.audience}</span>
            <span className="status-pill">{app.href}</span>
          </div>

          <div className="feature-stack">
            <div>
              <p className="sidebar-label">What belongs here</p>
              <ul className="feature-list">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="sidebar-label">Next integration moves</p>
              <ul className="feature-list">
                {nextMoves.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Migration status</p>
            <h3>Route shell is live</h3>
            <p className="muted">{statusNote}</p>
            <p className="ecosystem-workspace-root">Current source: {app.workspaceRoot}</p>
          </section>

          <section className="panel">
            <p className="sidebar-label">Ecosystem switcher</p>
            <EcosystemAppGrid currentAppKey={appKey} showWorkspaceRoot />
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
