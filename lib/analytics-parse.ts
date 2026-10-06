import { platformAccountId } from "@/lib/studio-scope";
import type { ZernioDailyMetrics } from "@/lib/zernio";

export function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function analyticsPosts(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) {
    return body.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  const record = asRecord(body);
  const list = record?.posts ?? record?.data ?? record?.items ?? record?.results;
  if (Array.isArray(list)) {
    return list.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  if (record?.postId || record?.analytics || record?._id) return [record];
  return [];
}

export function analyticsPageCount(body: unknown) {
  const pagination = asRecord(asRecord(body)?.pagination);
  const pages = num(pagination?.pages);
  return Math.max(1, pages || 1);
}

export type MetricBag = {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  clicks: number;
  follows: number;
};

export function emptyMetrics(): MetricBag {
  return {
    impressions: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    views: 0,
    clicks: 0,
    follows: 0,
  };
}

export function metricBag(value: unknown): MetricBag {
  const metrics = asRecord(value) ?? {};
  return {
    impressions: num(metrics.impressions),
    reach: num(metrics.reach),
    likes: num(metrics.likes),
    comments: num(metrics.comments),
    shares: num(metrics.shares),
    saves: num(metrics.saves),
    views: num(metrics.views),
    clicks: num(metrics.clicks),
    follows: num(metrics.follows ?? metrics.followers),
  };
}

export function addMetrics(left: MetricBag, right: MetricBag): MetricBag {
  return {
    impressions: left.impressions + right.impressions,
    reach: left.reach + right.reach,
    likes: left.likes + right.likes,
    comments: left.comments + right.comments,
    shares: left.shares + right.shares,
    saves: left.saves + right.saves,
    views: left.views + right.views,
    clicks: left.clicks + right.clicks,
    follows: left.follows + right.follows,
  };
}

/** Dashboard ER is interactions / reach (impressions only if reach is missing). */
export function engagementRate(row: {
  likes: number;
  comments: number;
  shares?: number;
  saves?: number;
  reach?: number;
  impressions?: number;
  views?: number;
}) {
  const interactions = row.likes + row.comments + (row.shares ?? 0) + (row.saves ?? 0);
  const base = row.reach && row.reach > 0 ? row.reach : row.impressions || row.views || 0;
  if (!base) return 0;
  return Math.round((interactions / base) * 10000) / 100;
}

function looksLikeVideo(url: string, type?: string | null) {
  const kind = (type ?? "").toLowerCase();
  if (kind.includes("video")) return true;
  return /\.(mp4|mov|webm|m4v|avi)(\?|#|$)/i.test(url);
}

function usableImageUrl(url: string, type?: string | null) {
  if (!url) return false;
  if (url.startsWith("data:image/")) return true;
  if (looksLikeVideo(url, type)) return false;
  return /^(https?:|blob:|data:)/i.test(url);
}

export function pickMediaThumb(post: Record<string, unknown>) {
  const mediaType = typeof post.mediaType === "string" ? post.mediaType : null;
  const candidates: Array<{ url: string; type: string | null }> = [];
  if (typeof post.thumbnailUrl === "string" && post.thumbnailUrl) {
    candidates.push({ url: post.thumbnailUrl, type: "image" });
  }
  const items = Array.isArray(post.mediaItems) ? post.mediaItems : [];
  for (const item of items) {
    const media = asRecord(item);
    const kind = typeof media?.type === "string" ? media.type : mediaType;
    if (typeof media?.thumbnail === "string" && media.thumbnail) {
      candidates.push({ url: media.thumbnail, type: "image" });
    }
    if (typeof media?.url === "string" && media.url) {
      candidates.push({ url: media.url, type: kind });
    }
  }
  for (const candidate of candidates) {
    if (usableImageUrl(candidate.url, candidate.type)) return candidate.url;
  }
  return null;
}

function publishedAt(post: Record<string, unknown>) {
  if (typeof post.publishedAt === "string") return post.publishedAt;
  if (typeof post.scheduledFor === "string") return post.scheduledFor;
  return null;
}

function platformSlices(post: Record<string, unknown>) {
  if (Array.isArray(post.platforms) && post.platforms.length) return post.platforms;
  if (Array.isArray(post.platformAnalytics) && post.platformAnalytics.length) return post.platformAnalytics;
  return [post];
}

export type ParsedAnalyticsRow = MetricBag & {
  id: string;
  content: string;
  publishedAt: string | null;
  platform: string;
  accountId: string;
  username: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  mediaType: string | null;
};

export function flattenAnalyticsPost(
  post: Record<string, unknown>,
  ownedIds?: Set<string>,
): ParsedAnalyticsRow[] {
  const slices = platformSlices(post);
  const thumb = pickMediaThumb(post);
  const content = String(post.content ?? "");
  const published = publishedAt(post);
  const mediaType = typeof post.mediaType === "string" ? post.mediaType : null;
  const postId = String(post.postId ?? post._id ?? post.id ?? "");
  const rows: ParsedAnalyticsRow[] = [];

  for (const slice of slices) {
    const platform = asRecord(slice);
    if (!platform) continue;
    const accountId = platformAccountId(platform.accountId) ?? "";
    if (ownedIds && (!accountId || !ownedIds.has(accountId))) continue;
    const metrics = metricBag(platform.analytics ?? post.analytics);
    rows.push({
      id: postId || `${accountId}-${rows.length}`,
      content,
      publishedAt: published,
      platform: String(platform.platform ?? post.platform ?? ""),
      accountId,
      username: typeof platform.accountUsername === "string" ? platform.accountUsername : null,
      url:
        typeof platform.platformPostUrl === "string"
          ? platform.platformPostUrl
          : typeof post.platformPostUrl === "string"
            ? post.platformPostUrl
            : null,
      thumbnailUrl: thumb,
      mediaType,
      ...metrics,
    });
  }
  return rows;
}

export type DailyTotals = MetricBag & { posts: number };

export function emptyDailyTotals(): DailyTotals {
  return { ...emptyMetrics(), posts: 0 };
}

export function addDailyTotals(left: DailyTotals, right: DailyTotals): DailyTotals {
  return { ...addMetrics(left, right), posts: left.posts + right.posts };
}

function breakdownRow(row: {
  postCount?: number;
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  views?: number;
}): DailyTotals {
  return {
    posts: num(row.postCount),
    impressions: num(row.impressions),
    reach: num(row.reach),
    likes: num(row.likes),
    comments: num(row.comments),
    shares: num(row.shares),
    saves: num(row.saves),
    clicks: num(row.clicks),
    views: num(row.views),
    follows: 0,
  };
}

export function sumDailyMetrics(data: ZernioDailyMetrics | null | undefined, allowedPlatforms?: Set<string>): DailyTotals {
  if (!data) return emptyDailyTotals();
  if (data.platformBreakdown?.length) {
    return data.platformBreakdown.reduce((sum, row) => {
      if (allowedPlatforms && !allowedPlatforms.has(row.platform)) return sum;
      return addDailyTotals(sum, breakdownRow(row));
    }, emptyDailyTotals());
  }
  return (data.dailyData ?? []).reduce((sum, day) => {
    return addDailyTotals(sum, breakdownRow({ postCount: day.postCount, ...day.metrics }));
  }, emptyDailyTotals());
}

/** Analytics best-time API uses Monday = 0. JS Date.getDay() uses Sunday = 0. */
export function jsDayFromApiMonday(dayOfWeek: number) {
  return (((dayOfWeek % 7) + 7) % 7 + 1) % 7;
}

export function heatmapFromBestTime(
  slots: Array<{ day_of_week?: number; hour?: number; avg_engagement?: number; post_count?: number }>,
) {
  const heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  const ranked: Array<{ day: number; hour: number; score: number; posts: number }> = [];
  for (const slot of slots) {
    const hour = num(slot.hour);
    if (hour < 0 || hour > 23) continue;
    const day = jsDayFromApiMonday(num(slot.day_of_week));
    const row = heatmap[day];
    if (!row) continue;
    const score = typeof slot.avg_engagement === "number" && Number.isFinite(slot.avg_engagement) ? slot.avg_engagement : 0;
    row[hour] = score;
    ranked.push({
      day,
      hour,
      score: Math.round(score * 10) / 10,
      posts: num(slot.post_count),
    });
  }
  const best = ranked
    .filter((slot) => slot.score > 0)
    .sort((a, b) => b.score - a.score || b.posts - a.posts)
    .slice(0, 4)
    .map(({ posts: _posts, ...slot }) => slot);
  return { heatmap, best };
}
