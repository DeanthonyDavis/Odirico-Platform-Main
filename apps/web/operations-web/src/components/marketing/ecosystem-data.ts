import { ODIRICO_ECOSYSTEM_APPS } from "@odirico/core/apps";
import {
  BILLING_PLANS,
  type BillingPlanDefinition,
} from "@/lib/billing/plans";

export const ECOSYSTEM_NAME = "Odirico Platform";

export type RouteSearchDestination = {
  href: string;
  label: string;
  description: string;
  tag: string;
  requiresAuth?: boolean;
};

export type PricingPlan = BillingPlanDefinition;

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
  { href: "/apps", label: "Products" },
  { href: "/customers", label: "Customers" },
  { href: "/partners", label: "Partners" },
  { href: "/resources", label: "Resources" },
  { href: "/company", label: "Company" },
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

export const PRICING_PLANS: readonly PricingPlan[] = BILLING_PLANS;

export const PRICING_PROOF_POINTS = [
  {
    title: "Launch pricing is simple on purpose",
    copy: "Free, Basic, Pro, and Semester Pass are enough to explain the system without making early users decode a complicated pricing matrix.",
  },
  {
    title: "Free is enough to understand the system",
    copy: "People can open Ember, Sol, and Surge in preview mode, use simple dashboards, and see the ecosystem before paying.",
  },
  {
    title: "Paid access scales with commitment",
    copy: "Basic gives more room without forcing the full system, while Pro and Semester Pass unlock the full connected ecosystem.",
  },
] as const;

export const PRICING_FAQS = [
  {
    question: "What does Free include?",
    answer:
      "Free includes basic access across Ember, Sol, and Surge, simple dashboards, limited AI actions, and limited tracking or history so people can understand the system before upgrading.",
  },
  {
    question: "What does Basic include?",
    answer:
      "Basic is the starter paid plan at $7.99 per month. It opens lighter access across all three apps, gives you more history, better sync, more day-to-day planner or tracker use, and basic AI assistance without the full advanced layer.",
  },
  {
    question: "Does one subscription unlock every app?",
    answer:
      "Pro and Semester Pass unlock the full ecosystem across Ember, Sol, and Surge. Basic still spans the ecosystem, but with lighter limits than the full plans.",
  },
  {
    question: "Can I start on the free plan?",
    answer:
      "Yes. Free is designed to be genuinely usable enough to understand the product, not just a fake placeholder before billing.",
  },
  {
    question: "Where does the paywall apply?",
    answer:
      "The paywall still sits at the connected platform layer. Billing and account routes stay visible, while plan level determines how much access, history, AI, and depth you get across the product spaces.",
  },
  {
    question: "Why is there a Semester Pass?",
    answer:
      "Semester Pass gives students full Pro-level access with one semester payment instead of monthly billing. It is meant for academic cycles, internship pushes, and seasonal use.",
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
    href: "/apps",
    label: "Products",
    description: "Browse Ember, Sol, and Surge as the core product family.",
    tag: "Public",
  },
  {
    href: "/get-started",
    label: "Get started",
    description: "Choose between product tours, a product demo, or pricing and plans.",
    tag: "Access",
  },
  {
    href: "/product-tour",
    label: "Product tour",
    description: "Take a guided look at how the Odirico platform works without showing pricing first.",
    tag: "Tour",
  },
  {
    href: "/product-demo",
    label: "Product demo",
    description: "See the live system framing and the best route for getting a walkthrough.",
    tag: "Demo",
  },
  {
    href: "/customers",
    label: "Customers",
    description: "See who the platform is actually being shaped for.",
    tag: "Public",
  },
  {
    href: "/partners",
    label: "Partners",
    description: "Review how institutions, advisors, and support partners can fit around the product.",
    tag: "Public",
  },
  {
    href: "/resources",
    label: "Resources",
    description: "Open installation, trust, privacy, and practical product guidance.",
    tag: "Public",
  },
  {
    href: "/company",
    label: "Company",
    description: "Read the company story and how Odirico relates to the platform.",
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
    label: "Create account",
    description: "Create your Odirico account and move into billing when you are ready.",
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
  {
    href: "/settings#appearance",
    label: "Appearance",
    description: "Change the current platform theme, density, and layout preferences.",
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
