"use client";

import { LocaleSwitch } from "@/components/locale-switch";
import { AccountMenu } from "@/components/studio/account-menu";
import { ClientSwitcher } from "@/components/studio/client-switcher";
import { LocaleClock } from "@/components/studio/locale-clock";
import type { ClientRow } from "@/lib/clients";

export function StudioDock({
  email,
  accountKind = "individual",
  clients = [],
  selectedClientId = null,
}: {
  email: string;
  accountKind?: "individual" | "team";
  clients?: ClientRow[];
  selectedClientId?: string | null;
}) {
  return (
    <footer className="shrink-0 border-t border-black/5 bg-white">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-4">
          <LocaleClock compact />
          {accountKind === "team" ? (
            <div className="hidden min-w-[10rem] sm:block">
              <ClientSwitcher clients={clients} selectedId={selectedClientId} />
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <LocaleSwitch variant="fine" />
          <AccountMenu email={email} accountKind={accountKind} variant="dock" />
        </div>
      </div>
    </footer>
  );
}
