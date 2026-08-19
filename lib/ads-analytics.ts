import {
  previousEquivalentRange,
  rangeFromPreset,
  type AdsAccountAnalytics,
  type AdsTopCampaign,
  type AnalyticsCard,
  type AnalyticsKpi,
} from "@/lib/analytics-shared";
import { getCampaignAnalytics, listAdCampaigns } from "@/lib/zernio";

export type { AdsAccountAnalytics } from "@/lib/analytics-shared";

function num(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asCampaigns(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) {
    return body.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  const record = asRecord(body);
  const list = record?.campaigns ?? record?.data ?? record?.items ?? record?.results;
  if (Array.isArray(list)) {
    return list.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)));
  }
  return [];
}

function campaignId(campaign: Record<string, unknown>) {
  return String(
    campaign.id ??
      campaign.campaignId ??
      campaign.platformCampaignId ??
      campaign._id ??
      "",
  );
}

function campaignMetrics(campaign: Record<string, unknown>) {
  const metrics = asRecord(campaign.metrics) ?? campaign;
  return {
    spend: num(metrics.spend),
    impressions: num(metrics.impressions),
    clicks: num(metrics.clicks),
    conversions: num(metrics.conversions),
    ctr: num(metrics.ctr),
    currency: typeof campaign.currency === "string" ? campaign.currency : null,
    name: String(campaign.name ?? campaign.campaignName ?? "Campaign"),
    status: typeof campaign.status === "string" ? campaign.status : null,
  };
}

function sumCampaigns(campaigns: Record<string, unknown>[]) {
  let spend = 0;
  let impressions = 0;
  let clicks = 0;
  let conversions = 0;
  let currency: string | null = null;
  for (const campaign of campaigns) {
    const metrics = campaignMetrics(campaign);
    spend += metrics.spend;
    impressions += metrics.impressions;
    clicks += metrics.clicks;
    conversions += metrics.conversions;
    currency ??= metrics.currency;
  }
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  return { spend, impressions, clicks, conversions, ctr, currency, count: campaigns.length };
}

function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

function kpi(value: number, previous: number): AnalyticsKpi {
  return { value, delta: delta(value, previous), available: true };
}

async function swallow<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

function adsApiPlatform(platform: string) {
  if (platform === "metaads") return "facebook";
  if (platform === "linkedinads") return "linkedin";
  if (platform === "tiktokads") return "tiktok";
  if (platform === "pinterestads") return "pinterest";
  if (platform === "xads") return "twitter";
  return platform;
}

async function campaignsForRange(input: {
  accountId: string;
  platform: string;
  from: string;
  to: string;
}) {
  const body = await swallow(() =>
    listAdCampaigns({
      accountId: input.accountId,
      platform: adsApiPlatform(input.platform),
      fromDate: input.from,
      toDate: input.to,
      limit: 50,
    }),
  );
  return asCampaigns(body);
}

export async function loadAdsOverviewCards(
  accounts: Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>,
): Promise<AnalyticsCard[]> {
  const range = rangeFromPreset(30);
  const lists = await Promise.all(
    accounts.map((account) =>
      campaignsForRange({
        accountId: account.zernio_account_id,
        platform: account.platform,
        from: range.from,
        to: range.to,
      }),
    ),
  );

  return accounts.map((account, index) => {
    const sums = sumCampaigns(lists[index] ?? []);
    return {
      accountId: account.id,
      platform: account.platform,
      username: account.username,
      displayName: account.display_name,
      posts30d: null,
      engagement30d: null,
      followers: null,
      campaigns30d: lists[index] ? sums.count : null,
      spend30d: lists[index] ? sums.spend : null,
      impressions30d: lists[index] ? sums.impressions : null,
      currency: sums.currency,
      limited: false,
    };
  });
}

export async function loadAdsAccountAnalytics(input: {
  accountId: string;
  platform: string;
  from: string;
  to: string;
}): Promise<AdsAccountAnalytics> {
  const previous = previousEquivalentRange(input.from, input.to);
  const [currentCampaigns, previousCampaigns] = await Promise.all([
    campaignsForRange(input),
    campaignsForRange({ ...input, from: previous.from, to: previous.to }),
  ]);
  const current = sumCampaigns(currentCampaigns);
  const prev = sumCampaigns(previousCampaigns);

  const ranked = currentCampaigns
    .map((campaign) => {
      const metrics = campaignMetrics(campaign);
      return {
        id: campaignId(campaign),
        name: metrics.name,
        status: metrics.status,
        spend: metrics.spend,
        impressions: metrics.impressions,
        clicks: metrics.clicks,
      };
    })
    .filter((campaign) => campaign.id)
    .sort((a, b) => b.spend - a.spend);

  const topCampaigns = ranked.slice(0, 5);
  const chart = await buildSpendChart(topCampaigns, input);

  return {
    empty: current.count === 0,
    currency: current.currency || "USD",
    kpis: {
      spend: kpi(current.spend, prev.spend),
      impressions: kpi(current.impressions, prev.impressions),
      clicks: kpi(current.clicks, prev.clicks),
      ctr: kpi(current.ctr, prev.ctr),
      conversions: kpi(current.conversions, prev.conversions),
    },
    chart,
    topCampaigns,
  };
}

async function buildSpendChart(
  campaigns: AdsTopCampaign[],
  input: { platform: string; from: string; to: string },
) {
  const daily = new Map<string, number>();
  const results = await Promise.all(
    campaigns.slice(0, 8).map((campaign) =>
      swallow(() =>
        getCampaignAnalytics(campaign.id, {
          platform: adsApiPlatform(input.platform),
          fromDate: input.from,
          toDate: input.to,
        }),
      ),
    ),
  );

  for (const body of results) {
    const record = asRecord(body);
    const rows = Array.isArray(record?.daily)
      ? record.daily
      : Array.isArray(record?.timeline)
        ? record.timeline
        : [];
    for (const row of rows) {
      const item = asRecord(row);
      if (!item) continue;
      const date = String(item.date ?? item.day ?? "");
      if (!date) continue;
      daily.set(date, (daily.get(date) ?? 0) + num(item.spend ?? asRecord(item.metrics)?.spend));
    }
  }

  return [...daily.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}
