"use client";

import { useMemo, useState } from "react";

import {
  budgetUtilization,
  currency,
  getOdiricoEcosystemSnapshot,
  goalCompletion,
  percent,
} from "@odirico/core/ecosystem";

import {
  useSyncedWorkspace,
  type WorkspaceSyncStatus,
} from "@/components/platform/use-synced-workspace";
import type { SolWorkspaceState } from "@/lib/platform/workspaces";
import { normalizeWorkspaceState } from "@/lib/platform/workspaces";

const STORAGE_KEY = "odirico-sol-live-v1";

type MoneyActionType = "income" | "expense" | "savings";

type DraftMoneyAction = {
  type: MoneyActionType;
  amount: string;
  categoryId: string;
};

type SolWorkspaceProps = {
  initialState: SolWorkspaceState;
  hasPersistedState: boolean;
};

const snapshot = getOdiricoEcosystemSnapshot();
const sol = snapshot.sol;

const defaultDraft: DraftMoneyAction = {
  type: "expense",
  amount: "50",
  categoryId: sol.budgets[0]?.id ?? "",
};

const normalizeSolClientState = (value: unknown) => normalizeWorkspaceState("sol", value);

function syncStatusLabel(status: WorkspaceSyncStatus) {
  if (status === "syncing") return "Syncing";
  if (status === "error") return "Needs attention";
  return "Saved";
}

export function SolWorkspace({ initialState, hasPersistedState }: SolWorkspaceProps) {
  const [draft, setDraft] = useState<DraftMoneyAction>(defaultDraft);
  const {
    state,
    setState,
    syncStatus,
    syncError,
  } = useSyncedWorkspace({
    appKey: "sol",
    storageKey: STORAGE_KEY,
    initialState,
    hasPersistedState,
    normalizeState: normalizeSolClientState,
  });

  const budgets = state.budgets;
  const goals = state.goals;
  const bills = state.bills;
  const netWorth = state.netWorth;
  const monthlyIncome = state.monthlyIncome;
  const creditUtilization = state.creditUtilization;

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
    goals.slice().sort((left, right) => goalCompletion(right) - goalCompletion(left))[0] ?? null;
  const overspendingCategories = budgets.filter((category) => category.spent > category.budget);

  function applyMoneyAction() {
    const amount = Math.max(0, Number(draft.amount) || 0);

    if (!amount) {
      return;
    }

    setState((current) => {
      if (draft.type === "income") {
        return {
          ...current,
          monthlyIncome: current.monthlyIncome + amount,
          netWorth: current.netWorth + amount,
        };
      }

      if (draft.type === "expense") {
        return {
          ...current,
          budgets: current.budgets.map((category) =>
            category.id === draft.categoryId
              ? { ...category, spent: category.spent + amount }
              : category,
          ),
          netWorth: current.netWorth - amount,
        };
      }

      return {
        ...current,
        netWorth: current.netWorth + amount,
        goals: current.goals.map((goal) =>
          goal.id === "goal-emergency"
            ? { ...goal, current: goal.current + amount }
            : goal,
        ),
      };
    });
  }

  function nudgeBudget(categoryId: string, delta: number) {
    setState((current) => ({
      ...current,
      budgets: current.budgets.map((category) =>
        category.id === categoryId
          ? { ...category, spent: Math.max(0, category.spent + delta) }
          : category,
      ),
      netWorth: Math.max(0, current.netWorth - delta),
    }));
  }

  function toggleBill(billId: string) {
    setState((current) => {
      const bill = current.bills.find((entry) => entry.id === billId);

      if (!bill) {
        return current;
      }

      return {
        ...current,
        bills: current.bills.map((entry) =>
          entry.id === billId ? { ...entry, paid: !entry.paid } : entry,
        ),
        netWorth: bill.paid
          ? current.netWorth + bill.amount
          : Math.max(0, current.netWorth - bill.amount),
      };
    });
  }

  function contributeToGoal(goalId: string, amount: number) {
    setState((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
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
      netWorth: amount > 0 ? Math.max(0, current.netWorth - amount) : current.netWorth,
    }));
  }

  return (
    <div className="workspace-stack">
      <section className="panel app-home-hero app-home-hero-sol" id="overview">
        <div className="app-home-copy">
          <p className="sidebar-label">Overview</p>
          <h3>Stay grounded on cash, bills, and long-range progress before small misses become bigger pressure.</h3>
          <p className="muted">
            Sol should answer what you owe soon, whether you are drifting, and what the next useful financial move is.
          </p>
          {syncError ? <p className="muted">{syncError}</p> : null}
        </div>

        <div className="app-home-meta">
          <span className="status-pill">Net worth {currency(netWorth)}</span>
          <span className="status-pill">{syncStatusLabel(syncStatus)}</span>
          <span className="status-pill">{unpaidBills.length} bills open</span>
        </div>

        <div className="app-home-grid">
          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Next bill</p>
            <h4>{unpaidBills[0]?.title ?? "No unpaid bills"}</h4>
            <p className="muted">
              {unpaidBills[0]
                ? `${currency(unpaidBills[0].amount)} due ${unpaidBills[0].dueDate}`
                : "Nothing urgent is due right now."}
            </p>
          </article>

          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Budget watch</p>
            <h4>{overspendingCategories[0]?.label ?? "On plan"}</h4>
            <p className="muted">
              {overspendingCategories[0]
                ? `${currency(overspendingCategories[0].spent)} against ${currency(overspendingCategories[0].budget)}`
                : "No category is currently over budget."}
            </p>
          </article>

          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Top goal</p>
            <h4>{strongestGoal?.title ?? "No active goal"}</h4>
            <p className="muted">
              {strongestGoal
                ? `${Math.round(goalCompletion(strongestGoal) * 100)}% complete`
                : "Create or continue a long-range target."}
            </p>
          </article>
        </div>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Monthly income</span>
          <strong>{currency(monthlyIncome)}</strong>
          <p className="muted">Current inflow available to carry the month.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Monthly expenses</span>
          <strong>{currency(monthlyExpenses)}</strong>
          <p className="muted">Tracked spend across the current budget categories.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Savings rate</span>
          <strong>{percent(savingsRate)}</strong>
          <p className="muted">Margin left after current budget behavior.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Credit utilization</span>
          <strong>{percent(creditUtilization)}</strong>
          <p className="muted">Credit pressure and payoff guidance anchor.</p>
        </article>
      </div>

      <div className="panel-grid" id="money">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Money actions</p>
              <h3>Adjust cash movement directly from the dashboard</h3>
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
                onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
                type="number"
                value={draft.amount}
              />
            </label>
            <label className="field field-span-full">
              <span>Budget category</span>
              <select
                onChange={(event) =>
                  setDraft((current) => ({ ...current, categoryId: event.target.value }))
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

        <aside className="sidebar-panels" id="bills">
          <section className="panel">
            <p className="sidebar-label">Bills</p>
            <div className="signal-list">
              {bills.map((bill) => (
                <article key={bill.id} className="signal-card-mini">
                  <div className="signal-card-head">
                    <strong>{bill.title}</strong>
                    <span className={bill.paid ? "risk-pill risk-pill-healthy" : "risk-pill risk-pill-watch"}>
                      {bill.paid ? "paid" : "open"}
                    </span>
                  </div>
                  <p className="muted">
                    {currency(bill.amount)} due {bill.dueDate}
                  </p>
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

          <section className="panel">
            <p className="sidebar-label">Financial guidance</p>
            <div className="signal-list">
              {snapshot.overview.insights
                .filter((item) => item.source === "sol" || item.source === "system")
                .map((insight) => (
                  <article key={insight.id} className={`workspace-insight workspace-insight-${insight.tone}`}>
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
              <p className="sidebar-label">Budget health</p>
              <h3>See spend versus plan without leaving the main workspace</h3>
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

        <aside className="sidebar-panels" id="goals">
          <section className="panel">
            <p className="sidebar-label">Goals</p>
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
        </aside>
      </div>

      <div className="panel-grid" id="planning">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Planning</p>
              <h3>Use longer-range direction to guide the next short move</h3>
            </div>
          </div>
          <ul className="feature-list">
            <li>Surge offer comparisons should feed directly into expected income and runway planning.</li>
            <li>Ember’s high-energy windows protect deep work before admin tasks or bill deadlines.</li>
            <li>Credit and savings targets stay in view so small choices map back to real goals.</li>
          </ul>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Energy profile</p>
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
        </aside>
      </div>
    </div>
  );
}
