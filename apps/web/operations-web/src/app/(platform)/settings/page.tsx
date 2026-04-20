import { AppShell } from "@/components/layout/app-shell";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { canManageOrganization } from "@/lib/auth/roles";
import { requireUserContext } from "@/lib/auth/session";
import { listManagedUsers } from "@/lib/settings/admin";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userContext = await requireUserContext();
  const managedUsers = canManageOrganization(userContext.roles)
    ? await listManagedUsers()
    : [];

  return (
    <AppShell
      currentPath="/settings"
      title="Settings"
      subtitle="Appearance, account controls, and platform preferences in one shared settings surface."
      userContext={userContext}
      eyebrow="Odirico / Platform / Settings"
      variant="ecosystem"
    >
      <SettingsPanel managedUsers={managedUsers} userContext={userContext} />
    </AppShell>
  );
}
