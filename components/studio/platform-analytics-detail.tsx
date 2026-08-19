"use client";

import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  Heart,
  MessageCircle,
  Percent,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnalyticsChart } from "@/components/studio/analytics-chart";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { rangeFromPreset, type AccountAnalytics, type AnalyticsKpi } from "@/lib/analytics-shared";
import type { Platform } from "@/lib/platforms";

type RangeKey = "7" | "30" | "90" | "custom";

function formatCount(value: number, locale: string, percent = false) {
  if (percent) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;
  }
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function KpiTile({
  label,
  kpi,
  icon,
  locale,
  percent,
}: {
  label: string;
  kpi: AnalyticsKpi;
  icon: ReactNode;
  locale: string;
  percent?: boolean;
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
        {formatCount(kpi.value, locale, percent)}
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

function SkeletonTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]"
        />
      ))}
    </div>
  );
}

export function PlatformAnalyticsDetail({
  platform,
  accountId,
  accountLabel,
}: {
  platform: Platform;
  accountId: string;
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
  const [data, setData] = useState<AccountAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        accountId,
        from,
        to,
      });
      const response = await fetch(`/api/analytics/account?${params.toString()}`);
      const payload = (await response.json()) as AccountAnalytics & { error?: string };
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

  const chartLabel =
    data?.chartMetric === "engagement" ? t("kpiEngagement") : t("kpiVisibility");

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/posts"
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

      {data?.limited ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {t("limitedBanner")}
        </p>
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
          <SkeletonTiles />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {data.kpis.visibility.available ? (
              <KpiTile
                label={t("kpiVisibility")}
                kpi={data.kpis.visibility}
                locale={locale}
                icon={<Eye size={16} />}
              />
            ) : null}
            <KpiTile
              label={t("kpiEngagement")}
              kpi={data.kpis.engagement}
              locale={locale}
              icon={<Heart size={16} />}
            />
            <KpiTile
              label={t("kpiComments")}
              kpi={data.kpis.comments}
              locale={locale}
              icon={<MessageCircle size={16} />}
            />
            {data.kpis.followers.available ? (
              <KpiTile
                label={t("kpiFollowers")}
                kpi={data.kpis.followers}
                locale={locale}
                icon={<UserPlus size={16} />}
              />
            ) : null}
            {data.kpis.engagementRate.available ? (
              <KpiTile
                label={t("kpiRate")}
                kpi={data.kpis.engagementRate}
                locale={locale}
                percent
                icon={<Percent size={16} />}
              />
            ) : null}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-[#E5E5E5] bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A]">{chartLabel}</h2>
        <div className="mt-4">
          {loading || !data ? (
            <div className="h-64 animate-pulse rounded-xl bg-[#FAFAFA]" />
          ) : (
            <AnalyticsChart data={data.chart} label={chartLabel} />
          )}
        </div>
      </section>

      {data && !loading && data.empty ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-8 text-center">
          <p className="text-sm text-[#6B7280]">{t("noPostsInRange")}</p>
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
          <h2 className="text-lg font-semibold tracking-tight">{t("topPosts")}</h2>
          {loading || !data ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]"
                />
              ))}
            </div>
          ) : data.topPosts.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-6 text-sm text-[#6B7280]">
              {t("noPostsInRange")}
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {data.topPosts.map((post) => (
                <li
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white"
                >
                  {post.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnailUrl}
                      alt=""
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-28 items-center justify-center bg-[#FAFAFA] text-xs text-[#6B7280]">
                      {t("noMedia")}
                    </div>
                  )}
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm text-[#1A1A1A]">
                      {post.content || t("mediaOnly")}
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(locale)
                        : "—"}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#6B7280]">
                      {post.views !== null ? (
                        <span className="inline-flex items-center gap-1">
                          <Eye size={12} /> {formatCount(post.views, locale)}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <Heart size={12} /> {formatCount(post.likes, locale)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={12} /> {formatCount(post.comments, locale)}
                      </span>
                      <span>{t("sharesCount", { count: formatCount(post.shares, locale) })}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">{t("recentComments")}</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA]"
              />
            ))}
          </div>
        ) : !data?.commentsAvailable ? (
          <p className="mt-4 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-6 text-sm text-[#6B7280]">
            {t("commentsSoon")}
          </p>
        ) : data.comments.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-[#E5E5E5] px-5 py-6 text-sm text-[#6B7280]">
            {t("noComments")}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data.comments.map((comment) => (
              <li
                key={comment.id}
                className="flex gap-3 rounded-2xl border border-[#E5E5E5] bg-white p-4"
              >
                {comment.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.avatarUrl}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FAFAFA] text-xs text-[#6B7280]">
                    {comment.author.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">{comment.author}</p>
                  <p className="mt-0.5 text-sm text-[#1A1A1A]">{comment.message}</p>
                  <p className="mt-1 text-[11px] text-[#6B7280]">
                    {comment.postPreview ? `${t("onPost")}: ${comment.postPreview}` : ""}
                    {comment.createdAt
                      ? ` · ${new Date(comment.createdAt).toLocaleString(locale)}`
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
