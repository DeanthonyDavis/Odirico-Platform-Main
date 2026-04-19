import type { ReactNode } from "react";

import "@/app/(marketing)/marketing.css";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { getUserContext } from "@/lib/auth/session";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const userContext = await getUserContext();

  return <MarketingShell userContext={userContext}>{children}</MarketingShell>;
}
