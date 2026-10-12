import { isAppLocale } from "@/lib/locales";

export const STRIPE_CURRENCY = "eur" as const;
export const PACK_UNITS = 30;
export const PACK_EXPIRES_DAYS = 30;
export const ADS_ACCOUNTS_MAX = 3;

export type PlanId = "studio" | "promote" | "growth";
export type PackKind = "image" | "video" | "leads";
export type EffectivePlan = PlanId | "lifetime" | "none";

export type CatalogLookupKey =
  | "studio_monthly"
  | "studio_annual"
  | "promote_monthly"
  | "promote_annual"
  | "growth_monthly"
  | "growth_annual"
  | "pack_photos_30"
  | "pack_videos_30";

export type CatalogEntry = {
  lookupKey: CatalogLookupKey;
  kind: "plan" | "pack";
  plan?: PlanId;
  pack?: PackKind;
  interval?: "month" | "year";
  amountCents: number;
  productName: string;
};

export const PLAN_RANK: Record<PlanId, number> = {
  studio: 1,
  promote: 2,
  growth: 3,
};

/** Test-mode catalog on VLN MOTORS SRL. Runtime resolves Stripe IDs by lookup_key. */
export const STRIPE_CATALOG: CatalogEntry[] = [
  { lookupKey: "studio_monthly", kind: "plan", plan: "studio", interval: "month", amountCents: 1500, productName: "Studio" },
  { lookupKey: "studio_annual", kind: "plan", plan: "studio", interval: "year", amountCents: 15000, productName: "Studio" },
  { lookupKey: "promote_monthly", kind: "plan", plan: "promote", interval: "month", amountCents: 2100, productName: "Promovare" },
  { lookupKey: "promote_annual", kind: "plan", plan: "promote", interval: "year", amountCents: 23000, productName: "Promovare" },
  { lookupKey: "growth_monthly", kind: "plan", plan: "growth", interval: "month", amountCents: 4000, productName: "Creștere" },
  { lookupKey: "growth_annual", kind: "plan", plan: "growth", interval: "year", amountCents: 43000, productName: "Creștere" },
  { lookupKey: "pack_photos_30", kind: "pack", pack: "image", amountCents: 250, productName: "30 poze" },
  { lookupKey: "pack_videos_30", kind: "pack", pack: "video", amountCents: 500, productName: "30 video" },
];

const BY_KEY = new Map(STRIPE_CATALOG.map((entry) => [entry.lookupKey, entry]));

export function catalogByLookupKey(key: string): CatalogEntry | undefined {
  return BY_KEY.get(key as CatalogLookupKey);
}

export function isCatalogLookupKey(value: string): value is CatalogLookupKey {
  return BY_KEY.has(value as CatalogLookupKey);
}

export function highestPlan(plans: PlanId[]): PlanId | null {
  let best: PlanId | null = null;
  for (const plan of plans) {
    if (!best || PLAN_RANK[plan] > PLAN_RANK[best]) best = plan;
  }
  return best;
}

export function effectivePlan(lifetime: boolean, plan: string | null | undefined): EffectivePlan {
  if (lifetime) return "lifetime";
  if (plan === "studio" || plan === "promote" || plan === "growth") return plan;
  return "none";
}

export function canUseAds(plan: EffectivePlan) {
  return plan === "promote" || plan === "growth" || plan === "lifetime";
}

export function canUseLeads(plan: EffectivePlan) {
  return plan === "growth" || plan === "lifetime";
}

export function adsAccountsMax(plan: EffectivePlan) {
  return canUseAds(plan) ? ADS_ACCOUNTS_MAX : 0;
}

export type PlanCta = "current" | "upgrade" | "downgrade" | "switchInterval" | "choose";

export function planCta(
  current: EffectivePlan,
  currentInterval: "month" | "year" | null,
  target: PlanId,
  yearly: boolean,
): PlanCta {
  if (current === "lifetime") return "current";
  if (current === "none") return "choose";
  const targetInterval = yearly ? "year" : "month";
  if (current === target) {
    return currentInterval && currentInterval !== targetInterval ? "switchInterval" : "current";
  }
  return PLAN_RANK[target] > PLAN_RANK[current] ? "upgrade" : "downgrade";
}

export function formatEurFromCents(cents: number, locale: string) {
  const tag = isAppLocale(locale)
    ? { en: "en-GB", ro: "ro-RO", de: "de-DE", it: "it-IT", fr: "fr-FR", es: "es-ES" }[locale]
    : "en-GB";
  return new Intl.NumberFormat(tag, { style: "currency", currency: "EUR" }).format(cents / 100);
}
