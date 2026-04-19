import Link from "next/link";

import type { OdiricoInstallTarget } from "@odirico/core/apps";

type AppAccessLinksProps = {
  targets: readonly OdiricoInstallTarget[];
  compact?: boolean;
};

export function AppAccessLinks({
  targets,
  compact = false,
}: AppAccessLinksProps) {
  return (
    <div className={compact ? "access-link-row access-link-row-compact" : "access-link-row"}>
      {targets.map((target) => (
        <Link
          className={
            target.availability === "live"
              ? "access-link access-link-live"
              : target.availability === "guided"
                ? "access-link access-link-guided"
                : "access-link"
          }
          href={target.href as never}
          key={`${target.surface}-${target.label}`}
          title={target.note}
        >
          <span>{target.label}</span>
          <small>{target.availability === "live" ? "Live" : target.availability === "guided" ? "Install" : "Soon"}</small>
        </Link>
      ))}
    </div>
  );
}
