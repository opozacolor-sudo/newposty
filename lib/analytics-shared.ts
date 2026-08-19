export type AnalyticsKpi = {
  value: number;
  delta: number | null;
  available: boolean;
};

export type AnalyticsCard = {
  accountId: string;
  platform: string;
  username: string | null;
  displayName: string | null;
  posts30d: number | null;
  engagement30d: number | null;
  followers: number | null;
  campaigns30d?: number | null;
  spend30d?: number | null;
  impressions30d?: number | null;
  currency?: string | null;
  limited: boolean;
};

export type AnalyticsTopPost = {
  id: string;
  content: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  views: number | null;
  likes: number;
  comments: number;
  shares: number;
  url: string | null;
};

export type AnalyticsComment = {
  id: string;
  author: string;
  avatarUrl: string | null;
  message: string;
  postPreview: string;
  createdAt: string | null;
};

export type AdsTopCampaign = {
  id: string;
  name: string;
  status: string | null;
  spend: number;
  impressions: number;
  clicks: number;
};

export type AdsAccountAnalytics = {
  empty: boolean;
  currency: string;
  kpis: {
    spend: AnalyticsKpi;
    impressions: AnalyticsKpi;
    clicks: AnalyticsKpi;
    ctr: AnalyticsKpi;
    conversions: AnalyticsKpi;
  };
  chart: Array<{ date: string; value: number }>;
  topCampaigns: AdsTopCampaign[];
};

export type AccountAnalytics = {
  limited: boolean;
  empty: boolean;
  commentsAvailable: boolean;
  kpis: {
    visibility: AnalyticsKpi;
    engagement: AnalyticsKpi;
    comments: AnalyticsKpi;
    followers: AnalyticsKpi;
    engagementRate: AnalyticsKpi;
  };
  chart: Array<{ date: string; value: number }>;
  chartMetric: "visibility" | "engagement";
  topPosts: AnalyticsTopPost[];
  comments: AnalyticsComment[];
};

function toYmd(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseYmd(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
}

function addDays(value: string, days: number) {
  const date = parseYmd(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toYmd(date);
}

export function todayYmd() {
  return toYmd(new Date());
}

export function rangeFromPreset(days: 7 | 30 | 90) {
  const to = todayYmd();
  return { from: addDays(to, -(days - 1)), to };
}

export function previousEquivalentRange(from: string, to: string) {
  const days =
    Math.round((parseYmd(to).getTime() - parseYmd(from).getTime()) / 86_400_000) + 1;
  const prevTo = addDays(from, -1);
  return { from: addDays(prevTo, -(days - 1)), to: prevTo };
}

export function isValidYmd(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseYmd(value).getTime());
}
