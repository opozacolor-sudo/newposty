export const PROMO_UNTIL_ISO = "2026-11-15T21:59:59.999Z";
export const PACKAGES_FROM_ISO = "2026-11-01T00:00:00+02:00";
export const PROMO_PHOTO_UNITS = 15;
export const PROMO_VIDEO_UNITS = 15;

export function promoStillOpen(now = new Date()) {
  return now.getTime() < Date.parse(PROMO_UNTIL_ISO);
}

export function promoActive(promoUntil?: string | null, now = new Date()) {
  if (!promoUntil) return false;
  const end = Date.parse(promoUntil);
  return Number.isFinite(end) && end > now.getTime();
}

export function promoCreditSessionId(userId: string, kind: "image" | "video") {
  return `promo-nov2026-${kind}-${userId}`;
}
