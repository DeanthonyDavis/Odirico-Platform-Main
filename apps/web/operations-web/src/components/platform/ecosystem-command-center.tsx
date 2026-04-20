import Link from "next/link";

import {
  currency,
  getOdiricoEcosystemSnapshot,
  percent,
} from "@odirico/core/ecosystem";

export function EcosystemCommandCenter() {
  const snapshot = getOdiricoEcosystemSnapshot();

  return (
    <div className="workspace-stack">
      <section className="panel ecosystem-command-board" id="command">
        <div className="ecosystem-command-copy">
          <p className="sidebar-label">Command center</p>
          <h3>What needs attention across school, money, and applications today</h3>
          <p className="muted">
            The ecosystem should help you decide where to go next, then get out of the way once you enter the right app.
          </p>
        </div>

        <div className="ecosystem-priority-grid">
          <article className="signal-card-mini ecosystem-priority-card ecosystem-priority-card-ember">
            <span className="workspace-module-kicker">Ember</span>
            <strong>{snapshot.ember.assignments[0]?.title}</strong>
            <p className="muted">Next academic pressure point due {snapshot.ember.assignments[0]?.dueDate}</p>
            <Link className="ecosystem-card-primary-link" href="/ember">
              Open Ember
            </Link>
          </article>

          <article className="signal-card-mini ecosystem-priority-card ecosystem-priority-card-sol">
            <span className="workspace-module-kicker">Sol</span>
            <strong>{snapshot.sol.billReminders[0]?.title}</strong>
            <p className="muted">
              {currency(snapshot.sol.billReminders[0]?.amount ?? 0)} due {snapshot.sol.billReminders[0]?.dueDate}
            </p>
            <Link className="ecosystem-card-primary-link" href="/sol">
              Open Sol
            </Link>
          </article>

          <article className="signal-card-mini ecosystem-priority-card ecosystem-priority-card-surge">
            <span className="workspace-module-kicker">Surge</span>
            <strong>{snapshot.surge.applications[0]?.company}</strong>
            <p className="muted">{snapshot.surge.applications[0]?.nextAction}</p>
            <Link className="ecosystem-card-primary-link" href="/surge">
              Open Surge
            </Link>
          </article>
        </div>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Momentum score</span>
          <strong>{snapshot.overview.momentumScore}</strong>
          <p className="muted">Shared pulse across your academic load, financial stability, and application pipeline.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Savings rate</span>
          <strong>{percent(snapshot.sol.summary.savingsRate)}</strong>
          <p className="muted">Sol is still protecting runway even while semester and interview pressure stack up.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Due this week</span>
          <strong>{snapshot.ember.summary.dueThisWeek}</strong>
          <p className="muted">Ember keeps the academic queue visible before it turns into backlog.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Active applications</span>
          <strong>{snapshot.surge.summary.activeApplications}</strong>
          <p className="muted">Surge keeps the search active while Ember and Sol protect the rest of the week.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel" id="signals">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Cross-app signals</p>
              <h3>Shared pressure that should change what you do next</h3>
            </div>
          </div>
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

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Connector health</p>
            <div className="connector-list">
              {snapshot.connectors.map((connector) => (
                <article key={connector.key} className="connector-row">
                  <div>
                    <strong>{connector.label}</strong>
                    <p className="muted">{connector.detail}</p>
                  </div>
                  <span className={`module-pill connector-pill connector-pill-${connector.status}`}>
                    {connector.status}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <p className="sidebar-label">Recommended next move</p>
            <div className="signal-list">
              {snapshot.overview.insights.slice(0, 2).map((insight) => (
                <article key={insight.id} className={`workspace-insight workspace-insight-${insight.tone}`}>
                  <h4>{insight.title}</h4>
                  <p>{insight.body}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
