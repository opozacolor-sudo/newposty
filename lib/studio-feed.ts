import { listActiveSocialAccounts } from "@/lib/account-server";
import {
  analyticsPageCount,
  analyticsPosts,
  engagementRate,
  flattenAnalyticsPost,
  heatmapFromBestTime,
  sumDailyMetrics,
} from "@/lib/analytics-parse";
import { previousEquivalentRange } from "@/lib/analytics-shared";
import { isAdsPlatformId, isPlatformId } from "@/lib/platforms";
import { ownsAccount, platformAccountId, scopeByAccountId, scopePosts } from "@/lib/studio-scope";
import {
  ZernioError,
  getBestTimeToPost,
  getConversation,
  getDailyMetrics,
  getFollowerStats,
  getInboxPostComments,
  listConversationMessages,
  getPostAnalytics,
  listAdCampaigns,
  listConversations,
  listInboxComments,
  listPosts,
  type ZernioConversation,
  type ZernioInboxComment,
  type ZernioInboxCommentPost,
  type ZernioPost,
} from "@/lib/zernio";

export type StudioAccount = {
  id: string;
  platform: string;
  username: string | null;
  display_name: string | null;
  zernioAccountId: string;
};

export type StudioScope = {
  profileId: string | null;
  accounts: StudioAccount[];
  ownedIds: Set<string>;
};

export async function loadStudioScope(userId: string): Promise<StudioScope> {
  const rows = await listActiveSocialAccounts(userId);
  const accounts = rows.flatMap((row) => {
    if (typeof row.zernio_account_id !== "string" || !row.zernio_account_id) return [];
    return [
      {
        id: row.id,
        platform: row.platform,
        username: row.username,
        display_name: row.display_name,
        zernioAccountId: row.zernio_account_id,
      },
    ];
  });
  return {
    profileId: null,
    accounts,
    ownedIds: new Set(accounts.map((account) => account.zernioAccountId)),
  };
}

export async function loadStudioScopeWithProfile(userId: string, profileId: string | null) {
  const scope = await loadStudioScope(userId);
  scope.profileId = profileId;
  return scope;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function feedErrorKind(error: unknown) {
  if (error instanceof ZernioError && (error.status === 402 || error.status === 403)) return "unavailable" as const;
  return "failed" as const;
}

function selectedAccount(scope: StudioScope, accountId: string | undefined, ads: boolean) {
  if (!accountId) return null;
  const account = scope.accounts.find((item) => item.zernioAccountId === accountId);
  if (!account || !ownsAccount(scope.ownedIds, account.zernioAccountId)) return undefined;
  if (ads ? !isAdsPlatformId(account.platform) : !isPlatformId(account.platform)) return undefined;
  return account;
}

export async function loadScopedPosts(
  scope: StudioScope,
  filters: {
    accountId?: string;
    platform?: string;
    status?: string;
    source?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
  },
) {
  if (!scope.profileId) return { posts: [] as ZernioPost[], error: null };
  const chosen = selectedAccount(scope, filters.accountId, false);
  if (chosen === undefined) return { posts: [] as ZernioPost[], error: "unknown" as const };
  const targets = (chosen ? [chosen] : scope.accounts.filter((account) => isPlatformId(account.platform))).filter(
    (account) => !filters.platform || account.platform === filters.platform,
  );
  if (targets.length === 0) return { posts: [] as ZernioPost[], error: null };

  const settled = await Promise.allSettled(
    targets.map((account) =>
      listPosts({
        profileId: scope.profileId as string,
        accountId: account.zernioAccountId,
        platform: filters.platform || undefined,
        status: filters.status || undefined,
        source: filters.source || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        search: filters.search || undefined,
        limit: 25,
      }),
    ),
  );

  const posts: ZernioPost[] = [];
  let error: "failed" | "unavailable" | null = null;
  for (const result of settled) {
    if (result.status === "rejected") {
      error ??= feedErrorKind(result.reason);
      continue;
    }
    posts.push(...scopePosts(result.value.posts ?? [], scope.ownedIds));
  }
  const seen = new Set<string>();
  const unique = posts.filter((post) => {
    if (seen.has(post._id)) return false;
    seen.add(post._id);
    return true;
  });
  unique.sort((a, b) => String(b.scheduledFor ?? "").localeCompare(String(a.scheduledFor ?? "")));
  return { posts: unique, error: unique.length > 0 ? null : error };
}

export type AnalyticsRow = {
  id: string;
  content: string;
  publishedAt: string | null;
  platform: string;
  accountId: string;
  username: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  clicks: number;
  follows: number;
  mediaType: string | null;
};

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

const ANALYTICS_PAGE_SIZE = 50;
const ANALYTICS_MAX_PAGES = 20;

async function swallow<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function loadScopedAnalytics(
  scope: StudioScope,
  filters: {
    accountId?: string;
    platform?: string;
    source?: string;
    fromDate: string;
    toDate: string;
    sortBy?: string;
    order?: string;
  },
) {
  if (!scope.profileId) return { rows: [] as AnalyticsRow[], error: null };
  const chosen = selectedAccount(scope, filters.accountId, false);
  if (chosen === undefined) return { rows: [] as AnalyticsRow[], error: "unknown" as const };
  const targets = (chosen ? [chosen] : scope.accounts.filter((account) => isPlatformId(account.platform))).filter(
    (account) => !filters.platform || account.platform === filters.platform,
  );
  if (targets.length === 0) return { rows: [] as AnalyticsRow[], error: null };

  const rows: AnalyticsRow[] = [];
  let error: "failed" | "unavailable" | null = null;
  let page = 1;
  let pages = 1;
  while (page <= pages && page <= ANALYTICS_MAX_PAGES) {
    try {
      const body = await getPostAnalytics({
        profileId: scope.profileId as string,
        accountId: chosen?.zernioAccountId,
        platform: filters.platform || undefined,
        source: filters.source || "all",
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        sortBy: filters.sortBy || "date",
        order: filters.order || "desc",
        limit: ANALYTICS_PAGE_SIZE,
        page,
      });
      pages = analyticsPageCount(body);
      for (const post of analyticsPosts(body)) {
        rows.push(...flattenAnalyticsPost(post, scope.ownedIds));
      }
      page += 1;
    } catch (reason) {
      error ??= feedErrorKind(reason);
      break;
    }
  }
  return { rows, error: rows.length > 0 ? null : error };
}

export async function loadScopedConversations(
  scope: StudioScope,
  filters: { accountId?: string; platform?: string; status?: string },
) {
  if (!scope.profileId) return { rows: [] as ZernioConversation[], error: null };
  const chosen = selectedAccount(scope, filters.accountId, false);
  if (chosen === undefined) return { rows: [] as ZernioConversation[], error: "unknown" as const };
  try {
    const data = await listConversations({
      profileId: scope.profileId,
      accountId: chosen?.zernioAccountId,
      platform: filters.platform || undefined,
      status: filters.status || undefined,
      limit: 50,
    });
    return {
      rows: scopeByAccountId(data.data ?? [], scope.ownedIds, (row) => row.accountId),
      error: null,
    };
  } catch (error) {
    return { rows: [] as ZernioConversation[], error: feedErrorKind(error) };
  }
}

export async function loadScopedCommentPosts(
  scope: StudioScope,
  filters: { accountId?: string; platform?: string },
) {
  if (!scope.profileId) return { rows: [] as ZernioInboxCommentPost[], error: null };
  const chosen = selectedAccount(scope, filters.accountId, false);
  if (chosen === undefined) return { rows: [] as ZernioInboxCommentPost[], error: "unknown" as const };
  try {
    const data = await listInboxComments({
      profileId: scope.profileId,
      accountId: chosen?.zernioAccountId,
      platform: filters.platform || undefined,
      limit: 50,
    });
    return {
      rows: scopeByAccountId(data.data ?? [], scope.ownedIds, (row) => row.accountId),
      error: null,
    };
  } catch (error) {
    return { rows: [] as ZernioInboxCommentPost[], error: feedErrorKind(error) };
  }
}

export async function loadOwnedCommentThread(scope: StudioScope, postId: string, accountId: string) {
  if (!ownsAccount(scope.ownedIds, accountId)) return { comments: [] as ZernioInboxComment[], error: "unknown" as const };
  try {
    const data = await getInboxPostComments(postId, accountId, 20);
    return { comments: data.comments ?? [], error: null };
  } catch (error) {
    return { comments: [] as ZernioInboxComment[], error: feedErrorKind(error) };
  }
}

export async function assertOwnedConversation(scope: StudioScope, conversationId: string, accountId: string) {
  if (!ownsAccount(scope.ownedIds, accountId)) return null;
  const body = await getConversation(conversationId, accountId);
  const record = body as {
    conversation?: ZernioConversation;
    data?: ZernioConversation;
    accountId?: string;
  };
  const conversation = record.conversation ?? record.data ?? record;
  const id = platformAccountId(conversation.accountId);
  if (id !== accountId || !ownsAccount(scope.ownedIds, id)) return null;
  return conversation;
}

export async function loadOwnedMessages(scope: StudioScope, conversationId: string, accountId: string) {
  const conversation = await assertOwnedConversation(scope, conversationId, accountId).catch(() => null);
  if (!conversation) return { messages: [] as Array<{ id?: string; message?: string; text?: string }>, error: "unknown" as const };
  try {
    const data = await listConversationMessages(conversationId, accountId);
    return { messages: data.messages ?? data.data ?? [], error: null };
  } catch (error) {
    return { messages: [] as Array<{ id?: string; message?: string; text?: string }>, error: feedErrorKind(error) };
  }
}

export type CampaignRow = {
  id: string;
  name: string;
  status: string;
  platform: string;
  accountId: string;
  username: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
};

function campaignList(body: unknown) {
  if (Array.isArray(body)) return body;
  const record = asRecord(body);
  const list = record?.campaigns ?? record?.data ?? record?.items ?? record?.results;
  return Array.isArray(list) ? list : [];
}

export async function loadScopedCampaigns(
  scope: StudioScope,
  filters: { accountId?: string; platform?: string; fromDate?: string; toDate?: string; status?: string },
) {
  const chosen = selectedAccount(scope, filters.accountId, true);
  if (chosen === undefined) return { rows: [] as CampaignRow[], error: "unknown" as const };
  const targets = (chosen ? [chosen] : scope.accounts.filter((account) => isAdsPlatformId(account.platform))).filter(
    (account) => !filters.platform || account.platform === filters.platform,
  );
  if (targets.length === 0) return { rows: [] as CampaignRow[], error: null };

  const settled = await Promise.allSettled(
    targets.map(async (account) => {
      const body = await listAdCampaigns({
        accountId: account.zernioAccountId,
        platform: account.platform,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        limit: 50,
      });
      return { account, body };
    }),
  );

  const rows: CampaignRow[] = [];
  let error: "failed" | "unavailable" | null = null;
  for (const result of settled) {
    if (result.status === "rejected") {
      error ??= feedErrorKind(result.reason);
      continue;
    }
    for (const item of campaignList(result.value.body)) {
      const campaign = asRecord(item);
      if (!campaign) continue;
      const foreign = platformAccountId(campaign.accountId);
      if (foreign && foreign !== result.value.account.zernioAccountId) continue;
      const metrics = asRecord(campaign.metrics) ?? campaign;
      const status = String(campaign.status ?? "");
      const active = /active|enabled|running|live/i.test(status);
      if (filters.status === "active" && !active) continue;
      if (filters.status === "past" && active) continue;
      rows.push({
        id: String(campaign.id ?? campaign.campaignId ?? campaign._id ?? ""),
        name: String(campaign.name ?? campaign.campaignName ?? "—"),
        status,
        platform: result.value.account.platform,
        accountId: result.value.account.zernioAccountId,
        username: result.value.account.username,
        spend: num(metrics.spend),
        impressions: num(metrics.impressions),
        clicks: num(metrics.clicks),
        ctr: num(metrics.ctr),
      });
    }
  }
  return { rows: rows.filter((row) => row.id), error: rows.length > 0 ? null : error };
}

export type AnalyticsDelta = {
  current: number;
  previous: number;
  percent: number | null;
};

export type AnalyticsBoard = {
  engagementRate: number;
  reach: number;
  followers: number;
  followerGrowth: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  impressions: number;
  clicks: number;
  deltas: {
    engagementRate: AnalyticsDelta;
    reach: AnalyticsDelta;
    posts: AnalyticsDelta;
  };
  bestPost: {
    platform: string;
    content: string;
    publishedAt: string | null;
    likes: number;
    url: string | null;
    thumbnailUrl: string | null;
  } | null;
  byPlatform: Array<{
    platform: string;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
    impressions: number;
    reach: number;
    clicks: number;
    rate: number;
  }>;
  weeks: Array<{ label: string; posts: number; likes: number; comments: number; views: number; impressions: number }>;
  followersSeries: Array<{ date: string; followers: number }>;
  followersByPlatform: Array<{ platform: string; current: number; series: Array<{ date: string; followers: number }> }>;
  formats: Array<{ type: string; posts: number; rate: number; vsAvg: number | null }>;
  top: Array<{
    platform: string;
    content: string;
    publishedAt: string | null;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    views: number;
    impressions: number;
    reach: number;
    clicks: number;
    follows: number;
    rate: number;
    url: string | null;
    thumbnailUrl: string | null;
  }>;
  heatmap: number[][];
  best: Array<{ day: number; hour: number; score: number }>;
  cadence: Array<{
    platform: string;
    points: Array<{ bucket: "1-2" | "3-5" | "6-10"; rate: number }>;
    optimal: { bucket: "1-2" | "3-5" | "6-10"; rate: number } | null;
  }>;
};

export function emptyAnalyticsBoard(): AnalyticsBoard {
  return {
    engagementRate: 0,
    reach: 0,
    followers: 0,
    followerGrowth: 0,
    posts: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    views: 0,
    impressions: 0,
    clicks: 0,
    deltas: {
      engagementRate: { current: 0, previous: 0, percent: 0 },
      reach: { current: 0, previous: 0, percent: 0 },
      posts: { current: 0, previous: 0, percent: 0 },
    },
    bestPost: null,
    byPlatform: [],
    weeks: [],
    followersSeries: [],
    followersByPlatform: [],
    formats: [],
    top: [],
    heatmap: Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)),
    best: [],
    cadence: [],
  };
}

function weekLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function rateOf(row: {
  likes: number;
  comments: number;
  shares?: number;
  saves?: number;
  impressions?: number;
  reach?: number;
  views?: number;
}) {
  return engagementRate(row);
}

function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

function cadenceBucket(postsPerWeek: number): "1-2" | "3-5" | "6-10" {
  if (postsPerWeek <= 2) return "1-2";
  if (postsPerWeek <= 5) return "3-5";
  return "6-10";
}

export async function loadAnalyticsBoard(
  scope: StudioScope,
  filters: {
    accountId?: string;
    platform?: string;
    source?: string;
    fromDate: string;
    toDate: string;
    sortBy?: string;
    order?: string;
  },
): Promise<{ board: AnalyticsBoard; error: "failed" | "unavailable" | "unknown" | null }> {
  const chosen = selectedAccount(scope, filters.accountId, false);
  const targets =
    chosen === undefined
      ? []
      : (chosen ? [chosen] : scope.accounts.filter((account) => isPlatformId(account.platform))).filter(
          (account) => !filters.platform || account.platform === filters.platform,
        );
  const allowedPlatforms = new Set(targets.map((account) => account.platform));
  const priorRange = previousEquivalentRange(filters.fromDate, filters.toDate);
  const dailyQuery = {
    profileId: scope.profileId ?? undefined,
    accountId: chosen?.zernioAccountId,
    platform: filters.platform || undefined,
    source: filters.source || "all",
    attribution: "publish" as const,
  };
  const [analytics, currentDaily, priorDaily, bestTime] = await Promise.all([
    loadScopedAnalytics(scope, filters),
    scope.profileId && targets.length
      ? swallow(() =>
          getDailyMetrics({
            ...dailyQuery,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
          }),
        )
      : Promise.resolve(null),
    scope.profileId && targets.length
      ? swallow(() =>
          getDailyMetrics({
            ...dailyQuery,
            fromDate: priorRange.from,
            toDate: priorRange.to,
          }),
        )
      : Promise.resolve(null),
    scope.profileId && targets.length
      ? swallow(() =>
          getBestTimeToPost({
            profileId: scope.profileId as string,
            accountId: chosen?.zernioAccountId,
            platform: filters.platform || undefined,
            source: filters.source || "all",
          }),
        )
      : Promise.resolve(null),
  ]);

  const weeks = new Map<
    string,
    { label: string; posts: number; likes: number; comments: number; views: number; impressions: number; reach: number; sort: number }
  >();
  const platformWeekMap = new Map<
    string,
    Map<string, { posts: number; likes: number; comments: number; impressions: number; views: number; reach: number }>
  >();
  for (const day of currentDaily?.dailyData ?? []) {
    const date = new Date(day.date);
    if (Number.isNaN(date.getTime())) continue;
    const start = new Date(date);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    const key = start.toISOString().slice(0, 10);
    const current = weeks.get(key) ?? {
      label: weekLabel(start),
      posts: 0,
      likes: 0,
      comments: 0,
      views: 0,
      impressions: 0,
      reach: 0,
      sort: start.getTime(),
    };
    current.posts += day.postCount ?? 0;
    current.likes += day.metrics?.likes ?? 0;
    current.comments += day.metrics?.comments ?? 0;
    current.views += day.metrics?.views ?? 0;
    current.impressions += day.metrics?.impressions ?? 0;
    current.reach += day.metrics?.reach ?? 0;
    weeks.set(key, current);
    const perPlatform = day.platformMetrics ?? {};
    for (const [platform, metrics] of Object.entries(perPlatform)) {
      if (allowedPlatforms.size && !allowedPlatforms.has(platform)) continue;
      const perWeek = platformWeekMap.get(platform) ?? new Map();
      const pw = perWeek.get(key) ?? { posts: 0, likes: 0, comments: 0, impressions: 0, views: 0, reach: 0 };
      pw.posts += metrics.postCount ?? 0;
      pw.likes += metrics.likes ?? 0;
      pw.comments += metrics.comments ?? 0;
      pw.impressions += metrics.impressions ?? 0;
      pw.views += metrics.views ?? 0;
      pw.reach += metrics.reach ?? 0;
      perWeek.set(key, pw);
      platformWeekMap.set(platform, perWeek);
    }
  }

  let followers = 0;
  let followerGrowth = 0;
  const followerDays = new Map<string, number>();
  const followersByPlatform: AnalyticsBoard["followersByPlatform"] = [];
  if (targets.length) {
    try {
      const stats = await getFollowerStats({
        profileId: scope.profileId ?? undefined,
        accountIds: targets.map((account) => account.zernioAccountId).join(","),
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        granularity: "daily",
      });
      const allowed = new Set(targets.map((account) => account.zernioAccountId));
      const accountPlatform = new Map(targets.map((account) => [account.zernioAccountId, account.platform]));
      const perPlatform = new Map<string, { current: number; series: Map<string, number> }>();
      for (const account of stats.accounts ?? []) {
        if (!account._id || !allowed.has(account._id)) continue;
        followers += account.currentFollowers ?? 0;
        followerGrowth += account.growth ?? 0;
        const platform = account.platform || accountPlatform.get(account._id);
        if (!platform) continue;
        const bucket = perPlatform.get(platform) ?? { current: 0, series: new Map() };
        bucket.current += account.currentFollowers ?? 0;
        perPlatform.set(platform, bucket);
      }
      for (const [id, series] of Object.entries(stats.stats ?? {})) {
        if (!allowed.has(id)) continue;
        const platform = accountPlatform.get(id);
        const bucket = platform ? perPlatform.get(platform) ?? { current: 0, series: new Map() } : null;
        for (const point of series) {
          followerDays.set(point.date, (followerDays.get(point.date) ?? 0) + (point.followers ?? 0));
          if (bucket) bucket.series.set(point.date, (bucket.series.get(point.date) ?? 0) + (point.followers ?? 0));
        }
        if (platform && bucket) perPlatform.set(platform, bucket);
      }
      for (const [platform, bucket] of perPlatform) {
        followersByPlatform.push({
          platform,
          current: bucket.current,
          series: [...bucket.series.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, value]) => ({ date, followers: value })),
        });
      }
    } catch {
      followers = 0;
    }
  }

  const dailyTotals = sumDailyMetrics(currentDaily, allowedPlatforms.size ? allowedPlatforms : undefined);
  const priorDailyTotals = sumDailyMetrics(priorDaily, allowedPlatforms.size ? allowedPlatforms : undefined);
  const rowTotals = analytics.rows.reduce(
    (sum, row) => ({
      likes: sum.likes + row.likes,
      comments: sum.comments + row.comments,
      shares: sum.shares + row.shares,
      saves: sum.saves + row.saves,
      views: sum.views + row.views,
      impressions: sum.impressions + row.impressions,
      reach: sum.reach + row.reach,
      clicks: sum.clicks + row.clicks,
    }),
    { likes: 0, comments: 0, shares: 0, saves: 0, views: 0, impressions: 0, reach: 0, clicks: 0 },
  );
  const totals = dailyTotals.posts > 0 || dailyTotals.reach > 0 || dailyTotals.likes > 0 ? dailyTotals : { ...rowTotals, posts: analytics.rows.length };
  const priorTotals = priorDailyTotals;

  const byPlatform = new Map<string, AnalyticsBoard["byPlatform"][number]>();
  const breakdown = currentDaily?.platformBreakdown ?? [];
  if (breakdown.length) {
    for (const row of breakdown) {
      if (allowedPlatforms.size && !allowedPlatforms.has(row.platform)) continue;
      byPlatform.set(row.platform, {
        platform: row.platform,
        posts: row.postCount ?? 0,
        likes: row.likes ?? 0,
        comments: row.comments ?? 0,
        shares: row.shares ?? 0,
        saves: row.saves ?? 0,
        views: row.views ?? 0,
        impressions: row.impressions ?? 0,
        reach: row.reach ?? 0,
        clicks: row.clicks ?? 0,
        rate: 0,
      });
    }
  } else {
    for (const row of analytics.rows) {
      const current = byPlatform.get(row.platform) ?? {
        platform: row.platform,
        posts: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        views: 0,
        impressions: 0,
        reach: 0,
        clicks: 0,
        rate: 0,
      };
      current.posts += 1;
      current.likes += row.likes;
      current.comments += row.comments;
      current.shares += row.shares;
      current.saves += row.saves;
      current.views += row.views;
      current.impressions += row.impressions;
      current.reach += row.reach;
      current.clicks += row.clicks;
      byPlatform.set(row.platform, current);
    }
  }
  for (const row of byPlatform.values()) {
    row.rate = rateOf(row);
  }

  const formatStats = new Map<string, { posts: number; likes: number; comments: number; shares: number; saves: number; impressions: number; views: number; reach: number }>();
  for (const row of analytics.rows) {
    const type = (row.mediaType || "text").toLowerCase();
    const current = formatStats.get(type) ?? {
      posts: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      impressions: 0,
      views: 0,
      reach: 0,
    };
    current.posts += 1;
    current.likes += row.likes;
    current.comments += row.comments;
    current.shares += row.shares;
    current.saves += row.saves;
    current.impressions += row.impressions;
    current.views += row.views;
    current.reach += row.reach;
    formatStats.set(type, current);
  }

  const fromBestTime = heatmapFromBestTime(bestTime?.slots ?? []);
  let heatmap = fromBestTime.heatmap;
  let best = fromBestTime.best;
  if (!best.length) {
    heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    for (const row of analytics.rows) {
      if (!row.publishedAt) continue;
      const date = new Date(row.publishedAt);
      if (Number.isNaN(date.getTime())) continue;
      const weight = row.likes + row.comments + row.shares + row.saves;
      const day = heatmap[date.getDay()];
      if (!day) continue;
      day[date.getHours()] = (day[date.getHours()] ?? 0) + Math.max(weight, 1);
    }
    const maxHeat = Math.max(1, ...heatmap.flat());
    best = heatmap
      .flatMap((hours, day) => hours.map((score, hour) => ({ day, hour, score })))
      .filter((slot) => slot.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ day, hour, score }) => ({ day, hour, score: Math.round((score / maxHeat) * 100) / 10 }));
  }

  const posts = totals.posts || analytics.rows.length;
  const priorPosts = priorTotals.posts;
  const currentRate = rateOf(totals);
  const priorRate = rateOf(priorTotals);

  const top = [...analytics.rows]
    .sort((a, b) => b.likes + b.comments + b.views - (a.likes + a.comments + a.views))
    .slice(0, 8)
    .map((row) => ({
      platform: row.platform,
      content: row.content,
      publishedAt: row.publishedAt,
      likes: row.likes,
      comments: row.comments,
      shares: row.shares,
      saves: row.saves,
      views: row.views,
      impressions: row.impressions,
      reach: row.reach,
      clicks: row.clicks,
      follows: row.follows,
      rate: rateOf(row),
      url: row.url,
      thumbnailUrl: row.thumbnailUrl,
    }));

  const formats = [...formatStats.entries()]
    .map(([type, stats]) => {
      const rate = rateOf(stats);
      return {
        type,
        posts: stats.posts,
        rate,
        vsAvg: currentRate ? Math.round(((rate - currentRate) / currentRate) * 100) : null,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  const cadence: AnalyticsBoard["cadence"] = [];
  for (const [platform, weeksMap] of platformWeekMap) {
    const buckets = new Map<"1-2" | "3-5" | "6-10", number[]>();
    for (const week of weeksMap.values()) {
      const bucket = cadenceBucket(week.posts);
      const list = buckets.get(bucket) ?? [];
      list.push(rateOf(week));
      buckets.set(bucket, list);
    }
    const points = (["1-2", "3-5", "6-10"] as const)
      .filter((bucket) => buckets.has(bucket))
      .map((bucket) => {
        const list = buckets.get(bucket) ?? [];
        const rate = list.reduce((sum, value) => sum + value, 0) / Math.max(1, list.length);
        return { bucket, rate: Math.round(rate * 10) / 10 };
      });
    const optimal = [...points].sort((a, b) => b.rate - a.rate)[0] ?? null;
    cadence.push({ platform, points, optimal });
  }

  const bestRow = top[0];
  return {
    error: analytics.error,
    board: {
      engagementRate: currentRate,
      followers,
      followerGrowth,
      posts,
      likes: totals.likes,
      comments: totals.comments,
      shares: totals.shares,
      saves: totals.saves,
      views: totals.views,
      impressions: totals.impressions,
      reach: totals.reach,
      clicks: totals.clicks,
      deltas: {
        engagementRate: {
          current: currentRate,
          previous: priorRate,
          percent: percentDelta(currentRate, priorRate),
        },
        reach: { current: totals.reach, previous: priorTotals.reach, percent: percentDelta(totals.reach, priorTotals.reach) },
        posts: { current: posts, previous: priorPosts, percent: percentDelta(posts, priorPosts) },
      },
      bestPost: bestRow
        ? {
            platform: bestRow.platform,
            content: bestRow.content,
            publishedAt: bestRow.publishedAt,
            likes: bestRow.likes,
            url: bestRow.url,
            thumbnailUrl: bestRow.thumbnailUrl,
          }
        : null,
      byPlatform: [...byPlatform.values()].sort((a, b) => b.posts - a.posts),
      weeks: [...weeks.values()].sort((a, b) => a.sort - b.sort).map(({ sort: _sort, reach: _reach, ...week }) => week),
      followersSeries: [...followerDays.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, value]) => ({ date, followers: value })),
      followersByPlatform,
      formats,
      top,
      heatmap,
      best,
      cadence,
    },
  };
}
