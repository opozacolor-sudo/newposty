import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey, getSiteUrl } from "@/lib/env";
import { wantsBookingLink } from "@/lib/leads/coach";
import {
  htmlToExcerpt,
  matchKnowledgePage,
  publicAgentBrand,
  type AgentKnowledge,
  type KnowledgePage,
} from "@/lib/leads/knowledge";
import { publicHttpUrl } from "@/lib/site-brief";
import type { LeadThread } from "@/lib/leads/types";

export type BrainResult = {
  reply: string;
  productUrl: string | null;
  askContact: boolean;
};

function trackedUrl(threadId: string, target: string) {
  const params = new URLSearchParams({ t: threadId, u: target });
  return `${getSiteUrl()}/api/leads/go?${params.toString()}`;
}

async function livePage(url: string | null): Promise<KnowledgePage | null> {
  const clean = url ? publicHttpUrl(url) : null;
  if (!clean) return null;
  try {
    const response = await fetch(clean, {
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "PostyBot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const html = (await response.text()).slice(0, 250_000);
    return { url: clean, title: "", excerpt: htmlToExcerpt(html, 1200), price: null };
  } catch {
    return null;
  }
}

function fallbackReply(knowledge: AgentKnowledge, inbound: string, locale: "ro" | "en"): BrainResult {
  const page = matchKnowledgePage(knowledge, inbound);
  const product = knowledge.products?.find((item) =>
    inbound.toLocaleLowerCase("ro").includes((item.name || "").toLocaleLowerCase("ro").slice(0, 12)),
  ) ?? knowledge.products?.[0] ?? null;
  const url = wantsBookingLink(inbound)
    ? knowledge.booking?.url || product?.url || page?.url || null
    : product?.url || page?.url || knowledge.booking?.url || null;
  const price = product?.price || page?.price;
  const how = product?.howTo;
  const ro = locale === "ro";
  const parts = [
    knowledge.summary ? knowledge.summary.slice(0, 180) : null,
    price ? (ro ? `Preț: ${price}.` : `Price: ${price}.`) : null,
    how ? (ro ? `Aplicare: ${how}` : `How to use: ${how}`) : null,
    url ? (ro ? `Dacă vrei să cumperi sau să rezervi: ${url}` : `If you want to buy or book: ${url}`) : null,
    ro
      ? "Dacă vrei, lasă numele, telefonul și emailul ca un coleg să te contacteze."
      : "If you want, leave your name, phone, and email so a colleague can contact you.",
  ].filter(Boolean);
  return {
    reply: parts.join(" ").slice(0, 700),
    productUrl: url,
    askContact: /cumpar|cumpăr|rezerv|vreau|buy|book|order/i.test(inbound),
  };
}

export async function answerFromSite(input: {
  thread: LeadThread;
  inbound: string;
  knowledge: AgentKnowledge;
  locale: "ro" | "en";
}): Promise<BrainResult> {
  const matched = matchKnowledgePage(input.knowledge, input.inbound);
  const live = await livePage(matched?.url ?? input.knowledge.pages?.[0]?.url ?? null);
  const fallback = fallbackReply(input.knowledge, input.inbound, input.locale);
  let apiKey = "";
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return withTrackedLink(input.thread.id, fallback);
  }

  const anthropic = new Anthropic({ apiKey });
  const recent = input.thread.transcript.slice(-6).map((item) => `${item.role}: ${item.text}`).join("\n");
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 350,
      system: [
        "You are the posty.now agent, answering a private DM.",
        `Language: ${input.locale === "ro" ? "Romanian" : "English"}.`,
        "Speak as posty.now. Never name the legal company, CUI, or VLN MOTORS.",
        "Follow the owner's freeform instructions exactly. Use trained site knowledge plus those instructions.",
        "If they ask price or whether there is a free slot on a date, do not invent hours. Send the booking/Mero/calendar URL in productUrl.",
        "Never invent prices, stock, or medical claims. Keep reply under 450 characters.",
        "Return ONLY JSON: {reply, productUrl, askContact}.",
      ].join(" "),
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            business: publicAgentBrand({ business: input.knowledge.business }),
            vertical: input.knowledge.vertical,
            summary: input.knowledge.summary,
            products: input.knowledge.products,
            instructions: input.knowledge.instructions,
            booking: input.knowledge.booking,
            faqs: input.knowledge.faqs,
            livePage: live,
            recent,
            inbound: input.inbound,
            trigger: input.thread.trigger_text,
          }),
        },
      ],
    });
    const text = response.content.find((block) => block.type === "text")?.text ?? "";
    const json = text.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return withTrackedLink(input.thread.id, fallback);
    const parsed = JSON.parse(json) as BrainResult;
    return withTrackedLink(input.thread.id, {
      reply: String(parsed.reply || fallback.reply).slice(0, 700),
      productUrl: parsed.productUrl || fallback.productUrl,
      askContact: Boolean(parsed.askContact) || fallback.askContact,
    });
  } catch {
    return withTrackedLink(input.thread.id, fallback);
  }
}

function withTrackedLink(threadId: string, result: BrainResult): BrainResult {
  if (!result.productUrl) return result;
  const clean = publicHttpUrl(result.productUrl);
  if (!clean) return { ...result, productUrl: null };
  const tracked = trackedUrl(threadId, clean);
  return {
    ...result,
    productUrl: clean,
    reply: result.reply.includes(clean) ? result.reply.replaceAll(clean, tracked) : `${result.reply} ${tracked}`,
  };
}
