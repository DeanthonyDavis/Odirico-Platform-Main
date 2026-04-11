import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-layout auth-layout-split">
      <section className="auth-intro-panel">
        <p className="eyebrow">Platform access</p>
        <h1>Sign in once for PoleQA, Ember, Sol, and Surge.</h1>
        <p className="muted">
          Odirico is being shaped as one route-based product shell. PoleQA is live today, and the
          rest of the ecosystem is being folded into the same identity, billing, and navigation
          layer.
        </p>

        <div className="auth-module-list">
          <div className="auth-module-item">
            <strong>PoleQA</strong>
            <span>Live inspection and QA/QC workflow</span>
          </div>
          <div className="auth-module-item">
            <strong>Ember</strong>
            <span>Daily survival, recovery, and guided life operations</span>
          </div>
          <div className="auth-module-item">
            <strong>Sol</strong>
            <span>Long-term direction, credit, and planning strategy</span>
          </div>
          <div className="auth-module-item">
            <strong>Surge</strong>
            <span>Universal job and internship application command center</span>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <LoginForm />
      </section>
    </main>
  );
}
