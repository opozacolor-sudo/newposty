import type { ReactNode } from "react";
import { StudioSidebar } from "@/components/studio/sidebar";
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
    <div className="flex min-h-dvh flex-col bg-white text-[#1A1A1A] lg:h-dvh lg:flex-row lg:overflow-hidden">
      <StudioSidebar
        email={email}
        accountKind={accountKind}
        clients={clients}
        selectedClientId={selectedClientId}
      />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:h-full lg:overflow-hidden">{children}</div>
    </div>
  );
}
