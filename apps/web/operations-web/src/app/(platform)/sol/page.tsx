import { AppShell } from "@/components/layout/app-shell";
import { SolWorkspace } from "@/components/platform/sol-workspace";
import { getBillingSnapshotForUser } from "@/lib/billing/service";
import { requireUserContext } from "@/lib/auth/session";
import { loadWorkspaceState } from "@/lib/platform/workspaces";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const solNav = [
  { href: "/sol#overview", label: "Overview" },
  { href: "/sol#money", label: "Money" },
  { href: "/sol#bills", label: "Bills" },
  { href: "/sol#goals", label: "Goals" },
  { href: "/sol#planning", label: "Planning" },
];

export default async function SolPage() {
  const userContext = await requireUserContext();
  await getBillingSnapshotForUser(userContext.user.id);
  const supabase = await createServerSupabaseClient();
  const workspace = await loadWorkspaceState(supabase, userContext.user.id, "sol");

  return (
    <AppShell
      currentPath="/sol"
      title="Sol"
      subtitle="A money and life-planning system for bills, budgets, credit, and long-range direction."
      userContext={userContext}
      eyebrow="Odirico / Platform / Sol"
      variant="ecosystem"
      localNav={solNav}
    >
      <SolWorkspace
        hasPersistedState={workspace.hasPersistedState}
        initialState={workspace.state}
      />
    </AppShell>
  );
}
