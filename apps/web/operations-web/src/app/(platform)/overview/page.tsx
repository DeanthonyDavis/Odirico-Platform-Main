import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { PreviewBanner } from "@/components/billing/preview-banner";
import { EcosystemCommandCenter } from "@/components/platform/ecosystem-command-center";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const userContext = await requireUserContext();
  const billing = await getBillingSnapshotForUser(userContext.user.id);

  return (
    <AppShell
      currentPath="/overview"
      title="Overview"
      subtitle="Your shared command center for assignments, money direction, and application momentum across Ember, Sol, and Surge."
      userContext={userContext}
      variant="ecosystem"
    >
      {!billing.hasActiveSubscription ? (
        <PreviewBanner
          checkoutConfigured={billing.checkoutConfigured}
          copy="The overview is visible so the platform feels complete, but billing still controls the full connected access model and future sync features."
          title="You are viewing the platform in preview mode"
        />
      ) : null}

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
