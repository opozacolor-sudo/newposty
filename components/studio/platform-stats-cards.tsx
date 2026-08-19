"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { getPlatform, platformHasLimitedStats } from "@/lib/platforms";
import type { AnalyticsCard } from "@/lib/analytics-shared";

function formatCount(value: number | null, locale: string) {
  if (value === null) return "—";
  return new Intl.NumberFormat(locale, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function accountName(card: AnalyticsCard, fallback: string) {
  if (card.username) return `@${card.username.replace(/^@/, "")}`;
  return card.displayName ?? fallback;
}

export function PlatformStatsCards({
  accounts,
}: {
  accounts: Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
  }>;
}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const [cards, setCards] = useState<AnalyticsCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const response = await fetch("/api/analytics/overview");
      const payload = (await response.json()) as { cards?: AnalyticsCard[]; error?: string };
      if (!response.ok) {
        setError(payload.error ?? t("analyticsError"));
        setCards(
          accounts.map((account) => ({
            accountId: account.id,
            platform: account.platform,
            username: account.username,
            displayName: account.display_name,
            posts30d: null,
            engagement30d: null,
            followers: null,
            limited: platformHasLimitedStats(account.platform),
          })),
        );
        return;
      }
      setCards(payload.cards ?? []);
    } catch {
      setError(t("analyticsError"));
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cards ?? accounts.map((account) => ({
    accountId: account.id,
    platform: account.platform,
    username: account.username,
    displayName: account.display_name,
    posts30d: null,
    engagement30d: null,
    followers: null,
    limited: platformHasLimitedStats(account.platform),
  }));
  const loading = cards === null && !error;

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
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((card) => {
          const platform = getPlatform(card.platform);
          if (!platform) return null;
          return (
            <li key={card.accountId}>
              <Link
                href={`/dashboard/posts/${card.platform}?account=${card.accountId}`}
                className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF4713] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={platform} connected />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                      {platform.label}
                    </p>
                    <p className="truncate text-xs text-[#6B7280]">
                      {accountName(card, t("connected"))}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                      {t("cardPosts")}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                      {loading ? (
                        <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                      ) : (
                        formatCount(card.posts30d, locale)
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                      {t("cardEngagement")}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                      {loading ? (
                        <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                      ) : (
                        formatCount(card.engagement30d, locale)
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wide text-[#6B7280]">
                      {t("cardFollowers")}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-[#1A1A1A]">
                      {loading ? (
                        <span className="inline-block h-6 w-10 animate-pulse rounded bg-[#F3F4F6]" />
                      ) : (
                        formatCount(card.followers, locale)
                      )}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
