import { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function pickLocale<T>(map: Partial<Record<AppLocale, T>> & { en: T }, locale: string): T {
  if (isAppLocale(locale) && map[locale]) return map[locale] as T;
  return map.en;
}
