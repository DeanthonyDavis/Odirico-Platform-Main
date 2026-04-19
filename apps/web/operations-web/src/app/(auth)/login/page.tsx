import { AuthIntroPanel } from "@/components/auth/auth-intro-panel";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-layout auth-layout-split">
      <AuthIntroPanel mode="signin" />

      <section className="auth-form-wrap">
        <LoginForm mode="signin" />
      </section>
    </main>
  );
}
