const PRIVATE_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|.*\.local)$/i;
const PRIVATE_IP =
  /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;

export function publicHttpUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    const host = url.hostname;
    if (PRIVATE_HOST.test(host) || PRIVATE_IP.test(host)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1]?.trim() ?? "";
}

function metaContent(html: string, key: string) {
  const property = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(property)?.[0];
  return tag ? attr(tag, "content") : "";
}

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export type SiteBrief = {
  url: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: string | null;
};

export function firstPublicUrlInText(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>"'）)]+/i);
  if (!match) return null;
  return publicHttpUrl(match[0].replace(/[.,;:]+$/, ""));
}

function productPrice(html: string) {
  const fromMeta =
    metaContent(html, "product:price:amount") ||
    metaContent(html, "og:price:amount") ||
    metaContent(html, "twitter:data1");
  const currency =
    metaContent(html, "product:price:currency") || metaContent(html, "og:price:currency");
  if (fromMeta) {
    const amount = decode(fromMeta);
    return currency ? `${amount} ${decode(currency)}`.trim() : amount;
  }
  const item = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i)?.[1];
  return item ? decode(item) : null;
}

export function parseSiteHtml(html: string, pageUrl: string): SiteBrief {
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = decode(metaContent(html, "og:title") || titleTag).slice(0, 140);
  const description = decode(
    metaContent(html, "og:description") || metaContent(html, "description"),
  ).slice(0, 280);
  const rawImage = metaContent(html, "og:image") || metaContent(html, "twitter:image");
  let imageUrl: string | null = null;
  if (rawImage) {
    try {
      imageUrl = publicHttpUrl(new URL(rawImage, pageUrl).toString());
    } catch {
      imageUrl = null;
    }
  }
  return { url: pageUrl, title, description, imageUrl, price: productPrice(html) };
}

export async function loadSiteBrief(rawUrl: string, hops = 0): Promise<SiteBrief | null> {
  const url = publicHttpUrl(rawUrl);
  if (!url) return null;
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "PostyBot/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
    });
    if (response.status >= 300 && response.status < 400) {
      const next = publicHttpUrl(response.headers.get("location") ?? "");
      if (!next || hops >= 2) return { url, title: "", description: "", imageUrl: null, price: null };
      return loadSiteBrief(next, hops + 1);
    }
    if (!response.ok) return { url, title: "", description: "", imageUrl: null, price: null };
    const html = (await response.text()).slice(0, 400_000);
    return parseSiteHtml(html, url);
  } catch {
    return { url, title: "", description: "", imageUrl: null, price: null };
  }
}
