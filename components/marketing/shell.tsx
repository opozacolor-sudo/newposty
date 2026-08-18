import type { ReactNode } from "react";
import { MarketingFooter } from "./footer";
import { MarketingHeader } from "./header";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing flex min-h-full flex-col overflow-x-hidden bg-white text-neutral-900 scroll-smooth">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
