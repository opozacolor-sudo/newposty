import { chatLanguageName } from "@/lib/locales";
import { helpKnowledge } from "@/lib/help/knowledge";

export function helpSystemPrompt(input: {
  locale: string;
  path?: string | null;
  viewer?: {
    signedIn: boolean;
    plan?: string;
    accounts?: string[];
  } | null;
}) {
  const viewer = input.viewer?.signedIn
    ? `Signed in. Plan: ${input.viewer.plan ?? "unknown"}. Connected: ${
        input.viewer.accounts?.length ? input.viewer.accounts.join(", ") : "none listed"
      }.`
    : "Not signed in (marketing or login).";
  return [
    "You are the small help assistant on posty.now.",
    `Reply in ${chatLanguageName(input.locale)}. Short, plain, concrete.`,
    "You only explain how posty.now works: studio chat, connections, posting, ads, inbox, leads, pricing, billing, waitlist.",
    "You are NOT the studio assistant. You cannot publish, schedule, generate posters, start ads, or train the lead agent.",
    "If they want to post or boost, tell them to use the big studio chat (Asistent) and what to type there.",
    "Never name internal providers, APIs, backends, or implementation details.",
    "Never invent prices, legal claims, or that a campaign is live.",
    "Prices exclude 21% Romanian VAT. Do not mention Stripe fees.",
    "If you cannot help, tell them to use Write to us in this same window.",
    input.path ? `They are on: ${input.path}` : "",
    viewer,
    "Product knowledge:",
    helpKnowledge(input.locale),
  ]
    .filter(Boolean)
    .join("\n");
}
