import { AppWorkspaceOverview } from "@/components/platform/app-workspace-overview";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SolPage() {
  const userContext = await requireUserContext();

  return (
    <AppWorkspaceOverview
      appKey="sol"
      currentPath="/sol"
      subtitle="Long-range direction, credit strategy, and goal planning under one shared platform shell."
      statusNote="Sol already has a route model in its own workspace, so this route becomes the canonical in-platform destination while the current Sol source is folded in carefully."
      highlights={[
        "Long-term planning, credit optimization, account strategy, and simulations.",
        "A route-native home inside the Odirico platform instead of a separate deployment island.",
        "Shared session, future shared subscriptions, and cross-app movement without re-auth.",
      ]}
      nextMoves={[
        "Promote Sol's existing project catalog and route definitions into shared platform contracts.",
        "Bring the Sol authenticated workspace into this App Router shell under one session model.",
        "Align billing and entitlements so Sol unlocks feel native to the rest of the product.",
      ]}
      userContext={userContext}
    />
  );
}
