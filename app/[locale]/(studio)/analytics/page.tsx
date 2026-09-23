import { getTranslations } from "next-intl/server";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import { loadScopedAnalytics, loadStudioScopeWithProfile } from "@/lib/studio-feed";

function isoDaysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const params = await searchParams;
  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const posting = scope.accounts.filter((account) => isPlatformId(account.platform));
  const from = params.from || isoDaysAgo(30);
  const to = params.to || new Date().toISOString().slice(0, 10);
  const result =
    posting.length === 0
      ? { rows: [], error: null }
      : await loadScopedAnalytics(scope, {
          accountId: params.account,
          platform: params.platform,
          source: params.source,
          fromDate: from,
          toDate: to,
          sortBy: params.sort === "engagement" ? "engagement" : "date",
          order: "desc",
        });

  const totals = result.rows.reduce(
    (sum, row) => ({
      impressions: sum.impressions + row.impressions,
      reach: sum.reach + row.reach,
      likes: sum.likes + row.likes,
      comments: sum.comments + row.comments,
      views: sum.views + row.views,
    }),
    { impressions: 0, reach: 0, likes: 0, comments: 0, views: 0 },
  );

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("analyticsTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("analyticsLead")}</p>
      {posting.length === 0 ? (
        <p className="mt-6 text-sm">
          <Link href="/connections" className="font-medium text-[#FF4713]">
            {t("connectFirst")}
          </Link>
        </p>
      ) : (
        <>
          <FilterForm submit={t("apply")}>
            <FilterField label={t("platform")}>
              <select name="platform" defaultValue={params.platform ?? ""} className={filterControl}>
                <option value="">{t("all")}</option>
                {[...new Set(posting.map((account) => account.platform))].map((platform) => (
                  <option key={platform} value={platform}>
                    {platformLabel(platform)}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label={t("account")}>
              <select name="account" defaultValue={params.account ?? ""} className={filterControl}>
                <option value="">{t("all")}</option>
                {posting.map((account) => (
                  <option key={account.zernioAccountId} value={account.zernioAccountId}>
                    {platformLabel(account.platform)} · {account.username || account.display_name}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label={t("source")}>
              <select name="source" defaultValue={params.source ?? "all"} className={filterControl}>
                <option value="all">{t("all")}</option>
                <option value="late">{t("authored")}</option>
                <option value="external">{t("external")}</option>
              </select>
            </FilterField>
            <FilterField label={t("sort")}>
              <select name="sort" defaultValue={params.sort ?? "date"} className={filterControl}>
                <option value="date">{t("newest")}</option>
                <option value="engagement">{t("engagement")}</option>
              </select>
            </FilterField>
            <FilterField label={t("from")}>
              <input type="date" name="from" defaultValue={from} className={filterControl} />
            </FilterField>
            <FilterField label={t("to")}>
              <input type="date" name="to" defaultValue={to} className={filterControl} />
            </FilterField>
          </FilterForm>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                ["impressions", totals.impressions],
                ["reach", totals.reach],
                ["likes", totals.likes],
                ["comments", totals.comments],
                ["views", totals.views],
              ] as const
            ).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-neutral-100 px-4 py-3">
                <dt className="text-xs text-neutral-500">{t(key)}</dt>
                <dd className="mt-1 text-lg font-semibold">{value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <StudioNotice
        kind={result.error}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-100">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-neutral-500">
            <tr>
              <th className="px-3 py-2 font-medium">{t("postsTitle")}</th>
              <th className="px-3 py-2 font-medium">{t("platform")}</th>
              <th className="px-3 py-2 font-medium">{t("impressions")}</th>
              <th className="px-3 py-2 font-medium">{t("reach")}</th>
              <th className="px-3 py-2 font-medium">{t("likes")}</th>
              <th className="px-3 py-2 font-medium">{t("comments")}</th>
              <th className="px-3 py-2 font-medium">{t("shares")}</th>
              <th className="px-3 py-2 font-medium">{t("views")}</th>
              <th className="px-3 py-2 font-medium">{t("clicks")}</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, index) => (
              <tr key={`${row.id}-${row.accountId}-${index}`} className="border-t border-neutral-100">
                <td className="max-w-xs px-3 py-3">
                  <p className="line-clamp-2">{row.content || "—"}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {row.username ? `@${row.username.replace(/^@/, "")}` : ""}
                    {row.publishedAt ? ` · ${new Date(row.publishedAt).toLocaleDateString()}` : ""}
                    {row.url ? (
                      <>
                        {" "}
                        <a href={row.url} className="text-[#FF4713]" target="_blank" rel="noreferrer">
                          URL
                        </a>
                      </>
                    ) : null}
                  </p>
                </td>
                <td className="px-3 py-3">{platformLabel(row.platform)}</td>
                <td className="px-3 py-3">{row.impressions.toLocaleString()}</td>
                <td className="px-3 py-3">{row.reach.toLocaleString()}</td>
                <td className="px-3 py-3">{row.likes.toLocaleString()}</td>
                <td className="px-3 py-3">{row.comments.toLocaleString()}</td>
                <td className="px-3 py-3">{row.shares.toLocaleString()}</td>
                <td className="px-3 py-3">{row.views.toLocaleString()}</td>
                <td className="px-3 py-3">{row.clicks.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {posting.length > 0 && result.rows.length === 0 && !result.error ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}
