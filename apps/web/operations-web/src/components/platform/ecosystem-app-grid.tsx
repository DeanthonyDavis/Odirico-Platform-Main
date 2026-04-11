import Link from "next/link";

import { ODIRICO_APPS, type OdiricoAppKey } from "@odirico/core/apps";

type EcosystemAppGridProps = {
  currentAppKey?: OdiricoAppKey;
  interactive?: boolean;
  showWorkspaceRoot?: boolean;
};

export function EcosystemAppGrid({
  currentAppKey,
  interactive = true,
  showWorkspaceRoot = false,
}: EcosystemAppGridProps) {
  return (
    <div className="ecosystem-grid">
      {ODIRICO_APPS.map((app) => {
        const content = (
          <>
            <div className="ecosystem-card-top">
              <div>
                <p className="ecosystem-app-kicker">{app.platformRole}</p>
                <h3>{app.label}</h3>
              </div>
              <span
                className={
                  app.key === currentAppKey
                    ? "module-pill live ecosystem-pill"
                    : "module-pill ecosystem-pill"
                }
              >
                {app.statusLabel}
              </span>
            </div>
            <p className="muted">{app.tagline}</p>
            <p className="ecosystem-summary">{app.summary}</p>
            <div className="ecosystem-meta">
              <span>{app.audience}</span>
              <span>{app.href}</span>
            </div>
            {showWorkspaceRoot ? (
              <p className="ecosystem-workspace-root">Current source: {app.workspaceRoot}</p>
            ) : null}
          </>
        );

        if (!interactive) {
          return (
            <article
              key={app.key}
              className={app.key === currentAppKey ? "ecosystem-card active" : "ecosystem-card"}
            >
              {content}
            </article>
          );
        }

        return (
          <Link
            key={app.key}
            className={app.key === currentAppKey ? "ecosystem-card active" : "ecosystem-card"}
            href={app.href as never}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
