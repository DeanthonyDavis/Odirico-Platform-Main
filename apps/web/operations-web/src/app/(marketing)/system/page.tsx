import {
  CONNECTION_FLOWS,
  PLATFORM_PRIORITIES,
  SYSTEM_PILLARS,
} from "@/components/marketing/ecosystem-data";

export default function SystemPage() {
  return (
    <>
      <section className="platform-page-hero">
        <div className="marketing-shell platform-page-hero-grid">
          <div>
            <p className="platform-kicker">System</p>
            <h1>One login, one subscription, and one shared memory layer.</h1>
          </div>
          <p>
            Odirico Platform is not supposed to feel like three unrelated apps under one domain. It
            is one system where Ember, Sol, and Surge each own a different life function while
            still passing useful context between each other.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-pillars">
            {SYSTEM_PILLARS.map((pillar) => (
              <article className="platform-pillar" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-section-contrast">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">What the platform should do</p>
              <h2>Reduce friction instead of adding another dashboard.</h2>
            </div>
            <p>
              If a product makes you repeat yourself across planning, money, and opportunity
              tracking, it is not really reducing complexity. The system has to absorb context and
              keep it usable.
            </p>
          </div>

          <div className="platform-priority-list">
            {PLATFORM_PRIORITIES.map((item) => (
              <article className="platform-priority" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="marketing-shell">
          <div className="platform-section-head">
            <div>
              <p className="platform-kicker">Cross-app handoffs</p>
              <h2>The system gets better when one module informs the next.</h2>
            </div>
            <p>
              Shared data matters less than shared momentum. The real advantage is that the next
              useful action becomes easier to see because another module already did the setup.
            </p>
          </div>

          <div className="connection-flow-list">
            {CONNECTION_FLOWS.map((flow, index) => (
              <article className="connection-flow" key={flow.title}>
                <span className="connection-flow-index">0{index + 1}</span>
                <div>
                  <h3>{flow.title}</h3>
                  <p>{flow.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
