"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { NeedClient } from "@/components/studio/need-client";

export function TeamGate({
  needsClient,
  children,
}: {
  needsClient: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const gated =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/accounts");
  if (needsClient && gated) return <NeedClient />;
  return children;
}
