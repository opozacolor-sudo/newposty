import type { ReactNode } from "react";
import { MarketingFooter } from "./footer";
import { MarketingHeader } from "./header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing flex min-h-dvh flex-col overflow-x-hidden bg-white text-neutral-900">
      <MarketingHeader />
      <main className="flex flex-1 flex-col lg:min-h-0">{children}</main>
      <MarketingFooter />
    </div>
  );
}
