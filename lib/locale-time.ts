import { routing } from "@/i18n/routing";

const TIMEZONES = {
  ro: "Europe/Bucharest",
  en: "Europe/London",
} as const;

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: unknown): value is AppLocale {
  return value === "ro" || value === "en";
}

export function localeFromRequest(request: Request, explicit?: string | null) {
  if (isAppLocale(explicit)) return explicit;
  const fromQuery = new URL(request.url).searchParams.get("locale");
  if (isAppLocale(fromQuery)) return fromQuery;
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("NEXT_LOCALE="))
    ?.slice("NEXT_LOCALE=".length);
  return isAppLocale(cookie) ? cookie : "en";
}

export function timezoneForLocale(locale: string) {
  return TIMEZONES[isAppLocale(locale) ? locale : routing.defaultLocale];
}

function numericParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
}

export function clockSnapshot(locale: string, at = new Date()) {
  const timeZone = timezoneForLocale(locale);
  const intlLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const parts = numericParts(at, timeZone);
  const ymd = `${parts.year}-${parts.month}-${parts.day}`;
  const localIso = `${ymd}T${parts.hour}:${parts.minute}:${parts.second ?? "00"}`;

  const dateLabel = new Intl.DateTimeFormat(intlLocale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(at);

  const timeLabel = new Intl.DateTimeFormat(intlLocale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: locale === "ro" ? "h23" : "h12",
  }).format(at);

  const tomorrow = new Date(`${ymd}T12:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowYmd = tomorrow.toISOString().slice(0, 10);

  return {
    timeZone,
    ymd,
    tomorrowYmd,
    localIso,
    dateLabel,
    timeLabel,
  };
}
