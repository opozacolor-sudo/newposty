const CANCELLED = {
  en: "Cancelled. Send a new instruction if you want to change it.",
  ro: "Anulat. Trimite o comandă nouă dacă vrei să schimbi.",
} as const;

export function cancelledCopy(locale?: string) {
  return locale === "ro" ? CANCELLED.ro : CANCELLED.en;
}

export function isCancelledCopy(content: string) {
  const trimmed = content.trim();
  return trimmed === CANCELLED.en || trimmed === CANCELLED.ro;
}

export function localizeCancelledContent(content: string, locale?: string) {
  return isCancelledCopy(content) ? cancelledCopy(locale) : content;
}
