import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "@/lib/env";
import {
  extractSameOriginLinks,
  pageFromHtml,
  pickCrawlTargets,
  type AgentKnowledge,
  type KnowledgePage,
} from "@/lib/leads/knowledge";
import { publicHttpUrl } from "@/lib/site-brief";

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "PostyBot/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return null;
  return (await response.text()).slice(0, 400_000);
}

export async function crawlClientSite(rawUrl: string) {
  const home = publicHttpUrl(rawUrl);
  if (!home) throw new Error("invalid_url");
  const homeHtml = await fetchHtml(home);
  if (!homeHtml) throw new Error("site_unreachable");
  const targets = pickCrawlTargets(home, extractSameOriginLinks(homeHtml, home));
  const pages: KnowledgePage[] = [];
  for (const url of targets) {
    const html = url === home ? homeHtml : await fetchHtml(url);
    if (!html) continue;
    pages.push(pageFromHtml(html, url));
  }
  if (pages.length === 0) throw new Error("site_empty");
  return { home, pages };
}

function knowledgeFromPages(pages: KnowledgePage[], home: string): AgentKnowledge {
  return {
    business: pages[0]?.title || home,
    vertical: "other",
    summary: pages[0]?.excerpt?.slice(0, 400) || null,
    products: pages
      .filter((page) => page.price || /produs|servic|shop|menu|crem|ungh/i.test(`${page.url} ${page.title}`))
      .slice(0, 12)
      .map((page) => ({
        name: page.title || page.url,
        price: page.price,
        url: page.url,
        notes: page.excerpt.slice(0, 220),
      })),
    booking: {
      available: pages.some((page) => /rezerv|book|program/i.test(`${page.url} ${page.title}`)),
      url: pages.find((page) => /rezerv|book|program/i.test(`${page.url} ${page.title}`))?.url ?? null,
    },
    pages,
  };
}

export async function summarizeKnowledge(pages: KnowledgePage[], home: string): Promise<AgentKnowledge> {
  const fallback = knowledgeFromPages(pages, home);
  let apiKey = "";
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return fallback;
  }
  const anthropic = new Anthropic({ apiKey });
  const packed = pages
    .map((page) => `URL: ${page.url}\nTitle: ${page.title}\nPrice: ${page.price || "-"}\n${page.excerpt}`)
    .join("\n---\n")
    .slice(0, 14000);
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      system:
        "You train a per-client sales agent from crawled website pages. Return ONLY JSON: {business, vertical, summary, products:[{name,price,url,howTo,notes}], booking:{available,how,url}, faqs:[{q,a}]}. vertical is nails|cosmetics|restaurant|auto|other. Do not invent prices, products, or booking rules that are not in the pages.",
      messages: [{ role: "user", content: `Site: ${home}\n\n${packed}` }],
    });
    const text = response.content.find((block) => block.type === "text")?.text ?? "";
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return fallback;
    const parsed = JSON.parse(json) as AgentKnowledge;
    return { ...fallback, ...parsed, pages };
  } catch {
    return fallback;
  }
}

export async function trainLeadAgentFromSite(rawUrl: string) {
  const crawled = await crawlClientSite(rawUrl);
  const knowledge = await summarizeKnowledge(crawled.pages, crawled.home);
  return { siteUrl: crawled.home, knowledge };
}
