"use client";

import { ChevronRight, Link2 } from "lucide-react";
import { useState } from "react";
import { DisconnectButton } from "@/components/studio/disconnect-button";
import { PlatformIcon } from "@/components/studio/platform-icon";

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

export function ConnectionList({
  title,
  items,
  disconnectLabel,
  connectLabel,
}: {
  title: string;
  items: ConnectionItem[];
  disconnectLabel: string;
  connectLabel: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mt-6">
      <h2 className="px-1 text-[11px] font-semibold tracking-[0.14em] text-neutral-400">{title}</h2>
      <ul className="mt-2 overflow-hidden rounded-2xl border border-neutral-200">
        {items.map((item) => {
          const expanded = open === item.id;
          const connected = item.accounts.length > 0;
          return (
            <li key={item.id} className="border-b border-neutral-100 last:border-b-0">
              <div className="flex items-center gap-3 px-3 py-2">
                <PlatformIcon
                  size="sm"
                  connected={connected || !item.comingSoon}
                  platform={{ label: item.label, iconBg: item.iconBg, icon: { path: item.iconPath } }}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.label}</span>
                {item.comingSoon ? (
                  <span className="text-xs text-neutral-400">{item.comingSoon}</span>
                ) : (
                  <a
                    href={item.connectHref}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label={connectLabel}
                  >
                    <Link2 size={16} />
                  </a>
                )}
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : item.id)}
                >
                  <ChevronRight size={16} className={expanded ? "rotate-90 transition" : "transition"} />
                </button>
              </div>
              {expanded && !item.comingSoon ? (
                <div className="space-y-2 px-14 pb-3">
                  {item.accounts.length === 0 ? (
                    <p className="text-xs text-neutral-500">{connectLabel}</p>
                  ) : (
                    item.accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-neutral-700">
                          {account.username || account.display_name || item.label}
                        </span>
                        <DisconnectButton accountId={account.id} label={disconnectLabel} />
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
