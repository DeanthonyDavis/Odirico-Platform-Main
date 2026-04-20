import { AppShell } from "@/components/layout/app-shell";
import { EmberWorkspace } from "@/components/platform/ember-workspace";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";
import { loadWorkspaceState } from "@/lib/platform/workspaces";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const emberNav = [
  { href: "/ember#today", label: "Today" },
  { href: "/ember#assignments", label: "Assignments" },
  { href: "/ember#exams", label: "Exams" },
  { href: "/ember#study-plan", label: "Study plan" },
  { href: "/ember#routine", label: "Routine" },
];

export default async function EmberPage() {
  const userContext = await requireUserContext();
  await getBillingSnapshotForUser(userContext.user.id);
  const supabase = await createServerSupabaseClient();
  const workspace = await loadWorkspaceState(supabase, userContext.user.id, "ember");

  return (
    <AppShell
      currentPath="/ember"
      title="Ember"
      subtitle="A student execution system for assignments, exams, study flow, and recovery-aware planning."
      userContext={userContext}
      eyebrow="Odirico / Platform / Ember"
      variant="ecosystem"
      localNav={emberNav}
    >
      <EmberWorkspace
        hasPersistedState={workspace.hasPersistedState}
        initialState={workspace.state}
      />
    </AppShell>
  );
}
