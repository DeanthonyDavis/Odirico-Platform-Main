import { AppShell } from "@/components/layout/app-shell";
import { requireUserContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const userContext = await requireUserContext();

  return (
    <AppShell
      currentPath="/billing"
      title="Billing"
      subtitle="One subscription surface for the full Odirico ecosystem, even while app runtimes are still being consolidated."
      userContext={userContext}
      eyebrow="Odirico / Billing"
    >
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Plan model</span>
          <strong>Unified</strong>
          <p className="muted">The platform is being shaped around one login, one subscription, and shared entitlements.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Current state</span>
          <strong>Scaffolded</strong>
          <p className="muted">Billing UI is now part of the route shell, ready for Stripe and entitlement integration.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Apps covered</span>
          <strong>4</strong>
          <p className="muted">PoleQA, Ember, Sol, and Surge are being grouped under one platform contract.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Identity</span>
          <strong>Shared</strong>
          <p className="muted">Supabase auth remains the platform session anchor across the route shell.</p>
        </article>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <p className="sidebar-label">What this page becomes</p>
          <h3>Central subscription and entitlement control</h3>
          <ul className="feature-list">
            <li>Manage plan, renewal, and app access from one place.</li>
            <li>Expose shared entitlements so individual apps unlock cleanly without duplicate billing logic.</li>
            <li>Support cross-app upgrades without making the user think about separate products or projects.</li>
          </ul>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Next implementation moves</p>
            <ul className="feature-list">
              <li>Define the platform plan model and app-level entitlements in shared contracts.</li>
              <li>Connect Stripe checkout and customer portal routes once the subscription model is finalized.</li>
              <li>Wire billing state into route guards and app switcher status across the ecosystem.</li>
            </ul>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
