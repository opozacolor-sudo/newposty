import { getTranslations } from "next-intl/server";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isAdsPlatformId, platformLabel } from "@/lib/platforms";
import { loadScopedCampaigns, loadStudioScopeWithProfile } from "@/lib/studio-feed";

export default async function AdsCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const params = await searchParams;
  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const ads = scope.accounts.filter((account) => isAdsPlatformId(account.platform));
  const result =
    ads.length === 0
      ? { rows: [], error: null }
      : await loadScopedCampaigns(scope, {
          accountId: params.account,
          platform: params.platform,
          fromDate: params.from,
          toDate: params.to,
          status: params.status,
        });

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("adsTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("adsLead")}</p>
      {ads.length === 0 ? (
        <p className="mt-6 text-sm">
          <Link href="/connections#promotions" className="font-medium text-[#FF4713]">
            {t("connectFirst")}
          </Link>
        </p>
      ) : (
        <FilterForm submit={t("apply")}>
          <FilterField label={t("platform")}>
            <select name="platform" defaultValue={params.platform ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              {[...new Set(ads.map((account) => account.platform))].map((platform) => (
                <option key={platform} value={platform}>
                  {platformLabel(platform)}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label={t("account")}>
            <select name="account" defaultValue={params.account ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              {ads.map((account) => (
                <option key={account.zernioAccountId} value={account.zernioAccountId}>
                  {platformLabel(account.platform)} · {account.username || account.display_name}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label={t("status")}>
            <select name="status" defaultValue={params.status ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              <option value="active">{t("active")}</option>
              <option value="past">{t("past")}</option>
            </select>
          </FilterField>
          <FilterField label={t("from")}>
            <input type="date" name="from" defaultValue={params.from ?? ""} className={filterControl} />
          </FilterField>
          <FilterField label={t("to")}>
            <input type="date" name="to" defaultValue={params.to ?? ""} className={filterControl} />
          </FilterField>
        </FilterForm>
      )}
      <StudioNotice
        kind={result.error}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <p className="mt-3 text-sm text-neutral-500">{t("createInChat")}</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {result.rows.map((row) => (
          <li key={`${row.accountId}-${row.id}`} className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {platformLabel(row.platform)}
                  {row.username ? ` · ${row.username}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                {row.status || "—"}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">{t("spend")}</dt>
                <dd className="font-semibold">{row.spend.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">{t("impressions")}</dt>
                <dd className="font-semibold">{row.impressions.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">{t("clicks")}</dt>
                <dd className="font-semibold">{row.clicks.toLocaleString()}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      {ads.length > 0 && result.rows.length === 0 && !result.error ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}
