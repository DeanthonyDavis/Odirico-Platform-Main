"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { createClientSupabaseClient } from "@/lib/supabase/client";

type LoginFormProps = {
  mode?: "signin" | "signup";
};

function buildAuthHref(pathname: "/login" | "/signup", nextPath: Route) {
  const search = new URLSearchParams();

  if (nextPath !== "/overview") {
    search.set("next", nextPath);
  }

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function LoginForm({ mode = "signin" }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoModeEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
  const isSignup = mode === "signup";
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const callbackError = searchParams.get("error");
  const callbackMessage = searchParams.get("message");

  const nextPath = ((searchParams.get("next") as Route | null) ?? "/overview") as Route;
  const signInHref = buildAuthHref("/login", nextPath);
  const signUpHref = buildAuthHref("/signup", nextPath);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createClientSupabaseClient();

    if (isSignup) {
      const confirmationUrl = new URL("/login", window.location.origin);
      confirmationUrl.searchParams.set("message", "Email confirmed. Sign in to continue.");
      confirmationUrl.searchParams.set("next", nextPath);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmationUrl.toString(),
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        startTransition(() => {
          router.replace(nextPath);
          router.refresh();
        });
        return;
      }

      setMessage("Check your email to confirm your account, then return here to sign in.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    startTransition(() => {
      router.replace(nextPath);
      router.refresh();
    });
  }

  async function handleGoogleLogin() {
    setError(null);
    setMessage(null);
    setIsGooglePending(true);

    const supabase = createClientSupabaseClient();
    const callbackUrl = new URL("/callback", window.location.origin);
    callbackUrl.searchParams.set("next", nextPath);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsGooglePending(false);
    }
  }

  async function handleDemoLogin() {
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/demo", {
      method: "POST",
    });

    if (!response.ok) {
      setError("Unable to start demo mode right now.");
      return;
    }

    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  }

  async function handleResetPassword() {
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const payload = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to send reset email.");
      return;
    }

    setMessage(payload.message ?? "If the email exists, a reset link has been sent.");
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <p className="eyebrow">Odirico Platform</p>
        <h1>{isSignup ? "Create your account" : "Sign in"}</h1>
        <p>
          {isSignup
            ? "Use Google or email to create one account for the connected Ember, Sol, and Surge ecosystem."
            : "Use your account to enter the connected Ember, Sol, and Surge ecosystem."}
        </p>
      </div>

      <div className="auth-mode-switch">
        <Link className={!isSignup ? "chip-button active" : "chip-button"} href={signInHref}>
          Sign in
        </Link>
        <Link className={isSignup ? "chip-button active" : "chip-button"} href={signUpHref}>
          Create account
        </Link>
      </div>

      <label className="field">
        <span>Email</span>
        <input
          autoComplete="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />
      </label>

      <button
        className="ghost-button"
        disabled={isPending || isGooglePending}
        onClick={handleGoogleLogin}
        type="button"
      >
        {isGooglePending
          ? "Redirecting to Google..."
          : isSignup
            ? "Sign up with Google"
            : "Continue with Google"}
      </button>

      <p className="auth-footnote">
        First-time Google use creates your account automatically. After that, it works like sign in.
      </p>

      {error || callbackError ? <p className="form-error">{error ?? callbackError}</p> : null}
      {message || callbackMessage ? (
        <p className="form-message">{message ?? callbackMessage}</p>
      ) : null}

      <div className="auth-actions">
        <button className="primary-button" disabled={isPending} type="submit">
          {isPending ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Create account" : "Sign in"}
        </button>
        {!isSignup ? (
          <button
            className="ghost-button"
            disabled={!email || isPending}
            onClick={handleResetPassword}
            type="button"
          >
            Send reset link
          </button>
        ) : null}
        {demoModeEnabled ? (
          <button
            className="ghost-button"
            disabled={isPending}
            onClick={handleDemoLogin}
            type="button"
          >
            Continue in demo mode
          </button>
        ) : null}
      </div>

      <p className="auth-footnote">
        {isSignup ? (
          <>
            Already have an account? <Link href={signInHref}>Sign in</Link>.
          </>
        ) : (
          <>
            Need an account? <Link href={signUpHref}>Create one</Link>.
          </>
        )}
      </p>

      {demoModeEnabled ? (
        <p className="form-message">
          Demo mode bypasses Supabase sign-in and loads sample platform data locally for exploration.
        </p>
      ) : null}
    </form>
  );
}
