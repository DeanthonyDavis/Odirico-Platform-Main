"use client";

import Link from "next/link";
import { startTransition, useState } from "react";

import type { PlatformPlanKey } from "@/lib/billing/plans";

type BillingCheckoutButtonProps = {
  planKey: Exclude<PlatformPlanKey, "free">;
  className?: string;
  label: string;
  signedIn: boolean;
  checkoutConfigured: boolean;
  currentPlanKey?: PlatformPlanKey;
  hasActiveSubscription?: boolean;
};

export function BillingCheckoutButton({
  planKey,
  className,
  label,
  signedIn,
  checkoutConfigured,
  currentPlanKey,
  hasActiveSubscription = false,
}: BillingCheckoutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <Link className={className} href={`/signup?next=/billing&plan=${planKey}`}>
        {label}
      </Link>
    );
  }

  const isCurrentPlan = hasActiveSubscription && currentPlanKey === planKey;
  const isDisabled = isPending || isCurrentPlan || !checkoutConfigured || hasActiveSubscription;
  const buttonLabel = isCurrentPlan
    ? "Current plan"
    : hasActiveSubscription
      ? "Manage in billing"
      : !checkoutConfigured
        ? "Billing setup needed"
        : isPending
          ? "Opening checkout..."
          : label;

  async function handleCheckout() {
    setError(null);
    startTransition(() => setIsPending(true));

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planKey }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Unable to open Stripe Checkout.");
      }

      window.location.assign(payload.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to open Stripe Checkout.");
      setIsPending(false);
    }
  }

  return (
    <div className="billing-button-stack">
      <button className={className} disabled={isDisabled} onClick={handleCheckout} type="button">
        {buttonLabel}
      </button>
      {error ? <p className="billing-inline-error">{error}</p> : null}
    </div>
  );
}
