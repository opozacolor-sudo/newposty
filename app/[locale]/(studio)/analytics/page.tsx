import { getTranslations } from "next-intl/server";
import { AnalyticsBoardView } from "@/components/studio/analytics-board";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import { loadAnalyticsBoard, loadStudioScopeWithProfile, type AnalyticsBoard } from "@/lib/studio-feed";

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
  const emptyBoard: AnalyticsBoard = {
    engagementRate: 0,
    reach: 0,
    followers: 0,
    posts: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    views: 0,
    impressions: 0,
    clicks: 0,
    byPlatform: [],
    weeks: [],
    followersSeries: [],
    formats: [],
    top: [],
    heatmap: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)),
    best: [],
  };
  const result =
    posting.length === 0
      ? { board: emptyBoard, error: null }
      : await loadAnalyticsBoard(scope, {
          accountId: params.account,
          platform: params.platform,
          source: params.source,
          fromDate: from,
          toDate: to,
          sortBy: params.sort === "engagement" ? "engagement" : "date",
          order: "desc",
        });

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
        </>
      )}
      <StudioNotice
        kind={result.error}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      {posting.length > 0 ? (
        <AnalyticsBoardView
          board={result.board}
          labels={{
            engagement: t("engagement"),
            reach: t("reach"),
            followers: t("followers"),
            posts: t("postsTitle"),
            postsPlatform: t("postsPlatform"),
            postsTime: t("postsTime"),
            likesPlatform: t("likesPlatform"),
            likesTime: t("likesTime"),
            engagementTime: t("engagementTime"),
            bestTime: t("bestTime"),
            followerEvolution: t("followerEvolution"),
            formats: t("formats"),
            breakdown: t("breakdown"),
            top: t("topPosts"),
            likes: t("likes"),
            comments: t("comments"),
            shares: t("shares"),
            views: t("views"),
            impressions: t("impressions"),
            clicks: t("clicks"),
            saves: t("saves"),
          }}
        />
      ) : null}
    </main>
  );
}
