import {
  budgetUtilization,
  currency,
  getOdiricoEcosystemSnapshot,
  goalCompletion,
  percent,
} from "@odirico/core/ecosystem";

export function SolWorkspace() {
  const snapshot = getOdiricoEcosystemSnapshot();
  const { sol, overview } = snapshot;

  return (
    <div className="workspace-stack">
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Net worth</span>
          <strong>{currency(sol.summary.netWorth)}</strong>
          <p className="muted">Full-system snapshot of cash position, debt pressure, and long-range runway.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Income</span>
          <strong>{currency(sol.summary.monthlyIncome)}</strong>
          <p className="muted">Current monthly inflow including work, support, and flexible income channels.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Savings rate</span>
          <strong>{percent(sol.summary.savingsRate)}</strong>
          <p className="muted">The buffer is still growing, but Sol needs to keep groceries and admin drag under control.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Credit utilization</span>
          <strong>{percent(sol.summary.creditUtilization)}</strong>
          <p className="muted">Still healthy enough, but close enough to the goal that spending discipline matters this week.</p>
        </article>
      </div>

      <section className="panel workspace-banner workspace-banner-sol">
        <div>
          <p className="sidebar-label">Financial operating brief</p>
          <h3>Sol is the future-planning layer for money, energy, and life pressure.</h3>
          <p className="muted">
            It is not just a tracker. Sol is constraining Ember’s schedule with real energy windows
            and protecting career decisions in Surge by showing what cash flow can absorb.
          </p>
        </div>
        <div className="context-row">
          <span className="status-pill">Expenses {currency(sol.summary.monthlyExpenses)}</span>
          <span className="status-pill">Momentum {overview.momentumScore}</span>
          <span className="status-pill">{sol.billReminders.length} bill reminders active</span>
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Budget module</p>
              <h3>Spend versus plan</h3>
            </div>
          </div>
          <div className="progress-stack">
            {sol.budgets.map((category) => {
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
                </article>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Bill tracker</p>
            <div className="signal-list">
              {sol.billReminders.map((bill) => (
                <article key={bill.id} className="signal-card-mini">
                  <strong>{bill.title}</strong>
                  <p className="muted">{currency(bill.amount)} due {bill.dueDate}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <p className="sidebar-label">AI guidance</p>
            <div className="signal-list">
              {overview.insights.filter((item) => item.source === "sol" || item.source === "system").map((insight) => (
                <article key={insight.id} className={`workspace-insight workspace-insight-${insight.tone}`}>
                  <h4>{insight.title}</h4>
                  <p>{insight.body}</p>
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
              <h3>Long-range targets with visible pressure</h3>
            </div>
          </div>
          <div className="goal-grid">
            {sol.goals.map((goal) => {
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
                      {goal.unit === "$" ? currency(goal.current) : `${goal.current}${goal.unit}`} /{" "}
                      {goal.unit === "$" ? currency(goal.target) : `${goal.target}${goal.unit}`}
                    </p>
                    <span className="mini-meta">Deadline {goal.deadline}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="panel">
          <p className="sidebar-label">Cross-app effect</p>
          <ul className="feature-list">
            <li>Surge offer comparisons feed directly into Sol’s income and runway models.</li>
            <li>Ember uses high-energy windows to protect deep work before school or interview blocks.</li>
            <li>Financial reminders become task constraints so admin work lands before due dates, not after.</li>
          </ul>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Energy scheduler</p>
            <h3>Weekly energy windows driving Ember’s schedule</h3>
          </div>
        </div>
        <div className="energy-grid">
          {sol.energyProfile.map((slot) => (
            <article key={`${slot.day}-${slot.block}`} className={`energy-cell energy-cell-${slot.level}`}>
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
