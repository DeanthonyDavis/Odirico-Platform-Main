import { AppShell } from "@/components/layout/app-shell";
import { EmberWorkspace } from "@/components/platform/ember-workspace";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function EmberPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/ember"
      title="Ember"
      subtitle="The student-first execution engine for classes, assignments, exams, and study planning."
      userContext={userContext}
      eyebrow="Odirico / Platform / Ember"
      variant="ecosystem"
    >
      <EmberWorkspace />
    </AppShell>
  );
}
