export type OdiricoAppKey = "poleqa" | "ember" | "sol" | "surge";

export type OdiricoConsumerAppKey = Exclude<OdiricoAppKey, "poleqa">;

export type OdiricoAppStatus = "live" | "active-build" | "prototype";

export type OdiricoAppFamily = "operations" | "ecosystem";

export type OdiricoInstallSurface = "web" | "ios" | "android" | "desktop";

export type OdiricoInstallAvailability = "live" | "guided" | "coming-soon";

export type OdiricoInstallTarget = {
  surface: OdiricoInstallSurface;
  label: string;
  href: string;
  availability: OdiricoInstallAvailability;
  note: string;
};

export type OdiricoAppDefinition = {
  key: OdiricoAppKey;
  family: OdiricoAppFamily;
  label: string;
  href: string;
  accessHref: string;
  status: OdiricoAppStatus;
  statusLabel: string;
  tagline: string;
  summary: string;
  audience: string;
  platformRole: string;
  integrationRole: string;
  logoPath: string;
  workspaceRoot: string;
  installTargets: readonly OdiricoInstallTarget[];
};

export type OdiricoOperationsAppDefinition = OdiricoAppDefinition & {
  family: "operations";
};

export type OdiricoEcosystemAppDefinition = OdiricoAppDefinition & {
  family: "ecosystem";
  key: OdiricoConsumerAppKey;
};

function createConsumerInstallTargets(
  key: OdiricoConsumerAppKey,
  href: string,
): readonly OdiricoInstallTarget[] {
  return [
    {
      surface: "web",
      label: "Open web",
      href: `/login?next=${href}`,
      availability: "live",
      note: "Open the shared Odirico platform in your browser and land directly in this module.",
    },
    {
      surface: "ios",
      label: "iPhone",
      href: `/install#${key}-ios`,
      availability: "guided",
      note: "Install the shared Odirico platform on iPhone and launch directly into this module.",
    },
    {
      surface: "android",
      label: "Android",
      href: `/install#${key}-android`,
      availability: "guided",
      note: "Install the shared Odirico platform from Chrome on Android or Samsung devices.",
    },
    {
      surface: "desktop",
      label: "Mac / PC",
      href: `/install#${key}-desktop`,
      availability: "guided",
      note: "Install the shared Odirico platform in a desktop browser, then open this module from the sidebar.",
    },
  ] as const;
}

export const ODIRICO_APPS: readonly OdiricoAppDefinition[] = [
  {
    key: "poleqa",
    family: "operations",
    label: "PoleQA",
    href: "/dashboard",
    accessHref: "/dashboard",
    status: "live",
    statusLabel: "Live",
    tagline: "Inspection, QA/QC ticketing, and review operations.",
    summary:
      "The live infrastructure operations workspace for inspection, documentation, and closeout-heavy delivery teams.",
    audience: "Infrastructure delivery teams",
    platformRole: "Operations workspace",
    integrationRole: "Separate operational product inside Odirico",
    logoPath: "/assets/logo-icon.svg",
    workspaceRoot: "D:\\Odirico\\apps\\web\\operations-web",
    installTargets: [
      {
        surface: "web",
        label: "Open workspace",
        href: "/dashboard",
        availability: "live",
        note: "PoleQA currently lives as an authenticated web workspace.",
      },
    ],
  },
  {
    key: "ember",
    family: "ecosystem",
    label: "Ember",
    href: "/ember",
    accessHref: "/login?next=/ember",
    status: "prototype",
    statusLabel: "Focused build",
    tagline: "Student rhythm, recovery, planning, and short-term stability.",
    summary:
      "A daily system for school, energy, routines, assignments, and recovery inside the connected Odirico platform.",
    audience: "Students and young adults managing week-to-week life load",
    platformRole: "Time and recovery system",
    integrationRole: "Owns time, energy, and day structure",
    logoPath: "/branding/ember.jpg",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\Ember",
    installTargets: createConsumerInstallTargets("ember", "/ember"),
  },
  {
    key: "sol",
    family: "ecosystem",
    label: "Sol",
    href: "/sol",
    accessHref: "/login?next=/sol",
    status: "active-build",
    statusLabel: "Active build",
    tagline: "Money direction, credit strategy, and long-range planning.",
    summary:
      "A financial and future-planning system for credit, goals, decisions, and steady long-term movement.",
    audience: "Users building long-term financial direction and future planning",
    platformRole: "Money and strategy system",
    integrationRole: "Owns money, goals, and future direction",
    logoPath: "/branding/sol.jpg",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\Sol",
    installTargets: createConsumerInstallTargets("sol", "/sol"),
  },
  {
    key: "surge",
    family: "ecosystem",
    label: "Surge",
    href: "/surge",
    accessHref: "/login?next=/surge",
    status: "live",
    statusLabel: "Live",
    tagline: "Apply anywhere. Surge keeps the record.",
    summary:
      "A universal application command center that captures signals, organizes attempts, and keeps the search memory clean inside the live platform route.",
    audience: "Job seekers and internship applicants",
    platformRole: "Execution and application system",
    integrationRole: "Owns opportunities, applications, and momentum",
    logoPath: "/branding/surge.jpg",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\tools\\surge",
    installTargets: createConsumerInstallTargets("surge", "/surge"),
  },
] as const;

function isOperationsApp(
  app: OdiricoAppDefinition,
): app is OdiricoOperationsAppDefinition {
  return app.family === "operations";
}

function isEcosystemApp(
  app: OdiricoAppDefinition,
): app is OdiricoEcosystemAppDefinition {
  return app.family === "ecosystem";
}

export const ODIRICO_OPERATIONS_APPS = ODIRICO_APPS.filter(isOperationsApp);

export const ODIRICO_ECOSYSTEM_APPS = ODIRICO_APPS.filter(isEcosystemApp);

export function getOdiricoApp(key: OdiricoAppKey) {
  return ODIRICO_APPS.find((app) => app.key === key) ?? ODIRICO_APPS[0];
}

export function getOdiricoEcosystemApp(key: OdiricoConsumerAppKey) {
  return (
    ODIRICO_ECOSYSTEM_APPS.find((app) => app.key === key) ??
    ODIRICO_ECOSYSTEM_APPS[0]
  );
}
