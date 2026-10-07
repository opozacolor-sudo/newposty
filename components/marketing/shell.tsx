import type { ReactNode } from "react";
import { MarketingFooter } from "./footer";
import { MarketingHeader } from "./header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing relative flex min-h-dvh flex-col text-[#1d1d1f]">
      <MarketingHeader />
      <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden">{children}</main>
      <MarketingFooter />
    </div>
  );
}
