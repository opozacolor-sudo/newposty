import type { ReactNode } from "react";
import { MarketingFooter } from "./footer";
import { MarketingHeader } from "./header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing flex min-h-dvh flex-col bg-[#E4EEF0] text-neutral-900">
      <MarketingHeader />
      <main className="flex flex-1 flex-col overflow-x-hidden">{children}</main>
      <div className="h-2 shrink-0 bg-[#F1F6F4] sm:h-2.5" />
      <MarketingFooter />
    </div>
  );
}
