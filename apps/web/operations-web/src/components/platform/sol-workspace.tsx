"use client";

import { useEffect, useMemo, useState } from "react";

import type { OdiricoBudgetCategory, OdiricoGoal } from "@odirico/core/ecosystem";
import {
  budgetUtilization,
  currency,
  getOdiricoEcosystemSnapshot,
  goalCompletion,
  percent,
} from "@odirico/core/ecosystem";

const STORAGE_KEY = "odirico-sol-live-v1";

type MoneyActionType = "income" | "expense" | "savings";

type OdiricoBillReminder = {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  paid?: boolean;
};

type DraftMoneyAction = {
  type: MoneyActionType;
  amount: string;
  categoryId: string;
};

const snapshot = getOdiricoEcosystemSnapshot();
const sol = snapshot.sol;

const defaultDraft: DraftMoneyAction = {
  type: "expense",
  amount: "50",
  categoryId: sol.budgets[0]?.id ?? "",
};

function loadState() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      budgets: OdiricoBudgetCategory[];
      goals: OdiricoGoal[];
      bills: OdiricoBillReminder[];
      netWorth: number;
      monthlyIncome: number;
      creditUtilization: number;
    };
  } catch {
    return null;
  }
}

export function SolWorkspace() {
  const [budgets, setBudgets] = useState<OdiricoBudgetCategory[]>(() => sol.budgets.slice());
  const [goals, setGoals] = useState<OdiricoGoal[]>(() => sol.goals.slice());
  const [bills, setBills] = useState<OdiricoBillReminder[]>(
    () => sol.billReminders.map((bill) => ({ ...bill, paid: false })),
  );
  const [netWorth, setNetWorth] = useState(sol.summary.netWorth);
  const [monthlyIncome, setMonthlyIncome] = useState(sol.summary.monthlyIncome);
  const [creditUtilization, setCreditUtilization] = useState(sol.summary.creditUtilization);
  const [draft, setDraft] = useState<DraftMoneyAction>(defaultDraft);

  useEffect(() => {
    const persisted = loadState();

    if (!persisted) {
      return;
    }

    setBudgets(persisted.budgets ?? sol.budgets.slice());
    setGoals(persisted.goals ?? sol.goals.slice());
    setBills(
      persisted.bills ??
        sol.billReminders.map((bill) => ({ ...bill, paid: false })),
    );
    setNetWorth(persisted.netWorth ?? sol.summary.netWorth);
    setMonthlyIncome(persisted.monthlyIncome ?? sol.summary.monthlyIncome);
    setCreditUtilization(
      persisted.creditUtilization ?? sol.summary.creditUtilization,
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        budgets,
        goals,
        bills,
        netWorth,
        monthlyIncome,
        creditUtilization,
      }),
    );
  }, [budgets, goals, bills, netWorth, monthlyIncome, creditUtilization]);

  const monthlyExpenses = useMemo(
    () => budgets.reduce((total, category) => total + category.spent, 0),
    [budgets],
  );
  const savingsRate = useMemo(() => {
    if (!monthlyIncome) {
      return 0;
    }

    return Math.max(
      0,
      Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100),
    );
  }, [monthlyExpenses, monthlyIncome]);
  const unpaidBills = bills.filter((bill) => !bill.paid);
  const strongestGoal =
    goals
      .slice()
      .sort((left, right) => goalCompletion(right) - goalCompletion(left))[0] ?? null;

  function applyMoneyAction() {
    const amount = Math.max(0, Number(draft.amount) || 0);

    if (!amount) {
      return;
    }

    if (draft.type === "income") {
      setMonthlyIncome((current) => current + amount);
      setNetWorth((current) => current + amount);
      return;
    }

    if (draft.type === "expense") {
      setBudgets((current) =>
        current.map((category) =>
          category.id === draft.categoryId
            ? { ...category, spent: category.spent + amount }
            : category,
        ),
      );
      setNetWorth((current) => current - amount);
      return;
    }

    setNetWorth((current) => current + amount);
    setGoals((current) =>
      current.map((goal) =>
        goal.id === "goal-emergency"
          ? { ...goal, current: goal.current + amount }
          : goal,
      ),
    );
  }

  function nudgeBudget(categoryId: string, delta: number) {
    setBudgets((current) =>
      current.map((category) =>
        category.id === categoryId
          ? { ...category, spent: Math.max(0, category.spent + delta) }
          : category,
      ),
    );
    setNetWorth((current) => Math.max(0, current - delta));
  }

  function toggleBill(billId: string) {
    const bill = bills.find((entry) => entry.id === billId);

    if (!bill) {
      return;
    }

    setBills((current) =>
      current.map((entry) =>
        entry.id === billId ? { ...entry, paid: !entry.paid } : entry,
      ),
    );

    setNetWorth((current) =>
      bill.paid ? current + bill.amount : Math.max(0, current - bill.amount),
    );
  }

  function contributeToGoal(goalId: string, amount: number) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current:
                goal.unit === "$"
                  ? goal.current + amount
                  : goal.current + 1,
            }
          : goal,
      ),
    );

    if (amount > 0) {
      setNetWorth((current) => Math.max(0, current - amount));
    }
  }

  return (
    <div className="workspace-stack">
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Net worth</span>
          <strong>{currency(netWorth)}</strong>
          <p className="muted">Sol now updates net worth in place as you log money movement inside the route.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Income</span>
          <strong>{currency(monthlyIncome)}</strong>
          <p className="muted">Monthly inflow is now adjustable directly inside Sol instead of staying frozen in a demo card.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Savings rate</span>
          <strong>{percent(savingsRate)}</strong>
          <p className="muted">Budget edits and money actions recalculate the savings picture in real time.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Credit utilization</span>
          <strong>{percent(creditUtilization)}</strong>
          <p className="muted">The route is live now, and credit pressure can be tuned as part of the same working surface.</p>
        </article>
      </div>

      <section className="panel workspace-banner workspace-banner-sol">
        <div>
          <p className="sidebar-label">Financial operating brief</p>
          <h3>Sol is now a live money workspace inside the platform.</h3>
          <p className="muted">
            Adjust spending, log income, mark bills paid, and push progress into your goals without
            leaving the route. Ember still uses the energy profile, and Surge still feeds career
            decision pressure back into the financial picture.
          </p>
        </div>
        <div className="context-row">
          <span className="status-pill">Expenses {currency(monthlyExpenses)}</span>
          <span className="status-pill">Unpaid bills {unpaidBills.length}</span>
          <span className="status-pill">Saved in browser</span>
        </div>
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Money action</p>
              <h3>Log the next financial move directly in Sol</h3>
            </div>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Action type</span>
              <select
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    type: event.target.value as MoneyActionType,
                  }))
                }
                value={draft.type}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="savings">Savings contribution</option>
              </select>
            </label>
            <label className="field">
              <span>Amount</span>
              <input
                min="0"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, amount: event.target.value }))
                }
                type="number"
                value={draft.amount}
              />
            </label>
            <label className="field field-span-full">
              <span>Budget category</span>
              <select
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
                value={draft.categoryId}
              >
                {budgets.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="live-action-row">
              <button className="primary-button" onClick={applyMoneyAction} type="button">
                Apply action
              </button>
            </div>
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Strongest goal</p>
            {strongestGoal ? (
              <article className="signal-card-mini">
                <strong>{strongestGoal.title}</strong>
                <p className="muted">
                  {strongestGoal.unit === "$"
                    ? `${currency(strongestGoal.current)} of ${currency(strongestGoal.target)}`
                    : `${strongestGoal.current}${strongestGoal.unit} of ${strongestGoal.target}${strongestGoal.unit}`}
                </p>
                <span className="mini-meta">Deadline {strongestGoal.deadline}</span>
              </article>
            ) : (
              <p className="muted">No active goal is loaded.</p>
            )}
          </section>

          <section className="panel">
            <p className="sidebar-label">AI guidance</p>
            <div className="signal-list">
              {snapshot.overview.insights
                .filter((item) => item.source === "sol" || item.source === "system")
                .map((insight) => (
                  <article
                    key={insight.id}
                    className={`workspace-insight workspace-insight-${insight.tone}`}
                  >
                    <h4>{insight.title}</h4>
                    <p>{insight.body}</p>
                  </article>
                ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Budget module</p>
              <h3>Spend versus plan with live adjustments</h3>
            </div>
          </div>
          <div className="progress-stack">
            {budgets.map((category) => {
              const fill = Math.min(100, Math.round(budgetUtilization(category) * 100));

              return (
                <article key={category.id} className="progress-row-card">
                  <div className="progress-row-head">
                    <div>
                      <strong>{category.label}</strong>
                      <p className="muted">
                        {currency(category.spent)} of {currency(category.budget)}
                      </p>
                    </div>
                    <span className={`trend-pill trend-pill-${category.trend}`}>{fill}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${fill}%` }} />
                  </div>
                  <div className="live-action-row">
                    <button
                      className="ghost-button live-inline-button"
                      onClick={() => nudgeBudget(category.id, -25)}
                      type="button"
                    >
                      - $25
                    </button>
                    <button
                      className="ghost-button live-inline-button"
                      onClick={() => nudgeBudget(category.id, 25)}
                      type="button"
                    >
                      + $25
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Bill tracker</p>
            <div className="signal-list">
              {bills.map((bill) => (
                <article key={bill.id} className="signal-card-mini">
                  <div className="signal-card-head">
                    <strong>{bill.title}</strong>
                    <span className={bill.paid ? "risk-pill risk-pill-healthy" : "risk-pill risk-pill-watch"}>
                      {bill.paid ? "paid" : "open"}
                    </span>
                  </div>
                  <p className="muted">{currency(bill.amount)} due {bill.dueDate}</p>
                  <button
                    className="ghost-button live-inline-button"
                    onClick={() => toggleBill(bill.id)}
                    type="button"
                  >
                    {bill.paid ? "Mark unpaid" : "Mark paid"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Goal system</p>
              <h3>Long-range targets with real progress controls</h3>
            </div>
          </div>
          <div className="goal-grid">
            {goals.map((goal) => {
              const fill = Math.round(goalCompletion(goal) * 100);

              return (
                <article key={goal.id} className="goal-card">
                  <div className="goal-ring">
                    <span>{fill}%</span>
                  </div>
                  <div>
                    <p className="workspace-module-kicker">{goal.category}</p>
                    <h4>{goal.title}</h4>
                    <p className="muted">
                      {goal.unit === "$"
                        ? `${currency(goal.current)} / ${currency(goal.target)}`
                        : `${goal.current}${goal.unit} / ${goal.target}${goal.unit}`}
                    </p>
                    <span className="mini-meta">Deadline {goal.deadline}</span>
                  </div>
                  <div className="live-action-row">
                    <button
                      className="ghost-button live-inline-button"
                      onClick={() => contributeToGoal(goal.id, 50)}
                      type="button"
                    >
                      {goal.unit === "$" ? "+ $50" : "+ progress"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="panel">
          <p className="sidebar-label">Cross-app effect</p>
          <ul className="feature-list">
            <li>Surge offer comparisons feed directly into Sol's income and runway model.</li>
            <li>Ember uses high-energy windows to protect deep work before school or interview blocks.</li>
            <li>Financial reminders become task constraints so admin work lands before due dates, not after.</li>
          </ul>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Energy scheduler</p>
            <h3>Weekly energy windows still driving Ember's schedule</h3>
          </div>
        </div>
        <div className="energy-grid">
          {sol.energyProfile.map((slot) => (
            <article
              key={`${slot.day}-${slot.block}`}
              className={`energy-cell energy-cell-${slot.level}`}
            >
              <span className="workspace-module-kicker">{slot.day}</span>
              <strong>{slot.block}</strong>
              <p>{slot.level} energy</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
