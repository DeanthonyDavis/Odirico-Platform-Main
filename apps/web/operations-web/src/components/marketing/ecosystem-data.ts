import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";

export const ECOSYSTEM_NAME = "Odirico Platform";

export type RouteSearchDestination = {
  href: string;
  label: string;
  description: string;
  tag: string;
  requiresAuth?: boolean;
};

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  audience: string;
  ctaLabel: string;
  ctaHref: string;
  features: readonly string[];
  highlight?: boolean;
  badge?: string;
};

export type InstallDestination = {
  id: string;
  label: string;
  family: "desktop" | "mobile" | "browser";
  summary: string;
  detail: string;
  statusLabel: string;
  availability: "available" | "guide" | "soon";
  ctaLabel: string;
  href: string;
};

export const ECOSYSTEM_TAGLINE =
  "Plan your time, manage your money, and track your future across one connected system.";

export const MARKETING_PRIMARY_LINKS = [
  { href: "/system", label: "System" },
  { href: "/apps", label: "Apps" },
] as const;

export const PLATFORM_SUPPORT_POINTS = [
  {
    title: "One account everywhere",
    copy: "Move from planning to money to applications without rebuilding the same context three times.",
  },
  {
    title: "Low-friction installs",
    copy: "Start in the browser anywhere, then use the install flow in Chrome, Edge, or Safari when you are ready to pin the platform to desktop or mobile.",
  },
  {
    title: "Shared memory by design",
    copy: "The important signal from one app can follow you into the next instead of disappearing in another tool.",
  },
] as const;

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

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "to start",
    audience: "Explore the system and open the web platform.",
    ctaLabel: "Start free",
    ctaHref: "/signup",
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
    ctaLabel: "Choose Pro",
    ctaHref: "/signup",
    highlight: true,
    badge: "Recommended",
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
    ctaLabel: "Choose Semester",
    ctaHref: "/signup",
    features: [
      "Discounted ecosystem access for longer planning cycles",
      "Ideal for school plus work plus application seasons",
      "One plan that covers all current consumer modules",
    ],
  },
] as const;

export const PRICING_PROOF_POINTS = [
  {
    title: "One plan across the ecosystem",
    copy: "You are unlocking Ember, Sol, and Surge together instead of stacking separate subscriptions for separate life problems.",
  },
  {
    title: "Start free without getting stranded",
    copy: "The free tier is meant to let you understand the shell, routes, and install flow before you commit to a paid rhythm.",
  },
  {
    title: "Built for overlapping seasons",
    copy: "School pressure, money pressure, and application pressure usually happen at the same time. The pricing model is shaped around that reality.",
  },
] as const;

export const PRICING_FAQS = [
  {
    question: "Does one subscription unlock every app?",
    answer:
      "Yes. Paid ecosystem access applies across Ember, Sol, and Surge instead of making you manage separate consumer subscriptions.",
  },
  {
    question: "Can I start on the free plan?",
    answer:
      "Yes. The free tier is the entry point for exploring the web platform, shared account shell, and current install flow before upgrading.",
  },
  {
    question: "Will pricing change by app later?",
    answer:
      "The current direction is one connected consumer plan model. If pricing changes in the future, it will still be framed around the platform, not disconnected app billing.",
  },
  {
    question: "Do I need to install the app to use it?",
    answer:
      "No. You can start in the browser first and install the platform later on desktop or mobile without changing the product you are using.",
  },
] as const;

export const INSTALL_SURFACES = [
  {
    id: "iphone",
    label: "iPhone / iPad",
    copy: "Open the platform in Safari, tap Share, then Add to Home Screen. App Store packaging is still being prepared, so the web install is the live iPhone path today.",
  },
  {
    id: "android",
    label: "Android / Samsung",
    copy: "Open the platform in Chrome, use Install App or Add to Home screen, then launch any module from the same shared shell. Play Store submission is the next mobile release step.",
  },
  {
    id: "desktop",
    label: "Desktop",
    copy: "Use Edge or Chrome to install the platform on desktop today. Signed native Windows distribution is being prepared before it is offered publicly again.",
  },
  {
    id: "web",
    label: "Browser access",
    copy: "If you are not ready to install, open the platform in the browser and route directly into the module you want to use.",
  },
] as const;

export const INSTALL_DESTINATIONS: readonly InstallDestination[] = [
  {
    id: "windows",
    label: "Windows desktop",
    family: "desktop",
    summary: "Install the platform from Chrome or Edge on Windows today.",
    detail: "The public binary download has been paused while code signing and trusted Windows distribution are being put in place.",
    statusLabel: "Recommended now",
    availability: "guide",
    ctaLabel: "Windows steps",
    href: "#desktop-guide",
  },
  {
    id: "macos",
    label: "macOS desktop",
    family: "desktop",
    summary: "Keep using the browser install flow on macOS for now.",
    detail: "The shared platform works in the browser today, and native macOS packaging is staged after the Windows installer path is finished.",
    statusLabel: "Guide available",
    availability: "guide",
    ctaLabel: "macOS steps",
    href: "#desktop-guide",
  },
  {
    id: "linux",
    label: "Linux desktop",
    family: "desktop",
    summary: "Use the browser-based platform on Linux today.",
    detail: "Linux stays on the browser install path while the native desktop release flow is expanded beyond Windows.",
    statusLabel: "Guide available",
    availability: "guide",
    ctaLabel: "Linux steps",
    href: "#desktop-guide",
  },
  {
    id: "iphone-download",
    label: "iPhone and iPad",
    family: "mobile",
    summary: "Use Add to Home Screen from Safari today.",
    detail: "The mobile web install is live now, and the App Store package is still being finalized.",
    statusLabel: "Web install live",
    availability: "guide",
    ctaLabel: "iPhone steps",
    href: "#ios-guide",
  },
  {
    id: "android-download",
    label: "Android",
    family: "mobile",
    summary: "Use Chrome install or Add to Home screen on Android today.",
    detail: "The Android mobile web path is live now, and the Play Store package is the next release step.",
    statusLabel: "Web install live",
    availability: "guide",
    ctaLabel: "Android steps",
    href: "#android-guide",
  },
  {
    id: "browser-download",
    label: "Browser access",
    family: "browser",
    summary: "Start in the browser immediately if you are not ready to install yet.",
    detail: "Open the same routes on the web first, then install later without changing products.",
    statusLabel: "Always available",
    availability: "available",
    ctaLabel: "Open browser",
    href: "/login?next=/overview",
  },
] as const;

export const WHY_IT_EXISTS = [
  "Most products only solve one category of life pressure at a time.",
  "Students and early-career users end up rebuilding the same context across schedules, money tools, and opportunity trackers.",
  "Odirico Platform exists to make Ember, Sol, and Surge feel like one connected system instead of three disconnected apps.",
] as const;

export const TRUST_PROMISES = [
  {
    title: "Private by default",
    copy: "Trust, privacy, and browser consent are treated as part of the product baseline, not an afterthought.",
  },
  {
    title: "Accessible enough to grow with",
    copy: "The shared shell is being shaped around readable structure, keyboard reachability, and clear focus states.",
  },
  {
    title: "Built for real life overlap",
    copy: "The platform is meant to help when school, money, and opportunity are all moving at once, not only when life is tidy.",
  },
] as const;

export const PUBLIC_SEARCH_DESTINATIONS: readonly RouteSearchDestination[] = [
  {
    href: "/system",
    label: "System",
    description: "See how Ember, Sol, and Surge fit together inside one connected product.",
    tag: "Public",
  },
  {
    href: "/apps",
    label: "Apps",
    description: "Browse the three consumer apps and what each one owns inside the ecosystem.",
    tag: "Public",
  },
  {
    href: "/pricing",
    label: "Pricing",
    description: "Compare the Free, Pro, and Semester plans for the connected platform.",
    tag: "Plans",
  },
  {
    href: "/install",
    label: "Install",
    description: "See desktop and mobile install steps, or keep using the browser.",
    tag: "Setup",
  },
  {
    href: "/about",
    label: "About",
    description: "Read the platform story and why Odirico exists as one connected system.",
    tag: "Public",
  },
  {
    href: "/privacy",
    label: "Privacy policy",
    description: "Review data handling, security basics, and platform privacy commitments.",
    tag: "Trust",
  },
  {
    href: "/terms",
    label: "Terms & conditions",
    description: "Read the baseline terms for using Odirico across web, mobile, and desktop.",
    tag: "Trust",
  },
  {
    href: "/cookies",
    label: "Cookie policy",
    description: "Learn how browser storage and consent work on the platform today.",
    tag: "Trust",
  },
  {
    href: "/disclaimer",
    label: "Disclaimer",
    description: "Review product, AI, accessibility, and reliance limitations.",
    tag: "Trust",
  },
  {
    href: "/delete-account",
    label: "Delete account",
    description: "Request deletion of your Odirico account and associated platform data.",
    tag: "Trust",
  },
  {
    href: "/login",
    label: "Log in",
    description: "Sign in to the shared Odirico platform shell.",
    tag: "Access",
  },
  {
    href: "/signup",
    label: "Get started",
    description: "Create an account and open the platform.",
    tag: "Access",
  },
  ...ODIRICO_ECOSYSTEM_APPS.map((app) => ({
    href: app.href,
    label: app.label,
    description: app.summary,
    tag: "App",
    requiresAuth: true,
  })),
] as const;

export const PLATFORM_SEARCH_DESTINATIONS: readonly RouteSearchDestination[] = [
  {
    href: "/overview",
    label: "Overview",
    description: "Open the shared consumer command center for Ember, Sol, and Surge.",
    tag: "Platform",
    requiresAuth: true,
  },
  {
    href: "/billing",
    label: "Billing",
    description: "Review plans, entitlements, and the shared ecosystem billing surface.",
    tag: "Platform",
    requiresAuth: true,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Adjust account-level settings and platform preferences.",
    tag: "Platform",
    requiresAuth: true,
  },
  ...ODIRICO_ECOSYSTEM_APPS.map((app) => ({
    href: app.href,
    label: app.label,
    description: app.summary,
    tag: "App",
    requiresAuth: true,
  })),
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
