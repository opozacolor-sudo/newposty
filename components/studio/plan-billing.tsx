"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { btnClay, btnOutline, clayTile } from "@/components/marketing/styles";
import { annualSaveCents, priceLabel, pricingCopy } from "@/lib/pricing-copy";
import {
  catalogByLookupKey,
  planCta,
  type CatalogLookupKey,
  type EffectivePlan,
  type PlanId,
} from "@/lib/stripe-catalog";

type BillingPayload = {
  plan?: EffectivePlan;
  lifetime?: boolean;
  hasCustomer?: boolean;
  interval?: "month" | "year" | null;
  lookupKey?: string | null;
  currentPeriodEnd?: string | null;
  credits?: { photos: number; videos: number };
  promoUntil?: string | null;
  promo?: boolean;
  subscription?: { id: string; cancelAtPeriodEnd: boolean } | null;
};

function includesLabel(template: string, plan: string) {
  return template.replace("{plan}", plan);
}

function saveLabel(template: string, amount: string) {
  return template.replace("{amount}", amount);
}

export function PlanBilling({ notice }: { notice?: string | null }) {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const copy = pricingCopy(locale);
  const [data, setData] = useState<BillingPayload | null>(null);
  const [yearly, setYearly] = useState(false);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/account/billing")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: BillingPayload | null) => {
        if (!payload) return;
        setData(payload);
        if (payload.interval === "year") setYearly(true);
      })
      .catch(() => undefined);
  }, []);

  const currentPlan: EffectivePlan = data?.lifetime ? "lifetime" : (data?.plan ?? "none");
  const currentInterval = data?.interval ?? null;

  const previousName = useMemo(() => {
    const map: Record<string, string> = {};
    for (let i = 1; i < copy.plans.length; i += 1) {
      map[copy.plans[i].id] = copy.plans[i - 1].name;
    }
    return map;
  }, [copy.plans]);

  const currentName =
    currentPlan === "lifetime"
      ? t("planLifetime")
      : data?.promo
        ? t("planPromo")
        : currentPlan === "studio"
          ? t("planStudio")
          : currentPlan === "promote"
            ? t("planPromote")
            : currentPlan === "growth"
              ? t("planGrowth")
              : t("planNone");

  async function checkout(lookupKey: CatalogLookupKey) {
    setWorking(lookupKey);
    setError(null);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookupKey, locale }),
      });
      const body = (await response.json()) as { url?: string; updated?: boolean; message?: string };
      if (body.updated) {
        window.location.reload();
        return;
      }
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      setError(body.message || t("checkoutError"));
    } catch {
      setError(t("checkoutError"));
    } finally {
      setWorking(null);
    }
  }

  async function openPortal() {
    setWorking("portal");
    setError(null);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const body = (await response.json()) as { url?: string };
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      setError(t("portalError"));
    } catch {
      setError(t("portalError"));
    } finally {
      setWorking(null);
    }
  }

  function planLookup(plan: PlanId): CatalogLookupKey {
    return (yearly ? `${plan}_annual` : `${plan}_monthly`) as CatalogLookupKey;
  }

  function ctaLabel(action: ReturnType<typeof planCta>) {
    if (action === "upgrade") return t("upgrade");
    if (action === "downgrade") return t("downgrade");
    if (action === "switchInterval") return yearly ? t("switchYearly") : t("switchMonthly");
    if (action === "choose") return t("choose");
    return t("currentBadge");
  }

  const renews =
    data?.currentPeriodEnd &&
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(data.currentPeriodEnd),
    );

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5c5652]">{t("planKicker")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
          {t("planTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c5652]">{t("planLead")}</p>
      </div>

      {notice === "success" ? <p className="text-sm text-[#1d1d1f]">{t("checkoutSuccess")}</p> : null}
      {notice === "pending" ? <p className="text-sm text-[#5c5652]">{t("checkoutPending")}</p> : null}
      {notice === "cancel" ? <p className="text-sm text-[#5c5652]">{t("checkoutCancel")}</p> : null}

      <article className={`${clayTile} flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between`}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
            {t("currentBadge")}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-[#1d1d1f]">{currentName}</p>
          <p className="mt-2 text-sm text-[#5c5652]">
            {t("creditsLine", {
              photos: data?.credits?.photos ?? 0,
              videos: data?.credits?.videos ?? 0,
            })}
          </p>
          {renews ? (
            <p className="mt-1 text-xs text-[#6b5348]">{t("renews", { date: renews })}</p>
          ) : null}
          {data?.promo ? <p className="mt-2 text-sm leading-6 text-[#55514e]">{t("promoNote")}</p> : null}
          {currentPlan === "lifetime" ? (
            <p className="mt-2 text-sm leading-6 text-[#55514e]">{t("lifetimeNote")}</p>
          ) : null}
        </div>
        {data?.hasCustomer || data?.subscription ? (
          <button
            type="button"
            disabled={Boolean(working)}
            onClick={() => void openPortal()}
            className={`${btnOutline} disabled:opacity-60`}
          >
            {working === "portal" ? t("buying") : t("manage")}
          </button>
        ) : null}
      </article>

      <div className="flex justify-center">
        <div className="posty-clay-tile inline-flex rounded-full p-1">
          <button
            type="button"
            aria-pressed={!yearly}
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              yearly ? "text-[#5c5652]" : "bg-white/70 text-[#1d1d1f]"
            }`}
          >
            {copy.monthly}
          </button>
          <button
            type="button"
            aria-pressed={yearly}
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              yearly ? "bg-white/70 text-[#1d1d1f]" : "text-[#5c5652]"
            }`}
          >
            {copy.annual}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {copy.plans.map((plan) => {
          const cents = yearly ? plan.annualCents : plan.monthlyCents;
          const save = yearly ? annualSaveCents(plan) : 0;
          const included = previousName[plan.id];
          const action = planCta(currentPlan, currentInterval, plan.id, yearly);
          const lookup = planLookup(plan.id);
          const isCurrent = action === "current";
          return (
            <article
              key={plan.id}
              className={`${clayTile} flex flex-col ${
                isCurrent || plan.featured ? "ring-2 ring-[#1d1d1f]/15" : ""
              }`}
            >
              {isCurrent ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
                  {t("currentBadge")}
                </p>
              ) : plan.featured ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
                  {copy.featured}
                </p>
              ) : null}
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#1d1d1f]">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#6b5348]">{plan.tag}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                {priceLabel(cents, locale)}
                <span className="ml-1 text-base font-medium text-[#5c5652]">
                  {yearly ? copy.perYear : copy.perMonth}
                </span>
              </p>
              {save > 0 ? (
                <p className="mt-1 text-xs font-medium text-[#6b5348]">
                  {saveLabel(copy.saveYear, priceLabel(save, locale))}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-6 text-[#1d1d1f]">{plan.gain}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm leading-6 text-[#55514e]">
                {included ? (
                  <li className="font-medium text-[#1d1d1f]">{includesLabel(copy.includes, included)}</li>
                ) : null}
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || Boolean(working)}
                onClick={() => void checkout(lookup)}
                className={`mt-6 ${isCurrent ? btnOutline : btnClay} disabled:opacity-60`}
              >
                {working === lookup ? t("buying") : ctaLabel(action)}
              </button>
            </article>
          );
        })}
      </div>

      <div>
        <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{t("packsTitle")}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c5652]">{t("packsLead")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {copy.packs.map((pack) => {
            const lookup = catalogByLookupKey(pack.id === "photos" ? "pack_photos_30" : "pack_videos_30")
              ?.lookupKey;
            const left = pack.id === "photos" ? (data?.credits?.photos ?? 0) : (data?.credits?.videos ?? 0);
            return (
              <article key={pack.id} className={`${clayTile} flex flex-col`}>
                <h4 className="text-base font-semibold text-[#1d1d1f]">{pack.name}</h4>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                  {priceLabel(pack.priceCents, locale)}
                </p>
                <p className="mt-1 text-xs font-medium text-[#6b5348]">
                  {pack.id === "photos"
                    ? t("creditsPhotos", { n: left })
                    : t("creditsVideos", { n: left })}
                </p>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#55514e]">{pack.body}</p>
                <button
                  type="button"
                  disabled={!lookup || Boolean(working) || Boolean(data?.promo)}
                  onClick={() => lookup && void checkout(lookup)}
                  className={`mt-6 ${btnClay} disabled:opacity-60`}
                >
                  {working === lookup
                    ? t("buying")
                    : data?.promo
                      ? t("promoPacksLater")
                      : pack.id === "photos"
                        ? t("buyPhotos")
                        : t("buyVideos")}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <p className="text-xs leading-5 text-[#6b5348]">{copy.vat}</p>
      {error ? <p className="text-sm text-[#FF4713]">{error}</p> : null}
    </section>
  );
}
