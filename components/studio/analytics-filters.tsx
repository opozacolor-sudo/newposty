"use client";

import { useRouter, usePathname } from "@/i18n/navigation";

const pill =
  "h-9 max-w-full rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-900";

export function AnalyticsFilters({
  platforms,
  accounts,
  values,
  labels,
}: {
  platforms: Array<{ id: string; label: string }>;
  accounts: Array<{ id: string; label: string }>;
  values: {
    platform: string;
    account: string;
    source: string;
    range: string;
  };
  labels: {
    allPlatforms: string;
    allAccounts: string;
    allSources: string;
    authored: string;
    external: string;
    last7: string;
    last30: string;
    last90: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();

  function apply(next: Partial<typeof values>) {
    const merged = { ...values, ...next };
    const params = new URLSearchParams();
    if (merged.platform) params.set("platform", merged.platform);
    if (merged.account) params.set("account", merged.account);
    if (merged.source && merged.source !== "all") params.set("source", merged.source);
    if (merged.range && merged.range !== "30") params.set("range", merged.range);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <select
        className={pill}
        value={values.platform}
        onChange={(event) => apply({ platform: event.target.value })}
        aria-label={labels.allPlatforms}
      >
        <option value="">{labels.allPlatforms}</option>
        {platforms.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.label}
          </option>
        ))}
      </select>
      <select
        className={pill}
        value={values.account}
        onChange={(event) => apply({ account: event.target.value })}
        aria-label={labels.allAccounts}
      >
        <option value="">{labels.allAccounts}</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.label}
          </option>
        ))}
      </select>
      <select
        className={pill}
        value={values.source}
        onChange={(event) => apply({ source: event.target.value })}
        aria-label={labels.allSources}
      >
        <option value="all">{labels.allSources}</option>
        <option value="late">{labels.authored}</option>
        <option value="external">{labels.external}</option>
      </select>
      <select
        className={pill}
        value={values.range}
        onChange={(event) => apply({ range: event.target.value })}
        aria-label={labels.last30}
      >
        <option value="7">{labels.last7}</option>
        <option value="30">{labels.last30}</option>
        <option value="90">{labels.last90}</option>
      </select>
    </div>
  );
}
