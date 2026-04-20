import { AppShell } from "@/components/layout/app-shell";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { canManageOrganization } from "@/lib/auth/roles";
import { requireUserContext } from "@/lib/auth/session";
import { listManagedUsers } from "@/lib/settings/admin";

export const dynamic = "force-dynamic";

const settingsNav = [
  { href: "/settings#appearance", label: "Appearance" },
  { href: "/settings#access", label: "Access" },
  { href: "/settings#account", label: "Account" },
];

export default async function SettingsPage() {
  const userContext = await requireUserContext();
  const managedUsers = canManageOrganization(userContext.roles)
    ? await listManagedUsers()
    : [];

  return (
    <AppShell
      currentPath="/settings"
      title="Settings"
      subtitle="Account, appearance, and shared ecosystem controls live here instead of taking over the apps."
      userContext={userContext}
      eyebrow="Odirico / Platform / Settings"
      variant="ecosystem"
      localNav={settingsNav}
    >
      <SettingsPanel managedUsers={managedUsers} userContext={userContext} />
    </AppShell>
  );
}
