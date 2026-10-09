"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { DisconnectButton } from "@/components/studio/disconnect-button";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { StudioGlass } from "@/components/studio/studio-surface";

export type ConnectionItem = {
  id: string;
  label: string;
  brand: string;
  iconBg: string;
  iconPath: string;
  connectHref: string;
  comingSoon?: string;
  accounts: Array<{ id: string; username: string | null; display_name: string | null }>;
};

function accountLine(accounts: ConnectionItem["accounts"]) {
  const first = accounts[0]?.username || accounts[0]?.display_name || "";
  const handle = first.replace(/^@/, "");
  const name = handle ? `@${handle}` : "";
  if (accounts.length > 1 && name) return `${name} +${accounts.length - 1}`;
  return name;
}

export function ConnectionList({
  title,
  items,
  disconnectLabel,
  connectLabel,
  connectedLabel,
  connectAnotherLabel,
}: {
  title: string;
  items: ConnectionItem[];
  disconnectLabel: string;
  connectLabel: string;
  connectedLabel: string;
  connectAnotherLabel: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mt-7">
      <h2 className="px-1 text-[13px] font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
      <StudioGlass className="mt-2.5">
        <ul>
          {items.map((item) => {
            const expanded = open === item.id;
            const connected = item.accounts.length > 0;
            const line = connected ? accountLine(item.accounts) : "";
            return (
              <li key={item.id} className="border-b border-white/25 last:border-b-0">
                <div className="flex items-center gap-3 px-3.5 py-2.5">
                  <PlatformIcon
                    size="sm"
                    connected={connected}
                    platform={{ id: item.id, label: item.label, iconBg: item.iconBg, icon: { path: item.iconPath } }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#1d1d1f]">{item.label}</span>
                    {line ? <span className="block truncate text-[11px] text-[#5c5652]">{line}</span> : null}
                  </span>
                  {item.comingSoon ? (
                    <span className="shrink-0 text-xs text-[#5c5652]">{item.comingSoon}</span>
                  ) : connected ? (
                    <span className="posty-clay-tile shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#1d1d1f]">
                      {connectedLabel}
                    </span>
                  ) : (
                    <a href={item.connectHref} className="posty-site-btn shrink-0 !px-2.5 !py-1 text-[11px] font-medium">
                      {connectLabel}
                    </a>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#5c5652] hover:bg-white/20"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : item.id)}
                  >
                    <ChevronRight size={16} className={expanded ? "rotate-90 transition" : "transition"} />
                  </button>
                </div>
                {expanded && !item.comingSoon ? (
                  <div className="space-y-2 px-14 pb-3">
                    {item.accounts.length === 0 ? (
                      <p className="text-xs text-[#5c5652]">{connectLabel}</p>
                    ) : (
                      <>
                        {item.accounts.map((account) => (
                          <div key={account.id} className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate text-[#3f3b38]">
                              {account.username || account.display_name || item.label}
                            </span>
                            <DisconnectButton accountId={account.id} label={disconnectLabel} />
                          </div>
                        ))}
                        <a href={item.connectHref} className="inline-flex text-xs font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
                          {connectAnotherLabel}
                        </a>
                      </>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </StudioGlass>
    </section>
  );
}
