import { parseSiteHtml, publicHttpUrl } from "@/lib/site-brief";

export type KnowledgePage = {
  url: string;
  title: string;
  excerpt: string;
  price: string | null;
};

export type KnowledgeProduct = {
  name: string;
  price?: string | null;
  url?: string | null;
  howTo?: string | null;
  notes?: string | null;
};

export type AgentKnowledge = {
  business?: string | null;
  vertical?: string | null;
  summary?: string | null;
  products?: KnowledgeProduct[];
  booking?: { available?: boolean; how?: string | null; url?: string | null };
  faqs?: Array<{ q: string; a: string }>;
  pages?: KnowledgePage[];
};

export type LeadAgent = {
  id: string;
  user_id: string;
  client_id: string | null;
  site_url: string | null;
  knowledge: AgentKnowledge;
  trained_at: string | null;
  enabled: boolean;
  addon_status: "unsubscribed" | "active" | "canceled";
};

const INTERESTING =
  /pret|preț|price|shop|produs|product|servic|menu|meniu|rezerv|book|about|despre|contact|apply|aplic|faq|oferta|ofert|program|oras|programari|creme|ungh/i;

export function canEnableLeadAgent(agent: Pick<LeadAgent, "trained_at"> | null | undefined) {
  return Boolean(agent?.trained_at);
}

export function htmlToExcerpt(html: string, max = 1600) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function extractSameOriginLinks(html: string, pageUrl: string) {
  const origin = new URL(pageUrl);
  const found = new Set<string>();
  for (const match of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    try {
      const next = new URL(match[1], pageUrl);
      if (next.protocol !== "http:" && next.protocol !== "https:") continue;
      if (next.hostname !== origin.hostname) continue;
      next.hash = "";
      const clean = publicHttpUrl(next.toString());
      if (clean) found.add(clean);
    } catch {
      /* skip */
    }
  }
  return [...found];
}

export function pickCrawlTargets(homeUrl: string, links: string[], limit = 7) {
  const scored = links
    .map((url) => ({
      url,
      score: INTERESTING.test(url) ? 2 : 0,
    }))
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));
  const picked: string[] = [];
  const seen = new Set<string>();
  for (const item of [homeUrl, ...scored.map((row) => row.url)]) {
    if (seen.has(item) || picked.length >= limit) continue;
    seen.add(item);
    picked.push(item);
  }
  return picked;
}

export function pageFromHtml(html: string, url: string): KnowledgePage {
  const brief = parseSiteHtml(html, url);
  return {
    url,
    title: brief.title,
    excerpt: htmlToExcerpt(html),
    price: brief.price,
  };
}

export function matchKnowledgePage(knowledge: AgentKnowledge, question: string) {
  const hay = `${question} ${(knowledge.summary || "")}`.toLocaleLowerCase("ro");
  const pages = [...(knowledge.products ?? []).map((item) => ({
    url: item.url || "",
    title: item.name,
    excerpt: `${item.howTo || ""} ${item.notes || ""} ${item.price || ""}`,
    price: item.price ?? null,
  })), ...(knowledge.pages ?? [])].filter((page) => page.url);
  if (pages.length === 0) return null;
  const words = hay.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 3);
  let best = pages[0];
  let bestScore = -1;
  for (const page of pages) {
    const text = `${page.url} ${page.title} ${page.excerpt}`.toLocaleLowerCase("ro");
    const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
    if (score > bestScore) {
      best = page;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : pages[0];
}
