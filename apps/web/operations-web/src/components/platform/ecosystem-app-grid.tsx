import Image from "next/image";
import Link from "next/link";

import { ODIRICO_ECOSYSTEM_APPS, type OdiricoConsumerAppKey } from "@odirico/core/apps";

import { AppAccessLinks } from "@/components/platform/app-access-links";

type EcosystemAppGridProps = {
  currentAppKey?: OdiricoConsumerAppKey;
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
      {ODIRICO_ECOSYSTEM_APPS.map((app) => {
        return (
          <article
            key={app.key}
            className={app.key === currentAppKey ? "ecosystem-card active" : "ecosystem-card"}
          >
            <div className="ecosystem-card-top">
              <div className="ecosystem-card-title">
                <Image alt="" className="ecosystem-card-logo" height={42} src={app.logoPath} width={42} />
                <div>
                  <p className="ecosystem-app-kicker">{app.platformRole}</p>
                  <h3>{app.label}</h3>
                </div>
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
              <span>{app.integrationRole}</span>
            </div>
            <AppAccessLinks compact targets={app.installTargets.slice(0, 2)} />
            {showWorkspaceRoot ? (
              <p className="ecosystem-workspace-root">Current source: {app.workspaceRoot}</p>
            ) : null}
            {interactive ? (
              <Link className="ecosystem-card-primary-link" href={app.href as never}>
                Open {app.label}
              </Link>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
