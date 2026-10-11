import { loadLifetimePurchase } from "@/lib/account-server";
import { getStripe } from "@/lib/presale-server";
import { MONTHLY_ACCESS_DAYS, type PlanAccess } from "@/lib/chat-post/plan-horizon";
import { calendarDaysBetween } from "@/lib/chat-post/series";
import { addCalendarDays, ymdInZone } from "@/lib/chat-post/timezone";

function monthlyPeriod(now: Date, timeZone: string): Extract<PlanAccess, { kind: "period" }> {
  const today = ymdInZone(now, timeZone);
  return {
    kind: "period",
    daysRemaining: MONTHLY_ACCESS_DAYS,
    endsOn: addCalendarDays(today, MONTHLY_ACCESS_DAYS),
  };
}

function periodEndUnix(subscription: {
  current_period_end?: number;
  items?: { data?: Array<{ current_period_end?: number }> };
}): number | null {
  if (typeof subscription.current_period_end === "number") return subscription.current_period_end;
  const itemEnd = subscription.items?.data?.[0]?.current_period_end;
  return typeof itemEnd === "number" ? itemEnd : null;
}

export async function loadPlanAccess(input: {
  lifetime?: boolean | null;
  stripeCustomerId?: string | null;
  now?: Date;
  timeZone: string;
}): Promise<PlanAccess> {
  if (input.lifetime) return { kind: "lifetime" };
  const now = input.now ?? new Date();
  if (input.stripeCustomerId) {
    try {
      const list = await getStripe().subscriptions.list({
        customer: input.stripeCustomerId,
        status: "active",
        limit: 1,
      });
      const endUnix = list.data[0] ? periodEndUnix(list.data[0]) : null;
      if (endUnix) {
        const today = ymdInZone(now, input.timeZone);
        const endsOn = ymdInZone(new Date(endUnix * 1000), input.timeZone);
        return {
          kind: "period",
          daysRemaining: Math.max(0, calendarDaysBetween(today, endsOn)),
          endsOn,
        };
      }
    } catch {
      // monthly default below
    }
  }
  return monthlyPeriod(now, input.timeZone);
}

export async function planAccessForUser(input: {
  userId: string;
  email?: string;
  lifetime?: boolean | null;
  timeZone: string;
  now?: Date;
}): Promise<PlanAccess> {
  if (input.lifetime) return { kind: "lifetime" };
  let stripeCustomerId: string | null = null;
  try {
    const purchase = await loadLifetimePurchase(input.userId, input.email);
    stripeCustomerId = purchase?.stripe_customer_id ?? null;
  } catch {
    stripeCustomerId = null;
  }
  return loadPlanAccess({
    lifetime: input.lifetime,
    stripeCustomerId,
    now: input.now,
    timeZone: input.timeZone,
  });
}
