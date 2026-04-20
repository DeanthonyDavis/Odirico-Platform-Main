import { AppShell } from "@/components/layout/app-shell";
import { PreviewBanner } from "@/components/billing/preview-banner";
import { EmberWorkspace } from "@/components/platform/ember-workspace";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function EmberPage() {
  const userContext = await requireUserContext();
  const billing = await getBillingSnapshotForUser(userContext.user.id);

  return (
    <AppShell
      currentPath="/ember"
      title="Ember"
      subtitle="The student-first execution engine for classes, assignments, exams, and study planning."
      userContext={userContext}
      eyebrow="Odirico / Platform / Ember"
      variant="ecosystem"
    >
      {!billing.hasActiveSubscription ? (
        <PreviewBanner
          checkoutConfigured={billing.checkoutConfigured}
          copy="Ember stays visible as its own workspace so the platform feels coherent, while billing still controls the full connected access model."
          title="You are previewing Ember"
        />
      ) : null}

      <EmberWorkspace />
    </AppShell>
  );
}
