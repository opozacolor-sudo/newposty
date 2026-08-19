import { BlueskyConnectButton } from "@/components/studio/bluesky-connect-button";
import { PlatformIcon } from "@/components/studio/platform-icon";
import type { Platform } from "@/lib/platforms";

type ConnectedAccount = {
  id: string;
  username: string | null;
  display_name: string | null;
};

export function PlatformCard({
  platform,
  canPost,
  accounts,
  connectLabel,
  anotherLabel,
  notConnectedLabel,
  connectedLabel,
  canPostLabel,
  statsLabel,
  statsCompleteLabel,
  statsLimitedLabel,
  statsLimitedNote,
  statsLimitedTooltip,
}: {
  platform: Platform;
  canPost: string;
  accounts: ConnectedAccount[];
  connectLabel: string;
  anotherLabel: string;
  notConnectedLabel: string;
  connectedLabel: string;
  canPostLabel: string;
  statsLabel: string;
  statsCompleteLabel: string;
  statsLimitedLabel: string;
  statsLimitedNote?: string;
  statsLimitedTooltip: string;
}) {
  const connected = accounts.length > 0;
  const limited = platform.stats === "limited";
  const actionLabel = connected ? anotherLabel : connectLabel;

  return (
    <li
      className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:shadow-md"
      style={{
        ["--brand" as string]: platform.brand,
        borderLeftWidth: connected ? 4 : 1,
        borderLeftColor: connected ? platform.brand : "#E5E5E5",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <PlatformIcon platform={platform} connected={connected} />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
              {platform.label}
            </h2>
          </div>
        </div>
        {platform.id === "bluesky" ? (
          <BlueskyConnectButton label={actionLabel} />
        ) : (
          <a
            href={`/api/connect?platform=${platform.id}`}
            className="shrink-0 rounded-full bg-[#FF4713] px-3 py-2 text-xs text-white shadow-sm transition duration-150 hover:scale-105 hover:bg-[#e03d0f] hover:shadow-md"
          >
            {actionLabel}
          </a>
        )}
      </div>

      <div className="mt-3 space-y-1 text-[11px] leading-4 text-[#6B7280]">
        <p>
          <span className="font-medium text-[#4B5563]">{canPostLabel}</span> {canPost}
        </p>
        <p className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-[#4B5563]">{statsLabel}</span>
          {limited ? (
            <>
              <span className="group relative inline-flex">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                  {statsLimitedLabel}
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-56 -translate-x-1/2 rounded-lg bg-[#1A1A1A] px-2 py-1.5 text-[10px] leading-4 text-white shadow-md group-hover:block">
                  {statsLimitedTooltip}
                </span>
              </span>
              {statsLimitedNote ? (
                <span className="text-[#6B7280]">({statsLimitedNote})</span>
              ) : null}
            </>
          ) : (
            <span>{statsCompleteLabel}</span>
          )}
        </p>
      </div>

      {connected ? (
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-500" />
            {connectedLabel}
          </p>
          <ul className="space-y-1 text-sm text-[#6B7280]">
            {accounts.map((account) => (
              <li key={account.id} className="truncate">
                {account.username
                  ? `@${account.username.replace(/^@/, "")}`
                  : (account.display_name ?? connectedLabel)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#6B7280]">{notConnectedLabel}</p>
      )}
    </li>
  );
}
