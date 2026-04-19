import { AppShell } from "@/components/layout/app-shell";
import { SolWorkspace } from "@/components/platform/sol-workspace";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function SolPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/sol"
      title="Sol"
      subtitle="Life, money, and energy planning under one shared platform shell."
      userContext={userContext}
      eyebrow="Odirico / Platform / Sol"
      variant="ecosystem"
    >
      <SolWorkspace />
    </AppShell>
  );
}
