"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatEurFromCents, type CatalogEntry } from "@/lib/stripe-catalog";

type BillingPayload = {
  plan?: string;
  hasCustomer?: boolean;
  canLeads?: boolean;
  credits?: { photos: number; videos: number };
  catalog?: CatalogEntry[];
  subscription?: { id: string; cancelAtPeriodEnd: boolean } | null;
};

export function PlanBilling({ notice }: { notice?: string | null }) {
  const t = useTranslations("Billing");
  const locale = useLocale();
  const [data, setData] = useState<BillingPayload | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/account/billing")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: BillingPayload | null) => {
        if (payload) setData(payload);
      })
      .catch(() => undefined);
  }, []);

  async function checkout(lookupKey: string) {
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

  const planLabel =
    data?.plan === "lifetime"
      ? t("planLifetime")
      : data?.plan === "studio"
        ? t("planStudio")
        : data?.plan === "promote"
          ? t("planPromote")
          : data?.plan === "growth"
            ? t("planGrowth")
            : t("planNone");

  const catalog = data?.catalog ?? [];
  const plans = catalog.filter((entry) => entry.kind === "plan");
  const packs = catalog.filter((entry) => entry.kind === "pack");

  return (
    <section className="mt-12 max-w-xl space-y-4">
      <h2 className="text-sm font-semibold text-[#1d1d1f]">{t("planTitle")}</h2>
      <p className="text-sm leading-6 text-[#5c5652]">{t("planLead")}</p>
      {notice === "success" ? <p className="text-sm text-[#1d1d1f]">{t("checkoutSuccess")}</p> : null}
      {notice === "pending" ? <p className="text-sm text-[#5c5652]">{t("checkoutPending")}</p> : null}
      {notice === "cancel" ? <p className="text-sm text-[#5c5652]">{t("checkoutCancel")}</p> : null}
      <p className="text-sm text-[#1d1d1f]">
        {t("currentPlan", { plan: planLabel })}
        {data?.credits
          ? ` · ${t("creditsLine", {
              photos: data.credits.photos,
              videos: data.credits.videos,
            })}`
          : ""}
      </p>
      <ul className="space-y-2">
        {plans.map((entry) => (
          <li key={entry.lookupKey} className="flex items-center justify-between gap-3 text-sm">
            <span>
              {entry.productName} · {entry.interval === "year" ? t("annual") : t("monthly")} ·{" "}
              {formatEurFromCents(entry.amountCents, locale)}
            </span>
            <button
              type="button"
              disabled={Boolean(working)}
              onClick={() => void checkout(entry.lookupKey)}
              className="posty-site-btn h-8 shrink-0 px-3 text-xs disabled:opacity-60"
            >
              {working === entry.lookupKey ? t("buying") : t("buy")}
            </button>
          </li>
        ))}
      </ul>
      <ul className="space-y-2">
        {packs.map((entry) => (
          <li key={entry.lookupKey} className="flex items-center justify-between gap-3 text-sm">
            <span>
              {entry.productName} · {formatEurFromCents(entry.amountCents, locale)}
            </span>
            <button
              type="button"
              disabled={Boolean(working)}
              onClick={() => void checkout(entry.lookupKey)}
              className="posty-site-btn h-8 shrink-0 px-3 text-xs disabled:opacity-60"
            >
              {working === entry.lookupKey ? t("buying") : t("buy")}
            </button>
          </li>
        ))}
      </ul>
      {data?.hasCustomer || data?.subscription ? (
        <button
          type="button"
          disabled={Boolean(working)}
          onClick={() => void openPortal()}
          className="text-sm text-[#5c5652] underline disabled:opacity-60"
        >
          {working === "portal" ? t("buying") : t("manage")}
        </button>
      ) : null}
      {error ? <p className="text-sm text-[#FF4713]">{error}</p> : null}
    </section>
  );
}
