import { PlatformIcon } from "@/components/studio/platform-icon";
import type { Platform } from "@/lib/platforms";

type ConnectedAccount = {
  id: string;
  username: string | null;
  display_name: string | null;
};

export function PlatformCard({
  platform,
  hint,
  accounts,
  connectLabel,
  anotherLabel,
  notConnectedLabel,
  connectedLabel,
}: {
  platform: Platform;
  hint: string;
  accounts: ConnectedAccount[];
  connectLabel: string;
  anotherLabel: string;
  notConnectedLabel: string;
  connectedLabel: string;
}) {
  const connected = accounts.length > 0;

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
            <p className="mt-0.5 text-sm text-[#6B7280]">{hint}</p>
          </div>
        </div>
        <a
          href={`/api/connect?platform=${platform.id}`}
          className="shrink-0 rounded-full bg-[#FF4713] px-3 py-2 text-xs text-white shadow-sm transition duration-150 hover:scale-105 hover:bg-[#e03d0f] hover:shadow-md"
        >
          {connected ? anotherLabel : connectLabel}
        </a>
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
