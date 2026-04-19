import Link from "next/link";

import {
  currency,
  getOdiricoEcosystemSnapshot,
  percent,
} from "@odirico/core/ecosystem";

export function EcosystemCommandCenter() {
  const snapshot = getOdiricoEcosystemSnapshot();
  const topAssignments = snapshot.ember.assignments.slice(0, 3);
  const topApplications = snapshot.surge.applications.slice(0, 3);

  return (
    <div className="workspace-stack">
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Momentum score</span>
          <strong>{snapshot.overview.momentumScore}</strong>
          <p className="muted">Cross-app operating pulse driven by school load, money stability, and career motion.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Savings rate</span>
          <strong>{percent(snapshot.sol.summary.savingsRate)}</strong>
          <p className="muted">Sol is still protecting forward motion even with bills and semester pressure stacking up.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Due this week</span>
          <strong>{snapshot.ember.summary.dueThisWeek}</strong>
          <p className="muted">Ember is prioritizing academic deadlines first so the week does not collapse under backlog.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Active applications</span>
          <strong>{snapshot.surge.summary.activeApplications}</strong>
          <p className="muted">Surge is holding the opportunity pipeline steady while Ember protects time to actually respond.</p>
        </article>
      </div>

      <section className="panel workspace-banner workspace-banner-overview">
        <div>
          <p className="sidebar-label">System focus</p>
          <h3>{snapshot.overview.dailyFocus}</h3>
          <p className="muted">
            The ecosystem is acting like one operating system now: Ember handles the week,
            Sol guards financial direction, and Surge keeps outward opportunity from getting dropped.
          </p>
        </div>
        <div className="context-row">
          <span className="status-pill">Semester {snapshot.profile.semester}</span>
          <span className="status-pill">Net worth {currency(snapshot.sol.summary.netWorth)}</span>
          <span className="status-pill">{snapshot.surge.summary.interviews} interview loops active</span>
        </div>
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Live modules</p>
              <h3>Open the right system for the job in front of you</h3>
            </div>
          </div>
          <div className="module-story-grid">
            <article className="workspace-module workspace-module-ember">
              <p className="workspace-module-kicker">Ember</p>
              <h4>Academic execution and weekly load balancing</h4>
              <p className="muted">Student-centered planning for classes, exams, study blocks, and burnout prevention.</p>
              <ul className="feature-list">
                {topAssignments.map((assignment) => (
                  <li key={assignment.id}>
                    {assignment.title} due {assignment.dueDate}
                  </li>
                ))}
              </ul>
              <Link className="ecosystem-card-primary-link" href="/ember">
                Open Ember
              </Link>
            </article>

            <article className="workspace-module workspace-module-sol">
              <p className="workspace-module-kicker">Sol</p>
              <h4>Money direction, runway, and energy-aware planning</h4>
              <p className="muted">Budget health, goal pressure, and energy windows feed the rest of the ecosystem.</p>
              <ul className="feature-list">
                {snapshot.sol.billReminders.map((bill) => (
                  <li key={bill.id}>
                    {bill.title} {currency(bill.amount)} due {bill.dueDate}
                  </li>
                ))}
              </ul>
              <Link className="ecosystem-card-primary-link" href="/sol">
                Open Sol
              </Link>
            </article>

            <article className="workspace-module workspace-module-surge">
              <p className="workspace-module-kicker">Surge</p>
              <h4>Career momentum, applications, and recruiter memory</h4>
              <p className="muted">The opportunity layer is already live and now tied back into the academic and financial systems.</p>
              <ul className="feature-list">
                {topApplications.map((application) => (
                  <li key={application.id}>
                    {application.company} · {application.role}
                  </li>
                ))}
              </ul>
              <Link className="ecosystem-card-primary-link" href="/surge">
                Open Surge
              </Link>
            </article>
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Cross-app queue</p>
            <div className="signal-list">
              {snapshot.overview.crossAppSignals.map((signal) => (
                <article key={signal.id} className="signal-card-mini">
                  <div className="signal-card-head">
                    <span className={`source-dot source-dot-${signal.source}`} />
                    <strong>{signal.title}</strong>
                  </div>
                  <p className="muted">{signal.detail}</p>
                  {signal.dueLabel ? <span className="mini-meta">{signal.dueLabel}</span> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <p className="sidebar-label">Connector health</p>
            <div className="connector-list">
              {snapshot.connectors.map((connector) => (
                <article key={connector.key} className="connector-row">
                  <div>
                    <strong>{connector.label}</strong>
                    <p className="muted">{connector.detail}</p>
                  </div>
                  <span className={`module-pill connector-pill connector-pill-${connector.status}`}>{connector.status}</span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">AI brief</p>
            <h3>What the system is flagging right now</h3>
          </div>
        </div>
        <div className="workspace-insight-grid">
          {snapshot.overview.insights.map((insight) => (
            <article key={insight.id} className={`workspace-insight workspace-insight-${insight.tone}`}>
              <p className="workspace-module-kicker">{insight.source}</p>
              <h4>{insight.title}</h4>
              <p>{insight.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
