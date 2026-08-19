import {
  COMMENT_INBOX_PLATFORMS,
  platformHasLimitedStats,
} from "@/lib/platforms";
import {
  previousEquivalentRange,
  rangeFromPreset,
  type AccountAnalytics,
  type AnalyticsCard,
  type AnalyticsComment,
  type AnalyticsKpi,
} from "@/lib/analytics-shared";
import {
  getDailyMetrics,
  getFollowerStats,
  getInboxPostComments,
  getPostAnalytics,
  listInboxComments,
  type ZernioDailyMetrics,
} from "@/lib/zernio";

export type {
  AccountAnalytics,
  AnalyticsCard,
  AnalyticsComment,
  AnalyticsKpi,
  AnalyticsTopPost,
} from "@/lib/analytics-shared";
export { isValidYmd, previousEquivalentRange, rangeFromPreset } from "@/lib/analytics-shared";

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sumDaily(data: ZernioDailyMetrics | null) {
  let posts = 0;
  let impressions = 0;
  let views = 0;
  let likes = 0;
  let comments = 0;
  let shares = 0;
  for (const day of data?.dailyData ?? []) {
    posts += num(day.postCount);
    impressions += num(day.metrics?.impressions);
    views += num(day.metrics?.views);
    likes += num(day.metrics?.likes);
    comments += num(day.metrics?.comments);
    shares += num(day.metrics?.shares);
  }
  const visibility = impressions > 0 ? impressions : views;
  return {
    posts,
    impressions,
    views,
    visibility,
    likes,
    comments,
    shares,
    engagement: likes + comments + shares,
  };
}

function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

function kpi(value: number, previous: number, available: boolean): AnalyticsKpi {
  return {
    value,
    delta: available ? delta(value, previous) : null,
    available,
  };
}

async function swallow<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function analyticsPosts(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) {
    return body.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  const record = asRecord(body);
  const list = record?.posts ?? record?.data ?? record?.items ?? record?.results;
  if (Array.isArray(list)) {
    return list.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  if (record?.postId || record?.analytics) return [record];
  return [];
}

function postMetrics(post: Record<string, unknown>) {
  const analytics = asRecord(post.analytics) ?? {};
  const likes = num(analytics.likes);
  const comments = num(analytics.comments);
  const shares = num(analytics.shares);
  const impressions = num(analytics.impressions);
  const views = num(analytics.views);
  return {
    likes,
    comments,
    shares,
    views: impressions > 0 ? impressions : views,
    engagement: likes + comments + shares,
  };
}

export async function loadOverviewCards(
  profileId: string,
  accounts: Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>,
): Promise<AnalyticsCard[]> {
  const range = rangeFromPreset(30);
  const followerStats = await swallow(() =>
    getFollowerStats({
      profileId,
      accountIds: accounts.map((account) => account.zernio_account_id).join(","),
      fromDate: range.from,
      toDate: range.to,
    }),
  );

  const followerById = new Map(
    (followerStats?.accounts ?? []).map((account) => [account._id, account]),
  );

  const daily = await Promise.all(
    accounts.map((account) =>
      swallow(() =>
        getDailyMetrics({
          profileId,
          accountId: account.zernio_account_id,
          platform: account.platform,
          fromDate: range.from,
          toDate: range.to,
          attribution: "publish",
        }),
      ),
    ),
  );

  return accounts.map((account, index) => {
    const sums = sumDaily(daily[index]);
    const followers = followerById.get(account.zernio_account_id)?.currentFollowers;
    const limited = platformHasLimitedStats(account.platform);
    return {
      accountId: account.id,
      platform: account.platform,
      username: account.username,
      displayName: account.display_name,
      posts30d: daily[index] ? sums.posts : null,
      engagement30d: daily[index] ? sums.engagement : null,
      followers: typeof followers === "number" ? followers : null,
      limited,
    };
  });
}

export async function loadAccountAnalytics(input: {
  profileId: string;
  accountId: string;
  platform: string;
  from: string;
  to: string;
}): Promise<AccountAnalytics> {
  const limited = platformHasLimitedStats(input.platform);
  const previous = previousEquivalentRange(input.from, input.to);
  const commentsSupported = COMMENT_INBOX_PLATFORMS.has(input.platform);

  const [currentDaily, previousDaily, postsBody, followerCurrent, followerPrevious] =
    await Promise.all([
      swallow(() =>
        getDailyMetrics({
          profileId: input.profileId,
          accountId: input.accountId,
          platform: input.platform,
          fromDate: input.from,
          toDate: input.to,
          attribution: "received",
        }),
      ),
      swallow(() =>
        getDailyMetrics({
          profileId: input.profileId,
          accountId: input.accountId,
          platform: input.platform,
          fromDate: previous.from,
          toDate: previous.to,
          attribution: "received",
        }),
      ),
      swallow(() =>
        getPostAnalytics({
          profileId: input.profileId,
          accountId: input.accountId,
          platform: input.platform,
          fromDate: input.from,
          toDate: input.to,
          limit: 50,
          sortBy: "engagement",
          order: "desc",
        }),
      ),
      swallow(() =>
        getFollowerStats({
          profileId: input.profileId,
          accountIds: input.accountId,
          fromDate: input.from,
          toDate: input.to,
        }),
      ),
      swallow(() =>
        getFollowerStats({
          profileId: input.profileId,
          accountIds: input.accountId,
          fromDate: previous.from,
          toDate: previous.to,
        }),
      ),
    ]);

  const current = sumDaily(currentDaily);
  const prev = sumDaily(previousDaily);
  const visibilityAvailable = !limited;
  const rateAvailable = visibilityAvailable && current.visibility > 0;
  const followerAccount = followerCurrent?.accounts?.[0];
  const prevFollowerAccount = followerPrevious?.accounts?.[0];
  const newFollowers = typeof followerAccount?.growth === "number" ? followerAccount.growth : null;
  const prevGrowth =
    typeof prevFollowerAccount?.growth === "number" ? prevFollowerAccount.growth : 0;
  const followersAvailable = newFollowers !== null;

  const posts = analyticsPosts(postsBody)
    .map((post) => {
      const metrics = postMetrics(post);
      const media = Array.isArray(post.mediaItems)
        ? post.mediaItems.find((item) => asRecord(item)?.thumbnail || asRecord(item)?.url)
        : null;
      const mediaRecord = asRecord(media);
      return {
        id: String(post.postId ?? post.id ?? ""),
        content: String(post.content ?? ""),
        publishedAt:
          typeof post.publishedAt === "string"
            ? post.publishedAt
            : typeof post.scheduledFor === "string"
              ? post.scheduledFor
              : null,
        thumbnailUrl:
          (typeof post.thumbnailUrl === "string" && post.thumbnailUrl) ||
          (typeof mediaRecord?.thumbnail === "string" && mediaRecord.thumbnail) ||
          (typeof mediaRecord?.url === "string" && mediaRecord.url) ||
          null,
        views: limited ? null : metrics.views,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        url: typeof post.platformPostUrl === "string" ? post.platformPostUrl : null,
        engagement: metrics.engagement,
      };
    })
    .filter((post) => post.id)
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  const comments = commentsSupported
    ? await loadRecentComments({
        accountId: input.accountId,
        platform: input.platform,
        since: `${input.from}T00:00:00.000Z`,
      })
    : { available: false, items: [] as AnalyticsComment[] };

  const chartMetric = limited ? "engagement" : "visibility";
  const chart = (currentDaily?.dailyData ?? []).map((day) => ({
    date: day.date,
    value: limited
      ? num(day.metrics?.likes) + num(day.metrics?.comments) + num(day.metrics?.shares)
      : num(day.metrics?.impressions) > 0
        ? num(day.metrics?.impressions)
        : num(day.metrics?.views),
  }));

  const empty = current.posts === 0 && posts.length === 0;

  return {
    limited,
    empty,
    commentsAvailable: comments.available,
    kpis: {
      visibility: kpi(current.visibility, prev.visibility, visibilityAvailable),
      engagement: kpi(current.engagement, prev.engagement, true),
      comments: kpi(current.comments, prev.comments, true),
      followers: kpi(newFollowers ?? 0, prevGrowth, followersAvailable),
      engagementRate: kpi(
        rateAvailable ? (current.engagement / current.visibility) * 100 : 0,
        prev.visibility > 0 ? (prev.engagement / prev.visibility) * 100 : 0,
        rateAvailable,
      ),
    },
    chart,
    chartMetric,
    topPosts: posts,
    comments: comments.items,
  };
}

async function loadRecentComments(input: {
  accountId: string;
  platform: string;
  since: string;
}): Promise<{ available: boolean; items: AnalyticsComment[] }> {
  const listed = await swallow(() =>
    listInboxComments({
      accountId: input.accountId,
      platform: input.platform,
      since: input.since,
      limit: 8,
      minComments: 1,
      sortBy: "date",
      sortOrder: "desc",
    }),
  );
  if (!listed) return { available: false, items: [] };

  const posts = (listed.data ?? []).slice(0, 3);
  const threads = await Promise.all(
    posts.map((post) =>
      swallow(() => getInboxPostComments(post.id, input.accountId, 5)).then((result) => ({
        post,
        comments: result?.comments ?? [],
      })),
    ),
  );

  const items = threads
    .flatMap(({ post, comments }) =>
      comments.map((comment, index) => ({
        id: comment.id ?? `${post.id}-${index}`,
        author: comment.from?.name || comment.from?.username || post.accountUsername || "—",
        avatarUrl: comment.from?.picture ?? null,
        message: comment.message ?? "",
        postPreview: (post.content ?? "").slice(0, 80),
        createdAt: comment.createdTime ?? null,
      })),
    )
    .filter((comment) => comment.message)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 8);

  return { available: true, items };
}
