import { AppWorkspaceOverview } from "@/components/platform/app-workspace-overview";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SurgePage() {
  const userContext = await requireUserContext();

  return (
    <AppWorkspaceOverview
      appKey="surge"
      currentPath="/surge"
      subtitle="A universal application command center that captures signals wherever the job search happens."
      statusNote="Surge is currently a personal-use tool workspace, and this route gives it a first-class home in the Odirico ecosystem before the deeper sync runtime is migrated in."
      highlights={[
        "Application capture from email, browser signals, manual quick-add, and deduped company-role memory.",
        "Unified follow-up, event timeline, recruiter contact tracking, and next-action flow.",
        "A clean path to shared identity, subscriptions, and future mobile/desktop shells.",
      ]}
      nextMoves={[
        "Move Surge's shared data model into workspace packages so mobile and desktop shells can reuse it.",
        "Port the personal tracker runtime into this route-based Next.js shell.",
        "Connect billing and feature entitlements once sync and ingestion features are promoted.",
      ]}
      userContext={userContext}
    />
  );
}
