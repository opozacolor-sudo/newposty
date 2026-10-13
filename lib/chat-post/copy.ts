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

export function contentTypeLabel(type?: string | null) {
  const value = (type ?? "").toLowerCase();
  if (value === "stories" || value === "story") return "Story";
  if (value === "reels" || value === "reel") return "Reel";
  if (value === "feed") return "Feed";
  return "";
}

function adsFailedReply(locale: string | undefined) {
  const copy: Record<string, string> = {
    en: "The ad did not start. See the error below.",
    ro: "Reclama nu a pornit. Vezi eroarea mai jos.",
    de: "Die Anzeige ist nicht gestartet. Siehe den Fehler unten.",
    it: "L’ads non è partita. Vedi l’errore qui sotto.",
    fr: "La pub n’a pas démarré. Vois l’erreur ci-dessous.",
    es: "El anuncio no arrancó. Mira el error abajo.",
  };
  return copy[locale ?? "en"] ?? copy.en;
}

export function resultsReply(
  locale: string | undefined,
  results: Array<{ status: string; platform?: string }>,
) {
  const failed = results.filter((item) => item.status === "error").length;
  const ok = results.length - failed;
  const adsOnly =
    results.length > 0 &&
    results.every((item) => item.platform === "metaads" || item.platform === "tiktokads");
  if (adsOnly && ok === 0) return adsFailedReply(locale);
  if (locale === "ro") {
    if (results.length === 0 || ok === 0) return "Nu s-a postat nimic. Vezi erorile mai jos.";
    if (results.length > 8) {
      return failed === 0
        ? `Gata. ${ok} programate. Detaliile sunt mai jos.`
        : `Gata. ${ok} programate, ${failed} eșuate. Detaliile sunt mai jos.`;
    }
    if (failed === 0) return "Gata. Statusul fiecărei rețele e mai jos.";
    return "O parte din postări au plecat. Detaliile sunt mai jos.";
  }
  if (results.length === 0 || ok === 0) return "Nothing was posted. See the errors below.";
  if (results.length > 8) {
    return failed === 0
      ? `Done. ${ok} scheduled. Details are below.`
      : `Done. ${ok} scheduled, ${failed} failed. Details are below.`;
  }
  if (failed === 0) return "Done. Each network’s status is below.";
  return "Some posts went out. Details are below.";
}
