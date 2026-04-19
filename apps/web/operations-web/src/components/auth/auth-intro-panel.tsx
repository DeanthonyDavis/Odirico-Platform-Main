import Image from "next/image";

type AuthIntroPanelProps = {
  mode: "signin" | "signup";
};

export function AuthIntroPanel({ mode }: AuthIntroPanelProps) {
  const heading =
    mode === "signup"
      ? "Create one account for Ember, Sol, and Surge."
      : "Sign in once for Ember, Sol, and Surge.";

  const copy =
    mode === "signup"
      ? "Start with Google or email, then carry the same account across planning, money, and opportunity workflows."
      : "Use the same account across planning, money, and opportunity workflows without rebuilding your context every time.";

  return (
    <section className="auth-intro-panel">
      <div className="auth-brand">
        <Image alt="" className="auth-brand-mark" height={72} src="/branding/odirico-platform.jpg" width={72} />
        <div>
          <p className="eyebrow">Platform access</p>
          <h1>{heading}</h1>
        </div>
      </div>
      <p className="muted">{copy}</p>

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
  );
}
