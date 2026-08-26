export const REFUND_MONTHLY_REFERENCE_EUR = 15;
export const LIFETIME_MIN_YEARS = 5;
export const WITHDRAWAL_DAYS = 14;

export function addCalendarMonthsUtc(from: Date, months: number) {
  const result = new Date(from.getTime());
  const utcDay = result.getUTCDate();
  result.setUTCMonth(result.getUTCMonth() + months);
  if (result.getUTCDate() !== utcDay) {
    result.setUTCDate(0);
  }
  return result;
}

export function elapsedMonthsCeiling(startedAt: Date, now: Date) {
  if (Number.isNaN(startedAt.getTime()) || Number.isNaN(now.getTime())) {
    throw new Error("invalid date");
  }
  if (now.getTime() < startedAt.getTime()) return 1;
  let months = 1;
  while (addCalendarMonthsUtc(startedAt, months).getTime() <= now.getTime()) {
    months += 1;
    if (months > 1200) break;
  }
  return months;
}

export function lifetimeRefundEur(paidEur: number, monthsConsumed: number) {
  if (!Number.isFinite(paidEur) || paidEur < 0) throw new Error("invalid paid amount");
  const months = Math.max(0, Math.floor(monthsConsumed));
  return Math.max(0, Math.round(paidEur) - REFUND_MONTHLY_REFERENCE_EUR * months);
}

export function qualifiesForFullWithdrawal(
  startedAt: Date,
  now: Date,
  consentedImmediateStart: boolean,
) {
  if (consentedImmediateStart) return false;
  return now.getTime() - startedAt.getTime() <= WITHDRAWAL_DAYS * 24 * 60 * 60 * 1000;
}

export function computeLifetimeRefund(input: {
  paidEur: number;
  startedAt: Date;
  now: Date;
  consentedImmediateStart: boolean;
}) {
  if (qualifiesForFullWithdrawal(input.startedAt, input.now, input.consentedImmediateStart)) {
    return {
      amountEur: Math.max(0, Math.round(input.paidEur)),
      monthsConsumed: 0,
      fullWithdrawal: true as const,
    };
  }
  const monthsConsumed = elapsedMonthsCeiling(input.startedAt, input.now);
  return {
    amountEur: lifetimeRefundEur(input.paidEur, monthsConsumed),
    monthsConsumed,
    fullWithdrawal: false as const,
  };
}
