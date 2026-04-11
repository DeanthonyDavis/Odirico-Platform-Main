import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-layout auth-layout-split">
      <section className="auth-intro-panel">
        <div className="auth-brand">
          <Image alt="" className="auth-brand-mark" height={72} src="/branding/odirico-platform.jpg" width={72} />
          <div>
            <p className="eyebrow">Platform access</p>
            <h1>Sign in once for Ember, Sol, and Surge.</h1>
          </div>
        </div>
        <p className="muted">
          The platform is built to feel like one connected system. Use the same account across
          planning, money, and opportunity workflows without rebuilding your context every time.
        </p>

        <div className="auth-module-list">
          <div className="auth-module-item">
            <Image alt="" className="auth-module-mark" height={44} src="/branding/ember.jpg" width={44} />
            <div>
            <strong>Ember</strong>
            <span>Daily survival, recovery, and guided life operations</span>
            </div>
          </div>
          <div className="auth-module-item">
            <Image alt="" className="auth-module-mark" height={44} src="/branding/sol.jpg" width={44} />
            <div>
            <strong>Sol</strong>
            <span>Long-term direction, credit, and planning strategy</span>
            </div>
          </div>
          <div className="auth-module-item">
            <Image alt="" className="auth-module-mark" height={44} src="/branding/surge.jpg" width={44} />
            <div>
            <strong>Surge</strong>
            <span>Universal job and internship application command center</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <LoginForm />
      </section>
    </main>
  );
}
