"use client";

import { startTransition, useState } from "react";

type BillingPortalButtonProps = {
  className?: string;
  label?: string;
  disabled?: boolean;
};

export function BillingPortalButton({
  className,
  label = "Manage subscription",
  disabled = false,
}: BillingPortalButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePortal() {
    setError(null);
    startTransition(() => setIsPending(true));

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Unable to open the billing portal.");
      }

      window.location.assign(payload.url);
    } catch (portalError) {
      setError(portalError instanceof Error ? portalError.message : "Unable to open the billing portal.");
      setIsPending(false);
    }
  }

  return (
    <div className="billing-button-stack">
      <button className={className} disabled={disabled || isPending} onClick={handlePortal} type="button">
        {isPending ? "Opening portal..." : label}
      </button>
      {error ? <p className="billing-inline-error">{error}</p> : null}
    </div>
  );
}
