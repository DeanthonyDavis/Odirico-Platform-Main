export type OdiricoInsightTone = "good" | "watch" | "urgent" | "info";

export type OdiricoInsight = {
  id: string;
  title: string;
  body: string;
  tone: OdiricoInsightTone;
  source: "surge" | "sol" | "ember" | "system";
};

export type OdiricoCrossAppSignal = {
  id: string;
  source: "surge" | "sol" | "ember";
  title: string;
  detail: string;
  dueLabel?: string;
};

export type OdiricoSurgeApplication = {
  id: string;
  company: string;
  role: string;
  location: string;
  status: "saved" | "applied" | "interviewing" | "offered" | "closed";
  source: string;
  nextAction: string;
  nextActionDate: string;
  dateApplied?: string;
  contact?: string;
};

export type OdiricoSurgeAnalytics = {
  applicationsThisMonth: number;
  responseRate: number;
  avgDaysToResponse: number;
  interviewRate: number;
};

export type OdiricoSurgeSnapshot = {
  summary: {
    savedLeads: number;
    activeApplications: number;
    interviews: number;
    offers: number;
  };
  analytics: OdiricoSurgeAnalytics;
  applications: readonly OdiricoSurgeApplication[];
};

export type OdiricoBudgetCategory = {
  id: string;
  label: string;
  spent: number;
  budget: number;
  trend: "up" | "flat" | "down";
};

export type OdiricoGoal = {
  id: string;
  title: string;
  category: "savings" | "health" | "learning" | "career";
  current: number;
  target: number;
  unit: string;
  deadline: string;
};

export type OdiricoEnergySlot = {
  day: string;
  block: "morning" | "midday" | "afternoon" | "evening";
  level: "low" | "medium" | "high";
};

export type OdiricoSolSnapshot = {
  summary: {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    creditUtilization: number;
  };
  budgets: readonly OdiricoBudgetCategory[];
  goals: readonly OdiricoGoal[];
  energyProfile: readonly OdiricoEnergySlot[];
  billReminders: readonly {
    id: string;
    title: string;
    dueDate: string;
    amount: number;
  }[];
};

export type OdiricoCourse = {
  id: string;
  title: string;
  professor: string;
  difficulty: "medium" | "high" | "intense";
  currentGrade: string;
  risk: "healthy" | "watch" | "urgent";
};

export type OdiricoAssignment = {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  weight: number;
  estimatedHours: number;
  status: "not-started" | "in-progress" | "submitted";
};

export type OdiricoExam = {
  id: string;
  courseId: string;
  title: string;
  date: string;
  weight: number;
  readiness: "low" | "medium" | "high";
};

export type OdiricoStudyBlock = {
  id: string;
  title: string;
  courseId?: string;
  day: string;
  start: string;
  end: string;
  source: "ember" | "sol" | "surge";
  focus: string;
};

export type OdiricoEmberSnapshot = {
  summary: {
    dueThisWeek: number;
    upcomingExams: number;
    plannedStudyHours: number;
    completedFocusBlocks: number;
    completionRate: number;
  };
  semester: {
    name: string;
    progress: number;
    creditsCompleted: number;
    creditsTarget: number;
  };
  courses: readonly OdiricoCourse[];
  assignments: readonly OdiricoAssignment[];
  exams: readonly OdiricoExam[];
  studyPlan: readonly OdiricoStudyBlock[];
};

export type OdiricoConnectorStatus = {
  key: string;
  label: string;
  status: "connected" | "syncing" | "attention";
  detail: string;
};

export type OdiricoEcosystemSnapshot = {
  generatedAt: string;
  profile: {
    name: string;
    semester: string;
    focus: string;
  };
  overview: {
    dailyFocus: string;
    momentumScore: number;
    crossAppSignals: readonly OdiricoCrossAppSignal[];
    insights: readonly OdiricoInsight[];
  };
  surge: OdiricoSurgeSnapshot;
  sol: OdiricoSolSnapshot;
  ember: OdiricoEmberSnapshot;
  connectors: readonly OdiricoConnectorStatus[];
};

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function ratio(current: number, target: number) {
  if (!target) return 0;
  return Math.max(0, Math.min(1, current / target));
}

export function scoreToBand(value: number): OdiricoInsightTone {
  if (value >= 80) return "good";
  if (value >= 60) return "info";
  if (value >= 45) return "watch";
  return "urgent";
}

export function budgetUtilization(category: OdiricoBudgetCategory) {
  return ratio(category.spent, category.budget);
}

export function goalCompletion(goal: OdiricoGoal) {
  return ratio(goal.current, goal.target);
}

export function highEnergyWindows(slots: readonly OdiricoEnergySlot[]) {
  return slots.filter((slot) => slot.level === "high");
}

export function courseLookup(snapshot: OdiricoEmberSnapshot) {
  return new Map(snapshot.courses.map((course) => [course.id, course]));
}

export function assignmentsDueSoon(snapshot: OdiricoEmberSnapshot) {
  return snapshot.assignments
    .slice()
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate));
}

export function highestRiskCourses(snapshot: OdiricoEmberSnapshot) {
  const rank = { urgent: 0, watch: 1, healthy: 2 } as const;
  return snapshot.courses
    .slice()
    .sort((left, right) => rank[left.risk] - rank[right.risk]);
}

export const ODIRICO_ECOSYSTEM_SNAPSHOT: OdiricoEcosystemSnapshot = {
  generatedAt: "2026-04-14T12:00:00.000Z",
  profile: {
    name: "DeAnthony Davis",
    semester: "Spring 2026",
    focus: "Ship the integrated student operating system with career momentum intact.",
  },
  overview: {
    dailyFocus: "Protect the academic calendar, land the next internship, and keep cash flow predictable.",
    momentumScore: 78,
    crossAppSignals: [
      {
        id: "signal-thermo",
        source: "sol",
        title: "Utility bill hits Friday",
        detail: "Ember should preserve a low-friction admin block on Thursday evening.",
        dueLabel: "Due Apr 17",
      },
      {
        id: "signal-shell",
        source: "surge",
        title: "Shell follow-up is due",
        detail: "Create a recruiter touchpoint and keep Friday morning clear for the outreach.",
        dueLabel: "Follow up Apr 18",
      },
      {
        id: "signal-calc",
        source: "ember",
        title: "Calculus exam prep needs a ramp-up",
        detail: "Shift two high-energy study blocks into Tuesday and Wednesday.",
        dueLabel: "Exam Apr 22",
      },
    ],
    insights: [
      {
        id: "insight-runway",
        source: "sol",
        tone: "watch",
        title: "Groceries are running 12% hot",
        body: "You are still inside monthly margin, but Sol should trim the final two shopping runs to protect savings rate.",
      },
      {
        id: "insight-career",
        source: "surge",
        tone: "good",
        title: "Interview rate is ahead of baseline",
        body: "Your active pipeline is converting better than the last cycle. Keep the follow-up cadence tight rather than widening the search blindly.",
      },
      {
        id: "insight-academic",
        source: "ember",
        tone: "urgent",
        title: "Calculus has become the academic risk point",
        body: "The scheduler should front-load review before labs and protect recovery so you do not burn down performance across the week.",
      },
    ],
  },
  surge: {
    summary: {
      savedLeads: 14,
      activeApplications: 9,
      interviews: 3,
      offers: 1,
    },
    analytics: {
      applicationsThisMonth: 18,
      responseRate: 42,
      avgDaysToResponse: 8,
      interviewRate: 21,
    },
    applications: [
      {
        id: "surge-shell",
        company: "Shell",
        role: "Project Engineer Intern",
        location: "Houston, TX",
        status: "interviewing",
        source: "Direct",
        nextAction: "Send thank-you and confirm interview prep packet",
        nextActionDate: "2026-04-18",
        dateApplied: "2026-04-05",
        contact: "Campus recruiter",
      },
      {
        id: "surge-kbr",
        company: "KBR",
        role: "Systems Engineering Intern",
        location: "Houston, TX",
        status: "applied",
        source: "LinkedIn",
        nextAction: "Check recruiter inbox and nudge if no signal",
        nextActionDate: "2026-04-21",
        dateApplied: "2026-04-09",
      },
      {
        id: "surge-bwxt",
        company: "BWX Technologies",
        role: "Electrical Engineering Co-op",
        location: "Lynchburg, VA",
        status: "saved",
        source: "Indeed",
        nextAction: "Tailor resume to nuclear systems language",
        nextActionDate: "2026-04-16",
      },
      {
        id: "surge-cnp",
        company: "CenterPoint Energy",
        role: "Electrical Engineering Summer Internship",
        location: "Houston, TX",
        status: "offered",
        source: "Direct",
        nextAction: "Compare compensation with current finance plan",
        nextActionDate: "2026-04-19",
        dateApplied: "2026-03-28",
      },
    ],
  },
  sol: {
    summary: {
      netWorth: 18420,
      monthlyIncome: 3220,
      monthlyExpenses: 2410,
      savingsRate: 25,
      creditUtilization: 18,
    },
    budgets: [
      { id: "rent", label: "Housing", spent: 960, budget: 960, trend: "flat" },
      { id: "groceries", label: "Groceries", spent: 426, budget: 380, trend: "up" },
      { id: "transport", label: "Transport", spent: 110, budget: 160, trend: "down" },
      { id: "tuition", label: "School", spent: 520, budget: 600, trend: "flat" },
      { id: "career", label: "Career tools", spent: 74, budget: 120, trend: "flat" },
    ],
    goals: [
      { id: "goal-emergency", title: "Emergency buffer", category: "savings", current: 5022, target: 10000, unit: "$", deadline: "2026-12-31" },
      { id: "goal-credit", title: "Credit utilization under 15%", category: "career", current: 18, target: 15, unit: "%", deadline: "2026-06-30" },
      { id: "goal-cert", title: "Power systems credential", category: "learning", current: 3, target: 6, unit: "modules", deadline: "2026-08-15" },
    ],
    energyProfile: [
      { day: "Mon", block: "morning", level: "high" },
      { day: "Mon", block: "midday", level: "medium" },
      { day: "Tue", block: "morning", level: "high" },
      { day: "Tue", block: "afternoon", level: "high" },
      { day: "Wed", block: "morning", level: "medium" },
      { day: "Wed", block: "evening", level: "low" },
      { day: "Thu", block: "afternoon", level: "high" },
      { day: "Fri", block: "morning", level: "medium" },
      { day: "Sat", block: "morning", level: "high" },
      { day: "Sun", block: "evening", level: "low" },
    ],
    billReminders: [
      { id: "bill-phone", title: "Phone bill", dueDate: "2026-04-17", amount: 82 },
      { id: "bill-cc", title: "Credit card autopay", dueDate: "2026-04-19", amount: 140 },
    ],
  },
  ember: {
    summary: {
      dueThisWeek: 5,
      upcomingExams: 2,
      plannedStudyHours: 14,
      completedFocusBlocks: 9,
      completionRate: 82,
    },
    semester: {
      name: "Spring 2026",
      progress: 68,
      creditsCompleted: 46,
      creditsTarget: 60,
    },
    courses: [
      { id: "course-calc", title: "Calculus II", professor: "Dr. Navarro", difficulty: "intense", currentGrade: "B-", risk: "urgent" },
      { id: "course-circuits", title: "Circuit Analysis", professor: "Prof. Boone", difficulty: "high", currentGrade: "B+", risk: "watch" },
      { id: "course-techwrite", title: "Technical Writing", professor: "Dr. James", difficulty: "medium", currentGrade: "A-", risk: "healthy" },
      { id: "course-controls", title: "Intro to Controls", professor: "Prof. Aziz", difficulty: "high", currentGrade: "B", risk: "watch" },
    ],
    assignments: [
      { id: "assign-calc", courseId: "course-calc", title: "Series and convergence set", dueDate: "2026-04-16", weight: 12, estimatedHours: 4, status: "in-progress" },
      { id: "assign-circuits", courseId: "course-circuits", title: "Lab report 05", dueDate: "2026-04-18", weight: 10, estimatedHours: 3, status: "not-started" },
      { id: "assign-write", courseId: "course-techwrite", title: "Proposal revision", dueDate: "2026-04-19", weight: 8, estimatedHours: 2, status: "in-progress" },
      { id: "assign-controls", courseId: "course-controls", title: "MATLAB stability worksheet", dueDate: "2026-04-21", weight: 6, estimatedHours: 3, status: "not-started" },
    ],
    exams: [
      { id: "exam-calc", courseId: "course-calc", title: "Calculus II Midterm 3", date: "2026-04-22", weight: 18, readiness: "low" },
      { id: "exam-circuits", courseId: "course-circuits", title: "Circuit Analysis Lab Practical", date: "2026-04-25", weight: 15, readiness: "medium" },
    ],
    studyPlan: [
      { id: "block-1", title: "Calc review sprint", courseId: "course-calc", day: "Tue", start: "07:00", end: "09:00", source: "ember", focus: "Past quizzes and weak spots" },
      { id: "block-2", title: "Shell interview prep", day: "Fri", start: "08:00", end: "09:30", source: "surge", focus: "STAR stories and project examples" },
      { id: "block-3", title: "Bill admin + budget reset", day: "Thu", start: "19:00", end: "19:45", source: "sol", focus: "Pay bills and lock next week spend" },
      { id: "block-4", title: "Circuits lab write-up", courseId: "course-circuits", day: "Sat", start: "10:00", end: "12:00", source: "ember", focus: "Graphs, analysis, and export" },
    ],
  },
  connectors: [
    { key: "google-calendar", label: "Google Calendar", status: "connected", detail: "Classes, interview blocks, and focus sessions are flowing into the unified timeline." },
    { key: "gmail", label: "Gmail / recruiter inbox", status: "connected", detail: "Surge email parsing is active for interview and follow-up signals." },
    { key: "outlook", label: "Outlook", status: "syncing", detail: "Secondary calendar polling is healthy and catching campus invites." },
    { key: "canvas", label: "Canvas / LMS", status: "attention", detail: "Assignment import schema is ready, but the live connector still needs token wiring." },
  ],
};

export function getOdiricoEcosystemSnapshot() {
  return ODIRICO_ECOSYSTEM_SNAPSHOT;
}
