import { AuthIntroPanel } from "@/components/auth/auth-intro-panel";
import { LoginForm } from "@/components/auth/login-form";

export default function SignupPage() {
  return (
    <main className="auth-layout auth-layout-split">
      <AuthIntroPanel mode="signup" />

      <section className="auth-form-wrap">
        <LoginForm mode="signup" />
      </section>
    </main>
  );
}
