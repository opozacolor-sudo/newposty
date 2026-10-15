import { SIGNUPS_OPEN } from "@/lib/flags";
import { getGuide } from "@/lib/guide-content";
import { pricingCopy } from "@/lib/pricing-copy";

const KEEP = new Set([
  "start",
  "accounts-posts",
  "accounts-ads",
  "assistant",
  "confirm",
  "campaign",
  "leads",
  "troubleshoot",
]);

export function helpKnowledge(locale: string) {
  const guide = getGuide(locale);
  const sections = guide.sections
    .filter((section) => KEEP.has(section.id))
    .map((section) => {
      const tips = (section.tips ?? []).map((tip) => `${tip.title}: ${tip.body}`).join(" ");
      return [`## ${section.title}`, section.lead ?? "", section.body.join(" "), tips].filter(Boolean).join("\n");
    });
  const pricing = pricingCopy(locale);
  const plans = pricing.plans.map((plan) => `${plan.name}: ${plan.tag}. ${plan.gain}`).join("\n");
  const faqs = pricing.faqs.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n");
  const signups = SIGNUPS_OPEN
    ? "Public signup is open."
    : "Public signup stays on the waitlist. An unpublished invite page can open a free studio until 15 November 2026, with 15 photos and 15 videos. Paid plans are shown from 1 November.";
  return [
    ...sections,
    "## Pricing",
    pricing.vat,
    plans,
    faqs,
    signups,
    "Paid ads start only after the user presses the black Start the ad button in the studio assistant. This help window never publishes or spends.",
  ]
    .join("\n\n")
    .slice(0, 14000);
}
