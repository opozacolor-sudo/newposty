import type { MetadataRoute } from "next";
import { FEATURES } from "@/lib/features";
import { MADE_FOR } from "@/lib/made-for";
import { routing } from "@/i18n/routing";

const SITE = "https://posty.now";

const MARKETING_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] =
  [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/guide", priority: 0.9, changeFrequency: "weekly" },
    { path: "/platforms", priority: 0.8, changeFrequency: "weekly" },
    { path: "/demo", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/specialist", priority: 0.6, changeFrequency: "monthly" },
    { path: "/waitlist", priority: 0.4, changeFrequency: "monthly" },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/refunds", priority: 0.2, changeFrequency: "yearly" },
    { path: "/subscription", priority: 0.3, changeFrequency: "yearly" },
    ...FEATURES.map((page) => ({
      path: `/features/${page.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...MADE_FOR.map((page) => ({
      path: `/made-for/${page.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

function localeUrl(locale: string, path: string) {
  return `${SITE}/${locale}${path}`;
}

function languages(path: string) {
  const entries = Object.fromEntries(
    routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
  );
  return { ...entries, "x-default": localeUrl("en", path) };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return MARKETING_PATHS.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    })),
  );
}
