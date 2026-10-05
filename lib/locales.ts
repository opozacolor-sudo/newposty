export const APP_LOCALES = ["en", "ro", "de", "it", "fr", "es"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

const LANGUAGE_NAMES: Record<AppLocale, string> = {
  en: "English",
  ro: "Romanian",
  de: "German",
  it: "Italian",
  fr: "French",
  es: "Spanish",
};

const SPEECH_LANG: Record<AppLocale, string> = {
  en: "en-US",
  ro: "ro-RO",
  de: "de-DE",
  it: "it-IT",
  fr: "fr-FR",
  es: "es-ES",
};

const TIMEZONES: Record<AppLocale, string> = {
  en: "Europe/London",
  ro: "Europe/Bucharest",
  de: "Europe/Berlin",
  it: "Europe/Rome",
  fr: "Europe/Paris",
  es: "Europe/Madrid",
};

const INTL_LOCALES: Record<AppLocale, string> = {
  en: "en-GB",
  ro: "ro-RO",
  de: "de-DE",
  it: "it-IT",
  fr: "fr-FR",
  es: "es-ES",
};

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (APP_LOCALES as readonly string[]).includes(value);
}

export function chatLanguageName(locale: string) {
  return LANGUAGE_NAMES[isAppLocale(locale) ? locale : "en"];
}

export function speechLangFor(locale: string) {
  return SPEECH_LANG[isAppLocale(locale) ? locale : "en"];
}

export function timezoneForAppLocale(locale: string) {
  return TIMEZONES[isAppLocale(locale) ? locale : "en"];
}

export function intlLocale(locale: string) {
  return INTL_LOCALES[isAppLocale(locale) ? locale : "en"];
}

export function uses24HourClock(locale: string) {
  return locale !== "en";
}
