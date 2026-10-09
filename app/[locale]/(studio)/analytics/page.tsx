import { getLocale, getTranslations } from "next-intl/server";
import { AnalyticsBoardView } from "@/components/studio/analytics-board";
import { StudioPage } from "@/components/studio/studio-surface";
import { AnalyticsFilters } from "@/components/studio/analytics-filters";
import { StudioNotice } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import { emptyAnalyticsBoard, loadAnalyticsBoard, loadStudioScopeWithProfile } from "@/lib/studio-feed";

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
  const locale = await getLocale();
  const { user } = await requireUser();
  const params = await searchParams;
  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const posting = scope.accounts.filter((account) => isPlatformId(account.platform));
  const range = params.range === "7" || params.range === "90" ? params.range : "30";
  const rangeDays = Number(range);
  const from = isoDaysAgo(rangeDays);
  const to = new Date().toISOString().slice(0, 10);
  const result =
    posting.length === 0
      ? { board: emptyAnalyticsBoard(), error: null }
      : await loadAnalyticsBoard(scope, {
          accountId: params.account,
          platform: params.platform,
          source: params.source,
          fromDate: from,
          toDate: to,
          sortBy: "date",
          order: "desc",
        });

  return (
    <StudioPage>
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("analyticsTitle")}</h1>
      {posting.length === 0 ? (
        <p className="mt-6 text-sm">
          <Link href="/connections" className="font-medium text-[#FF4713]">
            {t("connectFirst")}
          </Link>
        </p>
      ) : (
        <AnalyticsFilters
          platforms={[...new Set(posting.map((account) => account.platform))].map((platform) => ({
            id: platform,
            label: platformLabel(platform),
          }))}
          accounts={posting.map((account) => ({
            id: account.zernioAccountId,
            label: `${platformLabel(account.platform)} · ${account.username || account.display_name}`,
          }))}
          values={{
            platform: params.platform ?? "",
            account: params.account ?? "",
            source: params.source ?? "all",
            range,
          }}
          labels={{
            allPlatforms: t("allPlatforms"),
            allAccounts: t("allAccounts"),
            allSources: t("allSources"),
            authored: t("authored"),
            external: t("external"),
            last7: t("last7"),
            last30: t("last30"),
            last90: t("last90"),
          }}
        />
      )}
      <StudioNotice
        kind={result.error}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      {posting.length > 0 ? (
        <AnalyticsBoardView
          board={result.board}
          locale={locale}
          rangeDays={rangeDays}
          labels={{
            engagementRate: t("engagementRate"),
            totalReach: t("totalReach"),
            totalFollowers: t("totalFollowers"),
            postsPeriod: t("postsPeriod"),
            postsPlatform: t("postsPlatform"),
            postsTime: t("postsTime"),
            bestPost: t("bestPost"),
            viewPost: t("viewPost"),
            vsPrior: t("vsPrior"),
            inLastDays: t("inLastDays"),
            postsTotal: t("postsTotal"),
            topByPosts: t("topByPosts"),
            postsPerWeek: t("postsPerWeek"),
            likesPlatform: t("likesPlatform"),
            likesTime: t("likesTime"),
            engagementTime: t("engagementTime"),
            bestTime: t("bestTime"),
            less: t("heatLess"),
            more: t("heatMore"),
            bestTimes: t("bestTimes"),
            followerEvolution: t("followerEvolution"),
            followersPerPlatform: t("followersPerPlatform"),
            followersTotal: t("followersTotal"),
            formats: t("formats"),
            formatAvg: t("formatAvg"),
            bestFormat: t("bestFormat"),
            vsAvg: t("vsAvg"),
            breakdown: t("breakdown"),
            topPosts: t("topPosts"),
            cadenceTitle: t("cadenceTitle"),
            cadenceHint: t("cadenceHint"),
            optimalCadence: t("optimalCadence"),
            perWeek: t("perWeek"),
            likes: t("likes"),
            comments: t("comments"),
            shares: t("shares"),
            saves: t("saves"),
            views: t("views"),
            impressions: t("impressions"),
            reach: t("reach"),
            clicks: t("clicks"),
            posts: t("postsTitle"),
            noContent: t("noContent"),
            days: [t("daySun"), t("dayMon"), t("dayTue"), t("dayWed"), t("dayThu"), t("dayFri"), t("daySat")],
          }}
        />
      ) : null}
    </StudioPage>
  );
}
