import "./styles.css";

import {
  assignmentsDueSoon,
  budgetUtilization,
  courseLookup,
  currency,
  getOdiricoEcosystemSnapshot,
  goalCompletion,
  highestRiskCourses,
  highEnergyWindows,
  percent,
  scoreToBand,
  type OdiricoCrossAppSignal,
} from "../../../../packages/core/src/ecosystem";

type ModuleKey = "overview" | "ember" | "sol" | "surge";

const snapshot = getOdiricoEcosystemSnapshot();
const courseMap = courseLookup(snapshot.ember);
const dueAssignments = assignmentsDueSoon(snapshot.ember);
const riskCourses = highestRiskCourses(snapshot.ember);
const energyWindows = highEnergyWindows(snapshot.sol.energyProfile);

const moduleMeta: Record<
  ModuleKey,
  {
    label: string;
    subtitle: string;
    value: string;
    accentClass: string;
  }
> = {
  overview: {
    label: "Command Center",
    subtitle:
      "One operating surface for student execution, financial control, and internship momentum.",
    value: `${snapshot.overview.momentumScore}`,
    accentClass: "accent-overview",
  },
  ember: {
    label: "Ember",
    subtitle:
      "Academic scheduling, course risk detection, and focus planning built for semester pressure.",
    value: `${snapshot.ember.summary.dueThisWeek} due`,
    accentClass: "accent-ember",
  },
  sol: {
    label: "Sol",
    subtitle:
      "Cash flow, bills, goals, and energy planning that protect the rest of the system.",
    value: currency(snapshot.sol.summary.netWorth),
    accentClass: "accent-sol",
  },
  surge: {
    label: "Surge",
    subtitle:
      "Applications, follow-ups, and recruiter memory without losing the file trail.",
    value: `${snapshot.surge.summary.activeApplications} active`,
    accentClass: "accent-surge",
  },
};

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Desktop app root was not found.");
}

const app: HTMLDivElement = appRoot;

const state = {
  activeModule: "overview" as ModuleKey,
};

function pillClass(value: string) {
  const token = value.toLowerCase();

  if (["urgent", "offered", "high", "attention", "interviewing"].includes(token)) {
    return "pill pill-urgent";
  }

  if (["watch", "syncing", "medium", "applied", "in-progress"].includes(token)) {
    return "pill pill-watch";
  }

  if (["connected", "healthy", "good", "submitted"].includes(token)) {
    return "pill pill-good";
  }

  return "pill";
}

function insightClass(signal: OdiricoCrossAppSignal) {
  return `signal-card signal-${signal.source}`;
}

function renderProgressRow(label: string, detail: string, fill: number) {
  return `
    <div class="progress-row">
      <div class="progress-head">
        <span>${label}</span>
        <span>${detail}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${Math.max(0, Math.min(100, fill))}%"></div>
      </div>
    </div>
  `;
}

function renderOverviewMain() {
  return `
    <section class="surface-grid surface-grid-overview">
      <article class="surface-card surface-story">
        <p class="surface-kicker">Daily focus</p>
        <h3>${snapshot.overview.dailyFocus}</h3>
        <p>
          ${snapshot.profile.name} is running ${snapshot.profile.semester} with a shared
          operating brief designed to protect academics while the internship pipeline keeps moving.
        </p>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Momentum signals</p>
        <div class="metric-stack">
          <div>
            <span class="metric-label">Savings rate</span>
            <strong>${percent(snapshot.sol.summary.savingsRate)}</strong>
          </div>
          <div>
            <span class="metric-label">Interview rate</span>
            <strong>${percent(snapshot.surge.analytics.interviewRate)}</strong>
          </div>
          <div>
            <span class="metric-label">Study completion</span>
            <strong>${percent(snapshot.ember.summary.completionRate)}</strong>
          </div>
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Cross-app queue</p>
        <div class="signal-stack">
          ${snapshot.overview.crossAppSignals
            .map(
              (signal) => `
                <div class="${insightClass(signal)}">
                  <div>
                    <strong>${signal.title}</strong>
                    <p>${signal.detail}</p>
                  </div>
                  ${signal.dueLabel ? `<span class="signal-meta">${signal.dueLabel}</span>` : ""}
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">Connector health</p>
        <div class="connector-table">
          ${snapshot.connectors
            .map(
              (connector) => `
                <div class="connector-row">
                  <div>
                    <strong>${connector.label}</strong>
                    <p>${connector.detail}</p>
                  </div>
                  <span class="${pillClass(connector.status)}">${connector.status}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderEmberMain() {
  return `
    <section class="surface-grid">
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">Academic pressure</p>
        <div class="table-list">
          ${dueAssignments
            .map((assignment) => {
              const course = courseMap.get(assignment.courseId);
              return `
                <div class="table-row">
                  <div>
                    <strong>${assignment.title}</strong>
                    <p>${course?.title ?? "Course"} · ${assignment.estimatedHours}h block · due ${assignment.dueDate}</p>
                  </div>
                  <div class="row-end">
                    <span class="${pillClass(assignment.status)}">${assignment.status.replace("-", " ")}</span>
                    <span class="row-meta">${assignment.weight}%</span>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Semester progress</p>
        ${renderProgressRow(
          snapshot.ember.semester.name,
          `${snapshot.ember.semester.creditsCompleted}/${snapshot.ember.semester.creditsTarget} credits`,
          snapshot.ember.semester.progress,
        )}
        ${renderProgressRow(
          "Focus completion",
          `${snapshot.ember.summary.completedFocusBlocks} blocks closed`,
          snapshot.ember.summary.completionRate,
        )}
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Risk courses</p>
        <div class="table-list">
          ${riskCourses
            .map(
              (course) => `
                <div class="table-row">
                  <div>
                    <strong>${course.title}</strong>
                    <p>${course.professor} · ${course.currentGrade}</p>
                  </div>
                  <span class="${pillClass(course.risk)}">${course.risk}</span>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">Placed study blocks</p>
        <div class="study-grid">
          ${snapshot.ember.studyPlan
            .map(
              (block) => `
                <div class="study-card">
                  <span class="study-day">${block.day}</span>
                  <strong>${block.title}</strong>
                  <p>${block.start}-${block.end}</p>
                  <small>${block.focus}</small>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderSolMain() {
  return `
    <section class="surface-grid">
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">Budget control</p>
        <div class="progress-list">
          ${snapshot.sol.budgets
            .map((budget) =>
              renderProgressRow(
                budget.label,
                `${currency(budget.spent)} of ${currency(budget.budget)}`,
                budgetUtilization(budget) * 100,
              ),
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Cash posture</p>
        <div class="metric-stack">
          <div>
            <span class="metric-label">Income</span>
            <strong>${currency(snapshot.sol.summary.monthlyIncome)}</strong>
          </div>
          <div>
            <span class="metric-label">Expenses</span>
            <strong>${currency(snapshot.sol.summary.monthlyExpenses)}</strong>
          </div>
          <div>
            <span class="metric-label">Credit utilization</span>
            <strong>${percent(snapshot.sol.summary.creditUtilization)}</strong>
          </div>
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Goal ladder</p>
        <div class="table-list">
          ${snapshot.sol.goals
            .map(
              (goal) => `
                <div class="table-row">
                  <div>
                    <strong>${goal.title}</strong>
                    <p>${goal.deadline}</p>
                  </div>
                  <div class="row-end">
                    <span class="row-meta">${Math.round(goalCompletion(goal) * 100)}%</span>
                    <strong>${goal.unit === "$" ? currency(goal.current) : `${goal.current}${goal.unit}`}</strong>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">High-energy windows</p>
        <div class="window-grid">
          ${energyWindows
            .map(
              (slot) => `
                <div class="window-card">
                  <strong>${slot.day}</strong>
                  <p>${slot.block}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Upcoming bills</p>
        <div class="table-list">
          ${snapshot.sol.billReminders
            .map(
              (bill) => `
                <div class="table-row">
                  <div>
                    <strong>${bill.title}</strong>
                    <p>${bill.dueDate}</p>
                  </div>
                  <strong>${currency(bill.amount)}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderSurgeMain() {
  return `
    <section class="surface-grid">
      <article class="surface-card surface-span-2">
        <p class="surface-kicker">Application pipeline</p>
        <div class="table-list">
          ${snapshot.surge.applications
            .map(
              (application) => `
                <div class="table-row">
                  <div>
                    <strong>${application.company} · ${application.role}</strong>
                    <p>${application.location} · ${application.source}</p>
                  </div>
                  <div class="row-end">
                    <span class="${pillClass(application.status)}">${application.status}</span>
                    <span class="row-meta">${application.nextActionDate}</span>
                  </div>
                </div>
                <div class="row-subcopy">${application.nextAction}</div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Pipeline health</p>
        ${renderProgressRow(
          "Response rate",
          `${snapshot.surge.analytics.responseRate}% replied`,
          snapshot.surge.analytics.responseRate,
        )}
        ${renderProgressRow(
          "Interview rate",
          `${snapshot.surge.analytics.interviewRate}% converted`,
          snapshot.surge.analytics.interviewRate,
        )}
        ${renderProgressRow(
          "Volume this month",
          `${snapshot.surge.analytics.applicationsThisMonth} applications`,
          (snapshot.surge.analytics.applicationsThisMonth / 24) * 100,
        )}
      </article>
      <article class="surface-card">
        <p class="surface-kicker">Offer comparison</p>
        <h3 class="surface-stat">${snapshot.surge.summary.offers}</h3>
        <p class="surface-copy">
          The current CenterPoint offer should be checked against Sol before any deadline response
          is sent.
        </p>
      </article>
    </section>
  `;
}

function renderMainPanel(activeModule: ModuleKey) {
  if (activeModule === "ember") return renderEmberMain();
  if (activeModule === "sol") return renderSolMain();
  if (activeModule === "surge") return renderSurgeMain();
  return renderOverviewMain();
}

function renderRail(activeModule: ModuleKey) {
  const tone = scoreToBand(snapshot.overview.momentumScore);
  const moduleSummary =
    activeModule === "ember"
      ? `Academic load is centered on ${snapshot.ember.summary.dueThisWeek} deliverables and ${snapshot.ember.summary.upcomingExams} upcoming exams.`
      : activeModule === "sol"
        ? `Cash flow is stable, but groceries and bill timing still need active control this week.`
        : activeModule === "surge"
          ? `Pipeline quality is stronger than last cycle, so disciplined follow-up matters more than volume.`
          : `The integrated system is balanced, but calculus pressure and bill timing are the two forces most likely to destabilize the week.`;

  return `
    <aside class="rail">
      <section class="rail-card rail-brief">
        <p class="surface-kicker">AI brief</p>
        <h3>Operator summary</h3>
        <p>${moduleSummary}</p>
        <span class="${pillClass(tone)}">${tone}</span>
      </section>
      <section class="rail-card">
        <p class="surface-kicker">Next actions</p>
        <div class="rail-list">
          ${snapshot.overview.crossAppSignals
            .map(
              (signal) => `
                <div class="rail-list-item">
                  <strong>${signal.title}</strong>
                  <p>${signal.detail}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="rail-card">
        <p class="surface-kicker">Connectors</p>
        <div class="rail-list">
          ${snapshot.connectors
            .map(
              (connector) => `
                <div class="rail-list-item">
                  <div class="rail-label-row">
                    <strong>${connector.label}</strong>
                    <span class="${pillClass(connector.status)}">${connector.status}</span>
                  </div>
                  <p>${connector.detail}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
    </aside>
  `;
}

function renderMetrics(activeModule: ModuleKey) {
  if (activeModule === "ember") {
    return `
      <div class="hero-metrics">
        <div><span>Due this week</span><strong>${snapshot.ember.summary.dueThisWeek}</strong></div>
        <div><span>Exams</span><strong>${snapshot.ember.summary.upcomingExams}</strong></div>
        <div><span>Study hours</span><strong>${snapshot.ember.summary.plannedStudyHours}</strong></div>
      </div>
    `;
  }

  if (activeModule === "sol") {
    return `
      <div class="hero-metrics">
        <div><span>Savings rate</span><strong>${percent(snapshot.sol.summary.savingsRate)}</strong></div>
        <div><span>Monthly income</span><strong>${currency(snapshot.sol.summary.monthlyIncome)}</strong></div>
        <div><span>Bills this week</span><strong>${snapshot.sol.billReminders.length}</strong></div>
      </div>
    `;
  }

  if (activeModule === "surge") {
    return `
      <div class="hero-metrics">
        <div><span>Active applications</span><strong>${snapshot.surge.summary.activeApplications}</strong></div>
        <div><span>Interviews</span><strong>${snapshot.surge.summary.interviews}</strong></div>
        <div><span>Response rate</span><strong>${percent(snapshot.surge.analytics.responseRate)}</strong></div>
      </div>
    `;
  }

  return `
    <div class="hero-metrics">
      <div><span>Net worth</span><strong>${currency(snapshot.sol.summary.netWorth)}</strong></div>
      <div><span>Due this week</span><strong>${snapshot.ember.summary.dueThisWeek}</strong></div>
      <div><span>Applications</span><strong>${snapshot.surge.summary.activeApplications}</strong></div>
    </div>
  `;
}

function renderApp() {
  const meta = moduleMeta[state.activeModule];

  app.innerHTML = `
    <div class="desktop-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <p class="eyebrow">Odirico Desktop</p>
          <h1>Unified student operator workspace</h1>
          <p class="lede">${snapshot.profile.focus}</p>
        </div>
        <nav class="nav-list" aria-label="Desktop application modules">
          ${(
            [
              ["overview", "Overview"],
              ["ember", "Ember"],
              ["sol", "Sol"],
              ["surge", "Surge"],
            ] as const
          )
            .map(
              ([key, label]) => `
                <button
                  class="nav-item ${state.activeModule === key ? "is-active" : ""}"
                  data-module="${key}"
                  type="button"
                >
                  ${label}
                </button>
              `,
            )
            .join("")}
        </nav>
        <section class="sidebar-summary">
          <p class="eyebrow">System pulse</p>
          <strong class="sidebar-score">${snapshot.overview.momentumScore}</strong>
          <p class="sidebar-copy">Momentum score balances academics, money pressure, and career movement.</p>
        </section>
      </aside>
      <main class="workspace">
        <header class="hero ${meta.accentClass}">
          <div>
            <p class="toolbar-label">Desktop control plane</p>
            <h2>${meta.label}</h2>
            <p class="hero-copy">${meta.subtitle}</p>
          </div>
          <div class="hero-value-block">
            <span class="hero-value">${meta.value}</span>
            <span class="hero-generated">Updated ${snapshot.generatedAt.slice(0, 10)}</span>
          </div>
        </header>
        ${renderMetrics(state.activeModule)}
        <section class="workspace-layout">
          <div class="workspace-main">
            ${renderMainPanel(state.activeModule)}
          </div>
          ${renderRail(state.activeModule)}
        </section>
      </main>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextModule = button.dataset.module as ModuleKey | undefined;
      if (!nextModule || nextModule === state.activeModule) {
        return;
      }

      state.activeModule = nextModule;
      renderApp();
    });
  });
}

renderApp();
