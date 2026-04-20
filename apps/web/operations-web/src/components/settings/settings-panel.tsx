"use client";

import Link from "next/link";
import { useState } from "react";

import { canManageOrganization, PLATFORM_ROLES, type UserContext } from "@/lib/auth/roles";
import { useSettings } from "@/lib/settings/client";
import type { ManagedUser } from "@/lib/settings/admin";

type SettingsPanelProps = {
  managedUsers: ManagedUser[];
  userContext: UserContext;
};

const TEAM_OPTIONS = ["Alpha", "Bravo", "Charlie"] as const;
const THEME_OPTIONS = [
  {
    value: "classic",
    label: "Classic",
    copy: "Warm neutral surfaces with the core Odirico green.",
  },
  {
    value: "ocean",
    label: "Ocean",
    copy: "Cooler blue-green tones for a calmer planning surface.",
  },
  {
    value: "sunrise",
    label: "Sunrise",
    copy: "Warmer amber tones if you want the shell to feel brighter.",
  },
] as const;

const PLATFORM_LINKS = [
  {
    href: "/overview",
    label: "Overview",
    copy: "Open the shared command center before you move into a specific app.",
  },
  {
    href: "/ember",
    label: "Ember",
    copy: "Jump into the academic planning and recovery workspace.",
  },
  {
    href: "/sol",
    label: "Sol",
    copy: "Open the money, goals, and long-range strategy space.",
  },
  {
    href: "/surge",
    label: "Surge",
    copy: "Go straight into the application and opportunity workspace.",
  },
  {
    href: "/billing",
    label: "Subscription",
    copy: "Manage your plan access across Ember, Sol, and Surge without interrupting the app spaces.",
  },
  {
    href: "/delete-account",
    label: "Delete account",
    copy: "Open the account deletion request page and data removal instructions.",
  },
] as const;

export function SettingsPanel({ managedUsers, userContext }: SettingsPanelProps) {
  const settings = useSettings(userContext.user.email);
  const [users, setUsers] = useState(managedUsers);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const canManageOrg = canManageOrganization(userContext.roles);
  const hasOperationsWorkspace = userContext.allowedModes.length > 0;

  function updateManagedUser(
    userId: string,
    updater: (current: ManagedUser) => ManagedUser,
  ) {
    setUsers((current) =>
      current.map((user) => (user.id === userId ? updater(user) : user)),
    );
  }

  async function saveManagedUser(user: ManagedUser) {
    setSavingUserId(user.id);
    setMessage(null);

    const response = await fetch("/api/settings/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(payload.error ?? "Unable to save user access right now.");
      setSavingUserId(null);
      return;
    }

    setMessage(`Saved access changes for ${user.email}. They may need to log out and back in.`);
    setSavingUserId(null);
  }

  return (
    <div className="settings-grid">
      <section className="panel settings-section" id="appearance">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Appearance</p>
            <h3>Theme and shell feel</h3>
          </div>
        </div>

        <div className="form-grid">
          <div className="field field-span-full">
            <span>Theme</span>
            <div className="theme-option-grid">
              {THEME_OPTIONS.map((theme) => {
                const active = settings.userSettings.theme === theme.value;

                return (
                  <button
                    className={active ? "theme-option-card active" : "theme-option-card"}
                    key={theme.value}
                    onClick={() =>
                      settings.updateUserSettings((current) => ({
                        ...current,
                        theme: theme.value,
                      }))
                    }
                    type="button"
                  >
                    <span className={`theme-option-preview theme-option-preview-${theme.value}`} />
                    <strong>{theme.label}</strong>
                    <p>{theme.copy}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="field">
            <span>Density</span>
            <select
              onChange={(event) =>
                settings.updateUserSettings((current) => ({
                  ...current,
                  density: event.target.value as typeof current.density,
                }))
              }
              value={settings.userSettings.density}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel settings-section" id="access">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Platform access</p>
            <h3>Move between spaces without hunting for them</h3>
            <p className="muted">
              Settings should feel like the control room for the full platform, not an old admin page.
            </p>
          </div>
        </div>

        <div className="settings-route-grid">
          {PLATFORM_LINKS.map((item) => (
            <Link className="settings-route-card" href={item.href} key={item.href}>
              <strong>{item.label}</strong>
              <p>{item.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      {hasOperationsWorkspace ? (
        <section className="panel settings-section">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Operations workspace</p>
              <h3>Internal dashboard preferences</h3>
              <p className="muted">
                These only affect the internal operations surfaces, not Ember, Sol, or Surge.
              </p>
            </div>
          </div>

          <div className="form-grid">
          <label className="field">
            <span>Dashboard mode</span>
            <select
              onChange={(event) =>
                settings.updateUserSettings((current) => ({
                  ...current,
                  preferredDashboardMode: event.target.value as typeof current.preferredDashboardMode,
                }))
              }
              value={settings.userSettings.preferredDashboardMode}
            >
              <option value="auto">Auto by role</option>
              {userContext.allowedModes.map((mode) => (
                <option key={mode} value={mode}>
                  {settings.dashboardModeLabel(mode)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Most important card first</span>
            <select
              onChange={(event) =>
                settings.updateUserSettings((current) => ({
                  ...current,
                  primaryMetric: event.target.value as typeof current.primaryMetric,
                }))
              }
              value={settings.userSettings.primaryMetric}
            >
              <option value="urgent">Urgent due dates</option>
              <option value="overdue">Overdue work</option>
              <option value="missing-docs">Missing documents</option>
              <option value="my-queue">My queue</option>
            </select>
          </label>
          </div>
        </section>
      ) : null}

      {canManageOrg ? (
        <>
          <section className="panel settings-section" id="account">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Organization admin</p>
                <h3>Rename internal role titles</h3>
                <p className="muted">
                  These labels belong to the internal operations side of the company stack, not the consumer app names.
                </p>
              </div>
            </div>

            <div className="form-grid">
              {PLATFORM_ROLES.map((role) => (
                <label className="field" key={role}>
                  <span>{role.toUpperCase()}</span>
                  <input
                    onChange={(event) =>
                      settings.updateOrgSettings((current) => ({
                        ...current,
                        roleLabels: {
                          ...current.roleLabels,
                          [role]: event.target.value,
                        },
                      }))
                    }
                    value={settings.orgSettings.roleLabels[role]}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="panel settings-section">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Organization admin</p>
                <h3>Assign internal access, teams, and roles</h3>
              </div>
            </div>

            <div className="settings-user-list">
              {users.map((user) => (
                <article className="settings-user-card" key={user.id}>
                  <label className="field">
                    <span>User</span>
                    <input
                      onChange={(event) =>
                        updateManagedUser(user.id, (current) => ({
                          ...current,
                          displayName: event.target.value,
                        }))
                      }
                      value={user.displayName}
                    />
                  </label>

                  <p className="muted">{user.email}</p>

                  <div className="checkbox-grid">
                    <div>
                      <p className="eyebrow">Roles</p>
                      {PLATFORM_ROLES.map((role) => (
                        <label className="checkbox-row" key={`${user.id}-${role}`}>
                          <input
                            checked={user.roles.includes(role)}
                            onChange={(event) =>
                              updateManagedUser(user.id, (current) => ({
                                ...current,
                                roles: event.target.checked
                                  ? [...current.roles, role]
                                  : current.roles.filter((value) => value !== role),
                              }))
                            }
                            type="checkbox"
                          />
                          <span>{settings.roleLabel(role)}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <p className="eyebrow">Teams</p>
                      {TEAM_OPTIONS.map((team) => (
                        <label className="checkbox-row" key={`${user.id}-${team}`}>
                          <input
                            checked={user.teams.includes(team)}
                            onChange={(event) =>
                              updateManagedUser(user.id, (current) => ({
                                ...current,
                                teams: event.target.checked
                                  ? [...current.teams, team]
                                  : current.teams.filter((value) => value !== team),
                              }))
                            }
                            type="checkbox"
                          />
                          <span>{team}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    className="primary-button"
                    disabled={savingUserId === user.id}
                    onClick={() => saveManagedUser(user)}
                    type="button"
                  >
                    {savingUserId === user.id ? "Saving..." : "Save Access"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {message ? <p className="form-message panel">{message}</p> : null}
    </div>
  );
}
