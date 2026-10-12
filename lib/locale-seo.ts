import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_ORIGIN = "https://posty.now";

export function pathWithoutLocale(pathname: string, locale: string) {
  const prefix = `/${locale}`;
  if (pathname === prefix || pathname === `${prefix}/`) return "";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return "";
}

export function localeAlternates(
  locale: string,
  pathname: string,
): NonNullable<Metadata["alternates"]> {
  const rest = pathWithoutLocale(pathname, locale);
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_ORIGIN}/${loc}${rest}`;
  }
  languages["x-default"] = `${SITE_ORIGIN}/${routing.defaultLocale}${rest}`;
  return {
    canonical: `${SITE_ORIGIN}/${locale}${rest}`,
    languages,
  };
}
