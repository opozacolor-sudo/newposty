import { listActiveSocialAccounts } from "@/lib/account-server";
import { isAdsPlatformId, isPlatformId } from "@/lib/platforms";
import { ownsAccount, platformAccountId, scopeByAccountId, scopePosts } from "@/lib/studio-scope";
import {
  ZernioError,
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
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  clicks: number;
  mediaType: string | null;
};

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
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

  const settled = await Promise.allSettled(
    targets.map((account) =>
      getPostAnalytics({
        profileId: scope.profileId as string,
        accountId: account.zernioAccountId,
        platform: account.platform,
        source: filters.source || "all",
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        sortBy: filters.sortBy || "date",
        order: filters.order || "desc",
        limit: 25,
        page: 1,
      }),
    ),
  );

  const rows: AnalyticsRow[] = [];
  let error: "failed" | "unavailable" | null = null;
  for (const result of settled) {
    if (result.status === "rejected") {
      error ??= feedErrorKind(result.reason);
      continue;
    }
    const body = asRecord(result.value);
    const posts = Array.isArray(body?.posts) ? body.posts : [];
    for (const item of posts) {
      const post = asRecord(item);
      if (!post) continue;
      const slices = Array.isArray(post.platformAnalytics) ? post.platformAnalytics : [];
      for (const slice of slices) {
        const platform = asRecord(slice);
        if (!platform) continue;
        const accountId = platformAccountId(platform.accountId);
        if (!accountId || !scope.ownedIds.has(accountId)) continue;
        const metrics = asRecord(platform.analytics) ?? asRecord(post.analytics) ?? {};
        rows.push({
          id: String(post.postId ?? post._id ?? `${accountId}-${rows.length}`),
          content: String(post.content ?? ""),
          publishedAt: typeof post.publishedAt === "string" ? post.publishedAt : null,
          platform: String(platform.platform ?? ""),
          accountId,
          username: typeof platform.accountUsername === "string" ? platform.accountUsername : null,
          url: typeof platform.platformPostUrl === "string" ? platform.platformPostUrl : null,
          impressions: num(metrics.impressions),
          reach: num(metrics.reach),
          likes: num(metrics.likes),
          comments: num(metrics.comments),
          shares: num(metrics.shares),
          saves: num(metrics.saves),
          views: num(metrics.views),
          clicks: num(metrics.clicks),
          mediaType: typeof post.mediaType === "string" ? post.mediaType : null,
        });
      }
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

export type AnalyticsBoard = {
  engagementRate: number;
  reach: number;
  followers: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  impressions: number;
  clicks: number;
  byPlatform: Array<{ platform: string; posts: number; likes: number; comments: number; shares: number; saves: number; views: number; impressions: number; reach: number; clicks: number }>;
  weeks: Array<{ label: string; posts: number; likes: number; comments: number; views: number; impressions: number }>;
  followersSeries: Array<{ date: string; followers: number }>;
  formats: Array<{ type: string; posts: number }>;
  top: Array<{ platform: string; content: string; publishedAt: string | null; likes: number; comments: number; shares: number; saves: number; views: number; impressions: number; reach: number; clicks: number; rate: number }>;
  heatmap: number[][];
  best: Array<{ day: number; hour: number }>;
};

function weekLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function rateOf(row: { likes: number; comments: number; shares: number; saves: number; impressions: number; reach: number; views: number }) {
  const interactions = row.likes + row.comments + row.shares + row.saves;
  const base = row.impressions || row.reach || row.views;
  if (!base) return 0;
  return Math.round((interactions / base) * 10000) / 100;
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
  const analytics = await loadScopedAnalytics(scope, filters);
  const chosen = selectedAccount(scope, filters.accountId, false);
  const targets =
    chosen === undefined
      ? []
      : (chosen ? [chosen] : scope.accounts.filter((account) => isPlatformId(account.platform))).filter(
          (account) => !filters.platform || account.platform === filters.platform,
        );

  const dailySettled =
    scope.profileId && targets.length
      ? await Promise.allSettled(
          targets.map((account) =>
            getDailyMetrics({
              profileId: scope.profileId as string,
              accountId: account.zernioAccountId,
              platform: account.platform,
              fromDate: filters.fromDate,
              toDate: filters.toDate,
            }),
          ),
        )
      : [];

  const weeks = new Map<string, { label: string; posts: number; likes: number; comments: number; views: number; impressions: number; sort: number }>();
  for (const result of dailySettled) {
    if (result.status !== "fulfilled") continue;
    for (const day of result.value.dailyData ?? []) {
      const date = new Date(day.date);
      if (Number.isNaN(date.getTime())) continue;
      const start = new Date(date);
      start.setUTCDate(start.getUTCDate() - start.getUTCDay());
      const key = start.toISOString().slice(0, 10);
      const current = weeks.get(key) ?? { label: weekLabel(start), posts: 0, likes: 0, comments: 0, views: 0, impressions: 0, sort: start.getTime() };
      current.posts += day.postCount ?? 0;
      current.likes += day.metrics?.likes ?? 0;
      current.comments += day.metrics?.comments ?? 0;
      current.views += day.metrics?.views ?? 0;
      current.impressions += day.metrics?.impressions ?? 0;
      weeks.set(key, current);
    }
  }

  let followers = 0;
  const followerDays = new Map<string, number>();
  if (targets.length) {
    try {
      const stats = await getFollowerStats({
        accountIds: targets.map((account) => account.zernioAccountId).join(","),
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        granularity: "daily",
      });
      const allowed = new Set(targets.map((account) => account.zernioAccountId));
      for (const account of stats.accounts ?? []) {
        if (!account._id || !allowed.has(account._id)) continue;
        followers += account.currentFollowers ?? 0;
      }
      for (const [id, series] of Object.entries(stats.stats ?? {})) {
        if (!allowed.has(id)) continue;
        for (const point of series) {
          followerDays.set(point.date, (followerDays.get(point.date) ?? 0) + (point.followers ?? 0));
        }
      }
    } catch {
      followers = 0;
    }
  }

  const byPlatform = new Map<string, AnalyticsBoard["byPlatform"][number]>();
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

  const formats = new Map<string, number>();
  for (const row of analytics.rows) {
    const type = (row.mediaType || "text").toLowerCase();
    formats.set(type, (formats.get(type) ?? 0) + 1);
  }

  const heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  for (const row of analytics.rows) {
    if (!row.publishedAt) continue;
    const date = new Date(row.publishedAt);
    if (Number.isNaN(date.getTime())) continue;
    const weight = row.likes + row.comments + row.shares + row.saves + row.views;
    const day = heatmap[date.getDay()];
    if (!day) continue;
    day[date.getHours()] = (day[date.getHours()] ?? 0) + Math.max(weight, 1);
  }
  const best = heatmap
    .flatMap((hours, day) => hours.map((score, hour) => ({ day, hour, score })))
    .filter((slot) => slot.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ day, hour }) => ({ day, hour }));

  const totals = analytics.rows.reduce(
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
      rate: rateOf(row),
    }));

  return {
    error: analytics.error,
    board: {
      engagementRate: rateOf(totals),
      followers,
      posts: Math.max(analytics.rows.length, [...weeks.values()].reduce((sum, week) => sum + week.posts, 0)),
      ...totals,
      byPlatform: [...byPlatform.values()].sort((a, b) => b.posts - a.posts),
      weeks: [...weeks.values()].sort((a, b) => a.sort - b.sort).map(({ sort: _sort, ...week }) => week),
      followersSeries: [...followerDays.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, value]) => ({ date, followers: value })),
      formats: [...formats.entries()].map(([type, posts]) => ({ type, posts })),
      top,
      heatmap,
      best,
    },
  };
}
