export type OdiricoAppKey = "poleqa" | "ember" | "sol" | "surge";

export type OdiricoAppStatus = "live" | "active-build" | "prototype";

export type OdiricoAppDefinition = {
  key: OdiricoAppKey;
  label: string;
  href: string;
  status: OdiricoAppStatus;
  statusLabel: string;
  tagline: string;
  summary: string;
  audience: string;
  platformRole: string;
  workspaceRoot: string;
};

export const ODIRICO_APPS: readonly OdiricoAppDefinition[] = [
  {
    key: "poleqa",
    label: "PoleQA",
    href: "/dashboard",
    status: "live",
    statusLabel: "Live",
    tagline: "Inspection, QA/QC ticketing, and review operations.",
    summary:
      "The live infrastructure operations workspace inside the unified Odirico platform shell.",
    audience: "Infrastructure delivery teams",
    platformRole: "Live operational workspace",
    workspaceRoot: "D:\\Odirico\\apps\\web\\operations-web",
  },
  {
    key: "ember",
    label: "Ember",
    href: "/ember",
    status: "prototype",
    statusLabel: "Prototype",
    tagline: "Daily survival, awareness, recovery, and short-term stability.",
    summary:
      "A mobile-first life operating system that blends planning, school, work, money, and recovery into one guided command center.",
    audience: "Individuals managing day-to-day stability and momentum",
    platformRole: "Personal operating system",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\Ember",
  },
  {
    key: "sol",
    label: "Sol",
    href: "/sol",
    status: "active-build",
    statusLabel: "Active build",
    tagline: "Long-term direction, credit optimization, goals, and strategy.",
    summary:
      "The long-range planning and financial direction layer designed to sit inside the same authenticated ecosystem.",
    audience: "Users planning medium- and long-term growth",
    platformRole: "Strategy and planning workspace",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\Sol",
  },
  {
    key: "surge",
    label: "Surge",
    href: "/surge",
    status: "active-build",
    statusLabel: "Active build",
    tagline: "Apply anywhere. Surge keeps the record.",
    summary:
      "A universal job and internship command center that captures signals, organizes applications, and updates the search memory.",
    audience: "Job seekers and internship applicants",
    platformRole: "Application command center",
    workspaceRoot: "D:\\Odirico\\Odirico-OS\\tools\\surge",
  },
] as const;

export function getOdiricoApp(key: OdiricoAppKey) {
  return ODIRICO_APPS.find((app) => app.key === key) ?? ODIRICO_APPS[0];
}
