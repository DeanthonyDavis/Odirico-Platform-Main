export const PLATFORM_ROLES = ["pm", "qc", "designer", "client", "admin"] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const DASHBOARD_MODES = [
  "pm",
  "qc",
  "designer",
  "distribution",
  "transmission",
  "client"
] as const;

export type DashboardMode = (typeof DASHBOARD_MODES)[number];
