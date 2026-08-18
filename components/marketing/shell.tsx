import type { ReactNode } from "react";
import { MarketingFooter } from "./footer";
import { MarketingHeader } from "./header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing flex min-h-dvh flex-col overflow-x-hidden bg-white text-neutral-900">
      <MarketingHeader />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <MarketingFooter />
    </div>
  );
}
