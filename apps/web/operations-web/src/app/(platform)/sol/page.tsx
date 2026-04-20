import { AppShell } from "@/components/layout/app-shell";
import { PreviewBanner } from "@/components/billing/preview-banner";
import { SolWorkspace } from "@/components/platform/sol-workspace";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SolPage() {
  const userContext = await requireUserContext();
  const billing = await getBillingSnapshotForUser(userContext.user.id);

  return (
    <AppShell
      currentPath="/sol"
      title="Sol"
      subtitle="The money and direction layer for goals, stability, and longer-range strategy."
      userContext={userContext}
      eyebrow="Odirico / Platform / Sol"
      variant="ecosystem"
    >
      {!billing.hasActiveSubscription ? (
        <PreviewBanner
          checkoutConfigured={billing.checkoutConfigured}
          copy="Sol remains visible as its own money workspace so the platform does not feel empty, while billing still controls the full connected access model."
          title="You are previewing Sol"
        />
      ) : null}

      <SolWorkspace />
    </AppShell>
  );
}
