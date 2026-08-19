"use client";

import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  MousePointerClick,
  Percent,
  Target,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnalyticsChart } from "@/components/studio/analytics-chart";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { rangeFromPreset, type AdsAccountAnalytics, type AnalyticsKpi } from "@/lib/analytics-shared";

type RangeKey = "7" | "30" | "90" | "custom";

function formatCount(value: number, locale: string, percent = false) {
  if (percent) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}%`;
  }
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMoney(value: number, locale: string, currency: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: value >= 100 ? 0 : 2,
    }).format(value);
  } catch {
    return formatCount(value, locale);
  }
}

function KpiTile({
  label,
  kpi,
  icon,
  locale,
  percent,
  money,
  currency,
}: {
  label: string;
  kpi: AnalyticsKpi;
  icon: ReactNode;
  locale: string;
  percent?: boolean;
  money?: boolean;
  currency?: string;
}) {
  const up = (kpi.delta ?? 0) > 0.05;
  const down = (kpi.delta ?? 0) < -0.05;
  return (
    <article className="rounded-2xl border border-[#E5E5E5] bg-white p-4">
      <div className="flex items-center justify-between text-[#6B7280]">
        <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
        {money
          ? formatMoney(kpi.value, locale, currency || "USD")
          : formatCount(kpi.value, locale, percent)}
      </p>
      {kpi.delta === null ? null : (
        <p
          className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${
            up ? "text-emerald-600" : down ? "text-red-600" : "text-[#6B7280]"
          }`}
        >
          {up ? <ArrowUpRight size={14} /> : down ? <ArrowDownRight size={14} /> : null}
          {`${kpi.delta > 0 ? "+" : ""}${kpi.delta.toFixed(0)}%`}
        </p>
      )}
    </article>
  );
}

export function AdsAnalyticsDetail({
  platform,
  accountId,
  accountLabel,
}: {
  platform: {
    id: string;
    label: string;
    brand: string;
    iconBg: string;
    icon: { path: string };
  };
  accountId: string | null;
  accountLabel: string;
}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const initial = useMemo(() => rangeFromPreset(30), []);
  const [range, setRange] = useState<RangeKey>("30");
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [customFrom, setCustomFrom] = useState(initial.from);
  const [customTo, setCustomTo] = useState(initial.to);
  const [data, setData] = useState<AdsAccountAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(accountId));

  const load = useCallback(async () => {
    if (!accountId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ accountId, from, to });
      const response = await fetch(`/api/analytics/ads/account?${params.toString()}`);
      const payload = (await response.json()) as AdsAccountAnalytics & { error?: string };
      if (!response.ok) {
        setError(payload.error ?? t("analyticsError"));
        setData(null);
        return;
      }
      setData(payload);
    } catch {
      setError(t("analyticsError"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [accountId, from, t, to]);

  useEffect(() => {
    void load();
  }, [load]);

  function applyPreset(key: Exclude<RangeKey, "custom">) {
    const next = rangeFromPreset(Number(key) as 7 | 30 | 90);
    setRange(key);
    setFrom(next.from);
    setTo(next.to);
    setCustomFrom(next.from);
    setCustomTo(next.to);
  }

  function applyCustom() {
    if (!customFrom || !customTo || customFrom > customTo) return;
    setRange("custom");
    setFrom(customFrom);
    setTo(customTo);
  }

  if (!accountId) {
    return (
      <main className="h-full overflow-y-auto px-6 py-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ads"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
            aria-label={t("back")}
          >
            <ArrowLeft size={16} />
          </Link>
          <PlatformIcon platform={platform} connected={false} size="sm" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
              {platform.label}
            </h1>
            <p className="text-sm text-[#6B7280]">{t("notConnected")}</p>
          </div>
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-[#E5E5E5] px-6 py-12 text-center">
          <p className="text-sm text-[#6B7280]">{t("connectToSeeAdsStats")}</p>
          <Link
            href="/accounts/ads"
            className="mt-4 inline-flex rounded-full bg-[#FF4713] px-4 py-2 text-xs text-white"
          >
            {t("connectAccount")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ads"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
            aria-label={t("back")}
          >
            <ArrowLeft size={16} />
          </Link>
          <PlatformIcon platform={platform} connected size="sm" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
              {platform.label}
            </h1>
            <p className="text-sm text-[#6B7280]">{accountLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["7", "30", "90"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                range === key
                  ? "bg-[#FF4713] text-white"
                  : "border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
              }`}
            >
              {t("rangeDays", { days: key })}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRange("custom")}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              range === "custom"
                ? "bg-[#FF4713] text-white"
                : "border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
            }`}
          >
            {t("rangeCustom")}
          </button>
        </div>
      </div>

      {range === "custom" ? (
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="text-xs text-[#6B7280]">
            {t("from")}
            <input
              type="date"
              value={customFrom}
              onChange={(event) => setCustomFrom(event.target.value)}
              className="mt-1 block rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#1A1A1A]"
            />
          </label>
          <label className="text-xs text-[#6B7280]">
            {t("to")}
            <input
              type="date"
              value={customTo}
              onChange={(event) => setCustomTo(event.target.value)}
              className="mt-1 block rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#1A1A1A]"
            />
          </label>
          <button
            type="button"
            onClick={applyCustom}
            className="rounded-full bg-[#FF4713] px-4 py-2 text-xs text-white"
          >
            {t("applyRange")}
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-[#6B7280]">
          <p>{t("analyticsError")}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="shrink-0 rounded-full border border-[#E5E5E5] px-3 py-1.5 text-xs text-[#1A1A1A]"
          >
            {t("retry")}
          </button>
        </div>
      ) : null}

      <section className="mt-6">
        {loading || !data ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <KpiTile
              label={t("kpiSpend")}
              kpi={data.kpis.spend}
              locale={locale}
              money
              currency={data.currency}
              icon={<Wallet size={16} />}
            />
            <KpiTile
              label={t("kpiImpressions")}
              kpi={data.kpis.impressions}
              locale={locale}
              icon={<Eye size={16} />}
            />
            <KpiTile
              label={t("kpiClicks")}
              kpi={data.kpis.clicks}
              locale={locale}
              icon={<MousePointerClick size={16} />}
            />
            <KpiTile
              label={t("kpiCtr")}
              kpi={data.kpis.ctr}
              locale={locale}
              percent
              icon={<Percent size={16} />}
            />
            <KpiTile
              label={t("kpiConversions")}
              kpi={data.kpis.conversions}
              locale={locale}
              icon={<Target size={16} />}
            />
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-[#E5E5E5] bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A]">{t("kpiSpend")}</h2>
        <div className="mt-4">
          {loading || !data ? (
            <div className="h-64 animate-pulse rounded-xl bg-[#FAFAFA]" />
          ) : (
            <AnalyticsChart data={data.chart} label={t("kpiSpend")} />
          )}
        </div>
      </section>

      {data && !loading && data.empty ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-8 text-center">
          <p className="text-sm text-[#6B7280]">{t("noCampaignsInRange")}</p>
          <button
            type="button"
            onClick={() => setRange("custom")}
            className="mt-3 rounded-full bg-[#FF4713] px-4 py-2 text-xs text-white"
          >
            {t("changeRange")}
          </button>
        </div>
      ) : (
        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">{t("topCampaigns")}</h2>
          {loading || !data ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]"
                />
              ))}
            </div>
          ) : data.topCampaigns.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-6 text-sm text-[#6B7280]">
              {t("noCampaignsInRange")}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.topCampaigns.map((campaign) => (
                <li
                  key={campaign.id}
                  className="rounded-2xl border border-[#E5E5E5] bg-white p-4"
                >
                  <p className="font-medium text-[#1A1A1A]">{campaign.name}</p>
                  <p className="mt-1 flex flex-wrap gap-3 text-xs text-[#6B7280]">
                    <span>
                      {t("kpiSpend")}: {formatMoney(campaign.spend, locale, data.currency)}
                    </span>
                    <span>
                      {t("kpiImpressions")}: {formatCount(campaign.impressions, locale)}
                    </span>
                    <span>
                      {t("kpiClicks")}: {formatCount(campaign.clicks, locale)}
                    </span>
                    {campaign.status ? <span>{campaign.status}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
