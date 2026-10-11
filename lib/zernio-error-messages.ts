const ERROR_MESSAGES: Record<string, { en: string; ro: string } & Record<string, string | undefined>> = {
  ACCOUNT_DISCONNECTED: {
    en: "This account is disconnected. Reconnect it from Accounts, then try again.",
    ro: "Contul e deconectat. Reconectează-l din Conturi, apoi încearcă din nou.",
  },
  account_not_found: {
    en: "That account was not found or is no longer connected.",
    ro: "Contul nu a fost găsit sau nu mai e conectat.",
  },
  missing_required_field: {
    en: "Something required is missing from this post. Check the caption and media, then try again.",
    ro: "Lipsește ceva obligatoriu din postare. Verifică textul și materialul, apoi încearcă din nou.",
  },
  invalid_field_value: {
    en: "One of the post fields is not accepted by this platform.",
    ro: "Un câmp al postării nu e acceptat de această platformă.",
  },
  quota_exhausted: {
    en: "TikTok blocked publishing through connected apps for now (daily active-user cap). One video is enough to hit it. Try later, or post from the TikTok app.",
    ro: "TikTok a blocat momentan publicarea prin aplicații conectate (cota zilnică de utilizatori activi). Un singur clip e de ajuns ca să apară. Încearcă mai târziu sau publică din aplicația TikTok.",
  },
  quotaexhausted: {
    en: "TikTok blocked publishing through connected apps for now (daily active-user cap). One video is enough to hit it. Try later, or post from the TikTok app.",
    ro: "TikTok a blocat momentan publicarea prin aplicații conectate (cota zilnică de utilizatori activi). Un singur clip e de ajuns ca să apară. Încearcă mai târziu sau publică din aplicația TikTok.",
  },
  active_user_quota: {
    en: "TikTok blocked publishing through connected apps for now (daily active-user cap). One video is enough to hit it. Try later, or post from the TikTok app.",
    ro: "TikTok a blocat momentan publicarea prin aplicații conectate (cota zilnică de utilizatori activi). Un singur clip e de ajuns ca să apară. Încearcă mai târziu sau publică din aplicația TikTok.",
  },
  reached_active_user_cap: {
    en: "TikTok blocked publishing through connected apps for now (daily active-user cap). One video is enough to hit it. Try later, or post from the TikTok app.",
    ro: "TikTok a blocat momentan publicarea prin aplicații conectate (cota zilnică de utilizatori activi). Un singur clip e de ajuns ca să apară. Încearcă mai târziu sau publică din aplicația TikTok.",
  },
  rate_limited: {
    en: "Too many posts too quickly. Wait a bit, then try again.",
    ro: "Prea multe postări prea repede. Așteaptă puțin, apoi încearcă din nou.",
  },
  platform_api_error: {
    en: "The platform rejected the post. Check the account and media, then try again.",
    ro: "Platforma a respins postarea. Verifică contul și materialul, apoi încearcă din nou.",
  },
  post_not_found: {
    en: "That scheduled post was not found.",
    ro: "Postarea programată nu a fost găsită.",
  },
  duplicate: {
    en: "This exact content was already posted to that account recently. Change the caption or media.",
    ro: "Exact acest conținut a fost deja postat recent pe acel cont. Schimbă textul sau materialul.",
  },
  token_expired: {
    en: "The connection expired. Reconnect the account from Accounts.",
    ro: "Conexiunea a expirat. Reconectează contul din Conturi.",
  },
  media_processing_failed: {
    en: "The file format or size is not supported on this platform.",
    ro: "Formatul sau dimensiunea fișierului nu e acceptată pe această platformă.",
  },
  permissions_missing: {
    en: "This account is missing the permissions needed to post. Reconnect it from Accounts.",
    ro: "Contului îi lipsesc permisiunile de postare. Reconectează-l din Conturi.",
  },
  unpublished_post: {
    en: "TikTok is still publishing the video. Wait a minute, then start the ad again.",
    ro: "TikTok încă publică videoul. Așteaptă un minut, apoi pornește reclama din nou.",
    de: "TikTok veröffentlicht das Video noch. Warte eine Minute und starte die Anzeige erneut.",
    it: "TikTok sta ancora pubblicando il video. Aspetta un minuto e poi avvia di nuovo l’ads.",
    fr: "TikTok publie encore la vidéo. Attends une minute, puis relance la pub.",
    es: "TikTok sigue publicando el vídeo. Espera un minuto y vuelve a lanzar el anuncio.",
  },
  spark_not_ready: {
    en: "TikTok published the video but it is not ready as a Spark ad yet. Wait a minute, then start the ad again. Do not send a new clip.",
    ro: "TikTok a publicat videoul, dar încă nu-l poate folosi ca Spark. Așteaptă un minut, apoi pornește reclama din nou. Nu trimite un clip nou.",
    de: "TikTok hat das Video veröffentlicht, aber Spark ist noch nicht bereit. Warte eine Minute und starte die Anzeige erneut. Sende kein neues Video.",
    it: "TikTok ha pubblicato il video, ma Spark non è ancora pronto. Aspetta un minuto e avvia di nuovo l’ads. Non inviare un nuovo clip.",
    fr: "TikTok a publié la vidéo, mais la Spark n’est pas encore prête. Attends une minute, puis relance la pub. N’envoie pas un nouveau clip.",
    es: "TikTok publicó el vídeo, pero Spark aún no está listo. Espera un minuto y lanza el anuncio otra vez. No envíes un clip nuevo.",
  },
};

function fromText(text: string): keyof typeof ERROR_MESSAGES | null {
  const lower = text.toLowerCase();
  if (lower.includes("daily active user") || lower.includes("active user cap") || lower.includes("active-user")) {
    return "active_user_quota";
  }
  if (lower.includes("quota")) return "quota_exhausted";
  if (lower.includes("disconnect") || lower.includes("expired")) return "token_expired";
  if (lower.includes("duplicate") || lower.includes("24 hour")) return "duplicate";
  if (lower.includes("rate limit") || lower.includes("too many")) return "rate_limited";
  if (lower.includes("media") && (lower.includes("failed") || lower.includes("format"))) {
    return "media_processing_failed";
  }
  if (lower.includes("permission")) return "permissions_missing";
  if (lower.includes("not found")) return "post_not_found";
  if (lower.includes("not been published") || lower.includes("not published")) return "unpublished_post";
  if (lower.includes("unable to get spark") || lower.includes("spark ad post")) return "spark_not_ready";
  if (lower.includes("tiktok_item_id") || lower.includes("not a valid integer")) return "spark_not_ready";
  return null;
}

export function humanZernioError(input: {
  code?: string | null;
  message?: string | null;
  locale?: string;
}): string {
  const locale = input.locale ?? "en";
  const code = input.code?.trim();
  if (code && ERROR_MESSAGES[code]) return pickError(ERROR_MESSAGES[code], locale);
  const compact = code?.replace(/[_-]/g, "").toLowerCase();
  if (compact && ERROR_MESSAGES[compact]) return pickError(ERROR_MESSAGES[compact], locale);
  const mapped = fromText(input.message ?? "");
  if (mapped) return pickError(ERROR_MESSAGES[mapped], locale);
  return locale === "ro"
    ? "Postarea nu a putut fi trimisă pe această platformă."
    : "The post could not be sent to this platform.";
}

function pickError(messages: { en: string; ro: string } & Record<string, string | undefined>, locale: string) {
  return messages[locale] ?? (locale === "ro" ? messages.ro : messages.en);
}
