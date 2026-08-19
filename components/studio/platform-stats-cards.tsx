"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { ADS_PLATFORMS, PLATFORMS, platformHasLimitedStats } from "@/lib/platforms";
import type { AnalyticsCard } from "@/lib/analytics-shared";

function formatCount(value: number | null, locale: string) {
  if (value === null) return "—";
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMoney(value: number | null, locale: string, currency?: string | null) {
  if (value === null) return "—";
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

function accountName(card: AnalyticsCard | undefined, fallback: string) {
  if (!card) return fallback;
  if (card.username) return `@${card.username.replace(/^@/, "")}`;
  return card.displayName ?? fallback;
}

export function PlatformStatsCards({
  accounts,
  variant = "posts",
}: {
  accounts: Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
  }>;
  variant?: "posts" | "ads";
}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const [stats, setStats] = useState<AnalyticsCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const platforms = variant === "ads" ? ADS_PLATFORMS : PLATFORMS;
  const hrefBase = variant === "ads" ? "/dashboard/ads" : "/dashboard/posts";
  const overviewUrl =
    variant === "ads" ? "/api/analytics/ads/overview" : "/api/analytics/overview";

  const byPlatform = useMemo(() => {
    const map = new Map<string, (typeof accounts)[number]>();
    for (const account of accounts) {
      if (!map.has(account.platform)) map.set(account.platform, account);
    }
    return map;
  }, [accounts]);

  async function load() {
    if (accounts.length === 0) {
      setStats([]);
      return;
    }
    setError(null);
    try {
      const response = await fetch(overviewUrl);
      const payload = (await response.json()) as { cards?: AnalyticsCard[]; error?: string };
      if (!response.ok) {
        setError(payload.error ?? t("analyticsError"));
        setStats(
          accounts.map((account) => ({
            accountId: account.id,
            platform: account.platform,
            username: account.username,
            displayName: account.display_name,
            posts30d: null,
            engagement30d: null,
            followers: null,
            campaigns30d: null,
            spend30d: null,
            impressions30d: null,
            limited: platformHasLimitedStats(account.platform),
          })),
        );
        return;
      }
      setStats(payload.cards ?? []);
    } catch {
      setError(t("analyticsError"));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsByPlatform = useMemo(() => {
    const map = new Map<string, AnalyticsCard>();
    for (const card of stats ?? []) {
      if (!map.has(card.platform)) map.set(card.platform, card);
    }
    return map;
  }, [stats]);

  const loading = stats === null && accounts.length > 0 && !error;

  return (
    <div>
      {error ? (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-[#6B7280]">
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
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {platforms.map((platform) => {
          const account = byPlatform.get(platform.id);
          const card = statsByPlatform.get(platform.id);
          const connected = Boolean(account);
          const href = account
            ? `${hrefBase}/${platform.id}?account=${account.id}`
            : `${hrefBase}/${platform.id}`;
          const isNew = "isNew" in platform && platform.isNew;

          return (
            <li key={platform.id}>
              <Link
                href={href}
                className="relative flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--brand)_55%,transparent)]"
                style={{
                  ["--brand" as string]: platform.brand,
                  borderLeftWidth: connected ? 4 : 1,
                  borderLeftColor: connected ? platform.brand : "#E5E5E5",
                }}
              >
                {isNew ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#FF4713] px-2 py-0.5 text-[10px] font-medium text-white">
                    {t("newBadge")}
                  </span>
                ) : null}
                <div className={`flex items-center gap-3 ${isNew ? "pr-10" : ""}`}>
                  <PlatformIcon platform={platform} connected={connected} />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold tracking-tight text-[#1A1A1A]">
                      {platform.label}
                    </p>
                    <p className="truncate text-sm text-[#6B7280]">
                      {connected
                        ? accountName(
                            card ?? {
                              accountId: account!.id,
                              platform: platform.id,
                              username: account!.username,
                              displayName: account!.display_name,
                              posts30d: null,
                              engagement30d: null,
                              followers: null,
                              limited: false,
                            },
                            t("connected"),
                          )
                        : t("notConnected")}
                    </p>
                  </div>
                </div>
                {connected ? (
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                        {variant === "ads" ? t("cardCampaigns") : t("cardPosts")}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                        {loading ? (
                          <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                        ) : (
                          formatCount(
                            variant === "ads"
                              ? (card?.campaigns30d ?? null)
                              : (card?.posts30d ?? null),
                            locale,
                          )
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                        {variant === "ads" ? t("cardSpend") : t("cardEngagement")}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                        {loading ? (
                          <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                        ) : variant === "ads" ? (
                          formatMoney(card?.spend30d ?? null, locale, card?.currency)
                        ) : (
                          formatCount(card?.engagement30d ?? null, locale)
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                        {variant === "ads" ? t("cardImpressions") : t("cardFollowers")}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                        {loading ? (
                          <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                        ) : (
                          formatCount(
                            variant === "ads"
                              ? (card?.impressions30d ?? null)
                              : (card?.followers ?? null),
                            locale,
                          )
                        )}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="mt-4 text-sm text-[#6B7280]">{t("openToSeeStats")}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
