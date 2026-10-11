import { isAppLocale, type AppLocale } from "@/lib/locales";

export const MONTHLY_ACCESS_DAYS = 30;

export type PlanAccess =
  | { kind: "lifetime" }
  | { kind: "period"; daysRemaining: number; endsOn: string };

const MONTH_WORDS =
  /(?:luni|luna|lună|months?|monate|monat|mesi|mese|mois|meses|mes)\b/i;
const DAY_WORDS = /(?:zile|zi|days?|tagen|tag|giorni|giorno|jours?|días?|dia)\b/i;

export function parseRequestedPlanDays(text: string): number | null {
  const raw = text.normalize("NFC").trim();
  if (!raw) return null;

  const numbered = raw.match(
    /(?:pentru|pe|for|für|per|pour|para)?\s*(\d+)\s*(?:de\s+)?(zile|zi|days?|tagen|tag|giorni|giorno|jours?|días?|dia|luni|luna|lună|months?|monate|monat|mesi|mese|mois|meses|mes)\b/i,
  );
  if (numbered) {
    const count = Number(numbered[1]);
    if (!Number.isFinite(count) || count < 1) return null;
    if (MONTH_WORDS.test(numbered[2])) return Math.round(count * MONTHLY_ACCESS_DAYS);
    if (DAY_WORDS.test(numbered[2])) return count;
  }

  if (
    /(?:^|[^\p{L}])(?:o lun[aă]|unei lun[aă]|one month|a month|ein monat|un mese|un mois|un mes)(?:[^\p{L}]|$)/iu.test(
      raw,
    )
  ) {
    return MONTHLY_ACCESS_DAYS;
  }

  return null;
}

export function planExceedsAccess(planDays: number, access: PlanAccess): boolean {
  if (access.kind === "lifetime") return false;
  if (!Number.isFinite(planDays) || planDays < 1) return false;
  return planDays > access.daysRemaining;
}

export function plannedDaysFromSeries(input: {
  brief?: string;
  dailyDays?: number;
  catalogDays?: number;
}): number {
  const fromBrief = parseRequestedPlanDays(input.brief ?? "") ?? 0;
  return Math.max(fromBrief, input.dailyDays ?? 0, input.catalogDays ?? 0);
}

export function planAccessLine(access: PlanAccess): string {
  if (access.kind === "lifetime") {
    return "Access: lifetime. No cap on how many days a content plan may cover.";
  }
  return `Access: paid period ${access.daysRemaining} days remaining (ends ${access.endsOn}). A content-idea calendar or scheduled series may not last longer than remaining access. If they ask for 6 months on a 30-day subscription, do not draft or schedule it. Tell them they need a subscription that lasts longer than the plan.`;
}

const TOO_LONG: Record<AppLocale, (planDays: number, daysRemaining: number, endsOn: string) => string> = {
  en: (planDays, daysRemaining, endsOn) =>
    `That plan is ${planDays} days. Your subscription covers ${daysRemaining} days (until ${endsOn}). You need a subscription longer than the plan.`,
  ro: (planDays, daysRemaining, endsOn) =>
    `Planul e pe ${planDays} de zile. Abonamentul tău acoperă ${daysRemaining} de zile (până pe ${endsOn}). Ai nevoie de un abonament mai lung decât planul.`,
  de: (planDays, daysRemaining, endsOn) =>
    `Der Plan geht über ${planDays} Tage. Dein Abo deckt ${daysRemaining} Tage (bis ${endsOn}). Du brauchst ein Abo, das länger läuft als der Plan.`,
  it: (planDays, daysRemaining, endsOn) =>
    `Il piano è di ${planDays} giorni. L’abbonamento copre ${daysRemaining} giorni (fino al ${endsOn}). Serve un abbonamento più lungo del piano.`,
  fr: (planDays, daysRemaining, endsOn) =>
    `Le plan fait ${planDays} jours. L’abonnement couvre ${daysRemaining} jours (jusqu’au ${endsOn}). Il faut un abonnement plus long que le plan.`,
  es: (planDays, daysRemaining, endsOn) =>
    `El plan es de ${planDays} días. La suscripción cubre ${daysRemaining} días (hasta el ${endsOn}). Necesitas una suscripción más larga que el plan.`,
};

export function planTooLongMessage(
  locale: string,
  input: { planDays: number; access: Extract<PlanAccess, { kind: "period" }> },
) {
  const key = isAppLocale(locale) ? locale : "en";
  return TOO_LONG[key](input.planDays, input.access.daysRemaining, input.access.endsOn);
}
