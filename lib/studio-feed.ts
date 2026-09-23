import { listActiveSocialAccounts } from "@/lib/account-server";
import { isAdsPlatformId, isPlatformId } from "@/lib/platforms";
import { ownsAccount, platformAccountId, scopeByAccountId, scopePosts } from "@/lib/studio-scope";
import {
  ZernioError,
  getConversation,
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
