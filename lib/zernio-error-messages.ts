const ERROR_MESSAGES: Record<string, { en: string; ro: string }> = {
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
    en: "TikTok’s daily posting limit for this account is reached. Try again tomorrow, or post from the TikTok app.",
    ro: "TikTok a atins limita zilnică de postări pentru acest cont. Încearcă mâine sau publică din aplicația TikTok.",
  },
  quotaexhausted: {
    en: "TikTok’s daily posting limit for this account is reached. Try again tomorrow, or post from the TikTok app.",
    ro: "TikTok a atins limita zilnică de postări pentru acest cont. Încearcă mâine sau publică din aplicația TikTok.",
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
};

function fromText(text: string): keyof typeof ERROR_MESSAGES | null {
  const lower = text.toLowerCase();
  if (lower.includes("quota") || lower.includes("daily active user")) return "quota_exhausted";
  if (lower.includes("disconnect") || lower.includes("expired")) return "token_expired";
  if (lower.includes("duplicate") || lower.includes("24 hour")) return "duplicate";
  if (lower.includes("rate limit") || lower.includes("too many")) return "rate_limited";
  if (lower.includes("media") && (lower.includes("failed") || lower.includes("format"))) {
    return "media_processing_failed";
  }
  if (lower.includes("permission")) return "permissions_missing";
  if (lower.includes("not found")) return "post_not_found";
  return null;
}

export function humanZernioError(input: {
  code?: string | null;
  message?: string | null;
  locale?: string;
}): string {
  const locale = input.locale === "ro" ? "ro" : "en";
  const code = input.code?.trim();
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code][locale];
  const compact = code?.replace(/[_-]/g, "").toLowerCase();
  if (compact && ERROR_MESSAGES[compact]) return ERROR_MESSAGES[compact][locale];
  const mapped = fromText(input.message ?? "");
  if (mapped) return ERROR_MESSAGES[mapped][locale];
  return locale === "ro"
    ? "Postarea nu a putut fi trimisă pe această platformă."
    : "The post could not be sent to this platform.";
}
