import { BlueskyConnectButton } from "@/components/studio/bluesky-connect-button";
import { OpenAIAdsConnectButton } from "@/components/studio/openai-ads-connect-button";
import { PlatformIcon } from "@/components/studio/platform-icon";

type ConnectedAccount = {
  id: string;
  username: string | null;
  display_name: string | null;
};

export type AccountCardRow = {
  label: string;
  value: string;
  badge?: string;
  tooltip?: string;
  note?: string;
};

export function AccountCard({
  platform,
  accounts,
  rows,
  newBadge,
  footerNote,
  connectForce,
  connectLabel,
  anotherLabel,
  notConnectedLabel,
  connectedLabel,
}: {
  platform: {
    id: string;
    label: string;
    brand: string;
    iconBg: string;
    icon: { path: string };
  };
  accounts: ConnectedAccount[];
  rows: AccountCardRow[];
  newBadge?: string;
  footerNote?: string;
  connectForce?: boolean;
  connectLabel: string;
  anotherLabel: string;
  notConnectedLabel: string;
  connectedLabel: string;
}) {
  const connected = accounts.length > 0;
  const actionLabel = connected ? anotherLabel : connectLabel;
  const connectHref = `/api/connect?platform=${platform.id}${
    connected && connectForce ? "&force=1" : ""
  }`;

  return (
    <li
      className="relative rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--brand)_55%,transparent)]"
      style={{
        ["--brand" as string]: platform.brand,
        borderLeftWidth: connected ? 4 : 1,
        borderLeftColor: connected ? platform.brand : "#E5E5E5",
      }}
    >
      {newBadge ? (
        <span className="absolute right-3 top-3 rounded-full bg-[#FF4713] px-2 py-0.5 text-[10px] font-medium text-white">
          {newBadge}
        </span>
      ) : null}

      <div className={`flex items-start justify-between gap-3 ${newBadge ? "pr-10" : ""}`}>
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
        ) : platform.id === "openaiads" ? (
          <OpenAIAdsConnectButton label={actionLabel} />
        ) : (
          <a
            href={connectHref}
            className="shrink-0 rounded-full bg-[#FF4713] px-3 py-2 text-xs text-white shadow-sm transition duration-150 hover:scale-105 hover:bg-[#e03d0f] hover:shadow-md"
          >
            {actionLabel}
          </a>
        )}
      </div>

      <div className="mt-3 space-y-1 text-[11px] leading-4 text-[#6B7280]">
        {rows.map((row) => (
          <p key={row.label} className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-[#4B5563]">{row.label}</span>
            {row.badge ? (
              <>
                <span className="group relative inline-flex">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                    {row.badge}
                  </span>
                  {row.tooltip ? (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-56 -translate-x-1/2 rounded-lg bg-[#1A1A1A] px-2 py-1.5 text-[10px] leading-4 text-white shadow-md group-hover:block">
                      {row.tooltip}
                    </span>
                  ) : null}
                </span>
                {row.note ? <span>({row.note})</span> : null}
              </>
            ) : (
              <span>{row.value}</span>
            )}
          </p>
        ))}
        {footerNote ? <p>{footerNote}</p> : null}
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
