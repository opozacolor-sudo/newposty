import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/footer";
import { StudioTopNav } from "@/components/studio/studio-top-nav";
import type { ClientRow } from "@/lib/clients";

export function StudioChrome({
  email,
  accountKind = "individual",
  clients = [],
  selectedClientId = null,
  children,
}: {
  email: string;
  accountKind?: "individual" | "team";
  clients?: ClientRow[];
  selectedClientId?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="marketing studio relative flex h-dvh flex-col overflow-hidden text-[#1d1d1f]">
      <StudioTopNav
        email={email}
        accountKind={accountKind}
        clients={clients}
        selectedClientId={selectedClientId}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
      <MarketingFooter waitlist={false} />
    </div>
  );
}
