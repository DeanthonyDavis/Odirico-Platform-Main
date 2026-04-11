import { AppWorkspaceOverview } from "@/components/platform/app-workspace-overview";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function EmberPage() {
  const userContext = await requireUserContext();

  return (
    <AppWorkspaceOverview
      appKey="ember"
      currentPath="/ember"
      subtitle="Daily survival, awareness, recovery, and momentum inside the same Odirico identity system."
      statusNote="The route-based home now lives in the unified Next.js shell, while the deeper Ember runtime still lives in its dedicated prototype workspace during migration."
      highlights={[
        "Mobile-first personal operating system flows for planning, school, work, money, and recovery.",
        "Guided daily actions, notifications, check-ins, and source-driven life organization.",
        "A shared login and eventual shared billing/entitlements layer with the rest of Odirico.",
      ]}
      nextMoves={[
        "Port the strongest Ember dashboard surfaces into this route shell.",
        "Unify Supabase auth/session and entitlement checks with the platform core.",
        "Move connector, ingestion, and planner contracts behind shared workspace packages.",
      ]}
      userContext={userContext}
    />
  );
}
