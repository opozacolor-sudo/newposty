import { extractSameOriginLinks } from "@/lib/leads/knowledge";
import { parseSiteHtml, publicHttpUrl } from "@/lib/site-brief";

export const MAX_CATALOG_POSTS = 30;

export type CatalogProduct = {
  name: string;
  url: string;
  imageUrl: string | null;
  price: string | null;
  description: string;
};

const PRODUCT_HINT =
  /produs|product|shop|magazin|store|p\/|\/products?\/|servic|ofert|crem|ungh|meniu|menu|item|sku|buy|cumpara/i;
const SKIP_HINT =
  /cart|checkout|login|account|privacy|terms|cookie|wp-admin|mailto|tel:|facebook|instagram|tiktok|#/i;

export function parseCatalogRequest(input: {
  cadence?: string | null;
  brief?: string;
  count?: number | null;
  siteUrl?: string | null;
}): { count: number; siteUrl: string | null; includeLink: boolean } | null {
  const brief = input.brief ?? "";
  const text = brief.toLowerCase();
  const named =
    input.cadence === "catalog" ||
    (/site|shop|magazin|produs|product/.test(text) &&
      /\d+\s*(de\s+)?(produs|poze|post|foto)/i.test(brief) &&
      /una pe zi|c[aâ]te una|programeaz|schedule|zilnic/.test(text));
  if (!named && input.cadence !== "catalog") return null;
  const countMatch = brief.match(/(\d{1,2})\s*(de\s+)?(produs|poze|post|foto)/i)?.[1];
  const count = Math.min(
    MAX_CATALOG_POSTS,
    Math.max(2, Number(input.count || countMatch || 0) || 30),
  );
  return {
    count,
    siteUrl: publicHttpUrl(input.siteUrl ?? "") ?? firstUrl(brief),
    includeLink: /link|url|site/.test(text) || input.cadence === "catalog",
  };
}

function firstUrl(text: string) {
  const match = text.match(/https?:\/\/[^\s<>"']+/i);
  return match ? publicHttpUrl(match[0].replace(/[.,;]+$/, "")) : null;
}

export function catalogCaption(input: {
  product: CatalogProduct;
  siteUrl: string;
  locale: string;
  includeLink?: boolean;
}) {
  const lines = [
    input.product.name.trim(),
    input.product.price ? (input.locale === "ro" ? `Preț: ${input.product.price}` : `Price: ${input.product.price}`) : "",
    input.product.description.trim().slice(0, 180),
  ].filter(Boolean);
  const link = input.includeLink === false ? "" : input.product.url || input.siteUrl;
  if (link) lines.push(link);
  return lines.join("\n\n");
}

export function scoreProductUrl(url: string) {
  if (SKIP_HINT.test(url)) return -10;
  if (PRODUCT_HINT.test(url)) return 4;
  return 0;
}

export function pickCatalogTargets(homeUrl: string, links: string[], limit: number) {
  const scored = links
    .map((url) => ({ url, score: scoreProductUrl(url) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
  const picked: string[] = [];
  const seen = new Set<string>();
  for (const item of scored) {
    if (seen.has(item.url) || picked.length >= limit) continue;
    seen.add(item.url);
    picked.push(item.url);
  }
  if (!seen.has(homeUrl) && picked.length < limit) picked.unshift(homeUrl);
  return picked.slice(0, limit);
}

function sitemapLocs(xml: string, home: string) {
  const origin = new URL(home).origin;
  const found: string[] = [];
  for (const match of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    const url = publicHttpUrl(match[1].trim());
    if (!url) continue;
    try {
      if (new URL(url).origin !== origin) continue;
    } catch {
      continue;
    }
    if (scoreProductUrl(url) < 0) continue;
    found.push(url);
  }
  return found;
}

async function fetchText(url: string, timeoutMs = 8_000) {
  const response = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml,application/xml", "User-Agent": "PostyBot/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) return null;
  return (await response.text()).slice(0, 500_000);
}

function looksLikeProduct(input: { url: string; title: string; imageUrl: string | null; price: string | null }) {
  if (SKIP_HINT.test(input.url)) return false;
  if (input.price || input.imageUrl) return true;
  return PRODUCT_HINT.test(`${input.url} ${input.title}`);
}

export async function discoverCatalogProducts(rawUrl: string, limit = MAX_CATALOG_POSTS) {
  const home = publicHttpUrl(rawUrl);
  if (!home) throw new Error("invalid_url");
  const homeHtml = await fetchText(home);
  if (!homeHtml) throw new Error("site_unreachable");
  const fromPage = extractSameOriginLinks(homeHtml, home);
  let fromSitemap: string[] = [];
  try {
    const xml = await fetchText(new URL("/sitemap.xml", home).toString(), 6_000);
    if (xml && xml.includes("<loc>")) fromSitemap = sitemapLocs(xml, home);
  } catch {
    fromSitemap = [];
  }
  const want = Math.min(MAX_CATALOG_POSTS, Math.max(2, limit));
  const targets = pickCatalogTargets(home, [...fromSitemap, ...fromPage], Math.min(40, want + 10));
  const products: CatalogProduct[] = [];
  const seen = new Set<string>();
  const queue = targets.filter((url) => url !== home);
  for (let index = 0; index < queue.length && products.length < want; index += 5) {
    const batch = queue.slice(index, index + 5);
    const pages = await Promise.all(
      batch.map(async (url) => {
        const html = await fetchText(url);
        return html ? { url, html } : null;
      }),
    );
    for (const page of pages) {
      if (!page || products.length >= want) continue;
      const brief = parseSiteHtml(page.html, page.url);
      if (!looksLikeProduct(brief)) continue;
      const key = brief.url.replace(/\/$/, "");
      if (seen.has(key)) continue;
      seen.add(key);
      products.push({
        name: (brief.title || brief.url).slice(0, 120),
        url: brief.url,
        imageUrl: brief.imageUrl,
        price: brief.price,
        description: (brief.description || "").slice(0, 240),
      });
    }
  }
  if (products.length === 0) {
    const brief = parseSiteHtml(homeHtml, home);
    products.push({
      name: (brief.title || home).slice(0, 120),
      url: home,
      imageUrl: brief.imageUrl,
      price: brief.price,
      description: (brief.description || "").slice(0, 240),
    });
  }
  return { home, products: products.slice(0, want) };
}
