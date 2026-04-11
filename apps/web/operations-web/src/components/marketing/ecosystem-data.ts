import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";

export const ECOSYSTEM_NAME = "Odirico Platform";

export const ECOSYSTEM_TAGLINE =
  "Plan your time, manage your money, and track your future across one connected system.";

export const SYSTEM_PILLARS = [
  {
    title: "One login",
    copy: "Start once and move across Ember, Sol, and Surge without re-authenticating or wondering which product you are inside.",
  },
  {
    title: "One subscription",
    copy: "Pricing unlocks the ecosystem together, so you do not have to manage separate plans for separate life problems.",
  },
  {
    title: "Shared memory",
    copy: "The platform is built so schedules, financial direction, and opportunity progress can inform each other instead of living in silos.",
  },
] as const;

export const CONNECTION_FLOWS = [
  {
    title: "Surge to Ember",
    copy: "Apply for a role in Surge, then carry interview timing, follow-up deadlines, and next actions into your weekly plan.",
  },
  {
    title: "Surge to Sol",
    copy: "Track pay ranges, offer details, and career direction in Surge, then let Sol anchor those decisions inside goals and money planning.",
  },
  {
    title: "Ember to Sol",
    copy: "The week you can actually sustain should shape the goals you set, the money decisions you make, and the pace you keep.",
  },
] as const;

export const PLATFORM_PRIORITIES = [
  {
    title: "Reduce switching cost",
    copy: "Life should not feel like separate dashboards for school, money, and momentum.",
  },
  {
    title: "Keep context alive",
    copy: "Important signals should follow you between modules instead of forcing re-entry and duplicate setup.",
  },
  {
    title: "Make action obvious",
    copy: "Every screen should clarify what matters next, not just display more information.",
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "to start",
    audience: "Explore the system and open the web platform.",
    features: [
      "Web access to Ember, Sol, and Surge routes",
      "Shared account and core ecosystem navigation",
      "Install the platform to phone or desktop browser",
    ],
  },
  {
    name: "Pro",
    price: "$14.99",
    cadence: "per month",
    audience: "For consistent weekly use across the full ecosystem.",
    features: [
      "Applies across Ember, Sol, and Surge",
      "Shared upgrades, sync surfaces, and automation layers",
      "Priority access to cross-app features as they ship",
    ],
  },
  {
    name: "Semester",
    price: "$59",
    cadence: "per term",
    audience: "For school cycles, internships, and focused growth windows.",
    features: [
      "Discounted ecosystem access for longer planning cycles",
      "Ideal for school plus work plus application seasons",
      "One plan that covers all current consumer modules",
    ],
  },
] as const;

export const INSTALL_SURFACES = [
  {
    id: "iphone",
    label: "iPhone / iPad",
    copy: "Open the platform in Safari, tap Share, then Add to Home Screen. Once installed, launch into Ember, Sol, or Surge from the platform navigation.",
  },
  {
    id: "android",
    label: "Android / Samsung",
    copy: "Open the platform in Chrome, use Install App or Add to Home screen, then launch any module from the same installed platform shell.",
  },
  {
    id: "desktop",
    label: "Mac / Windows",
    copy: "Use Chrome or Edge to install the Odirico Platform as a desktop app, then pin the modules you use most often in the sidebar.",
  },
  {
    id: "web",
    label: "Browser access",
    copy: "If you are not ready to install, open the platform in the browser and route directly into the module you want to use.",
  },
] as const;

export const WHY_IT_EXISTS = [
  "Most products only solve one category of life pressure at a time.",
  "Students and early-career users end up rebuilding the same context across schedules, money tools, and opportunity trackers.",
  "Odirico Platform exists to make Ember, Sol, and Surge feel like one connected system instead of three disconnected apps.",
] as const;

export const ECOSYSTEM_APP_STORIES = ODIRICO_ECOSYSTEM_APPS.map((app) => ({
  ...app,
  installHeadline:
    app.key === "ember"
      ? "Install once, then use Ember as your daily planning surface."
      : app.key === "sol"
        ? "Install once, then use Sol as your money and future layer."
        : "Install once, then use Surge as your execution and opportunity layer.",
}));
