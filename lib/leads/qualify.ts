import { getSiteUrl } from "@/lib/env";
import { agentCopy, topicLabel } from "@/lib/leads/copy";
import {
  parseConsent,
  parseContact,
  parseMoneyAndMonths,
  parsePurchaseMethod,
  qualifyAutoCredit,
  type LeadPlaybook,
} from "@/lib/leads/playbook";
import type { LeadStage, LeadThread, LeadTranscriptItem } from "@/lib/leads/types";

function localeFromText(text: string): "ro" | "en" {
  return /[ăâîșț]|dumneavoastra|dumneavoastră|pret|preț|valabil/i.test(text) ? "ro" : /[a-z]/i.test(text) && !/[ăâîșț]/i.test(text) ? "en" : "ro";
}

function push(thread: LeadThread, role: LeadTranscriptItem["role"], text: string) {
  thread.transcript = [...thread.transcript, { role, text, at: new Date().toISOString() }];
}

export function nextAgentReply(input: {
  thread: LeadThread;
  inbound: string;
  playbook: LeadPlaybook;
}): { thread: LeadThread; reply: string | null } {
  const thread = { ...input.thread, answers: { ...input.thread.answers } };
  const inbound = input.inbound.trim();
  if (!inbound) return { thread, reply: null };
  push(thread, "user", inbound);
  const locale = localeFromText(thread.trigger_text || inbound);
  const copy = agentCopy(locale);
  const termsUrl = `${getSiteUrl()}/privacy`;
  const topic = topicLabel({
    triggerText: thread.trigger_text,
    postContext: thread.post_context,
    productName: input.playbook.product_name,
  });

  const send = (stage: LeadStage, text: string) => {
    thread.stage = stage;
    push(thread, "agent", text);
    return { thread, reply: text };
  };

  if (thread.stage === "invited") {
    return send("await_consent", copy.intro(topic, termsUrl));
  }

  if (thread.stage === "await_consent") {
    const ok = parseConsent(inbound);
    if (ok === false && /\b(nu|no)\b/i.test(inbound)) {
      return send("dismissed", copy.needConsent);
    }
    if (!ok) return send("await_consent", copy.needConsent);
    return send("ask_method", copy.askMethod);
  }

  if (thread.stage === "ask_method") {
    const method = parsePurchaseMethod(inbound);
    if (!method) return send("ask_method", copy.askMethod);
    thread.answers.method = method;
    if (method === "cash") return send("ask_contact", copy.cashNext);
    return send("ask_income", copy.askIncome);
  }

  if (thread.stage === "ask_income") {
    const parsed = parseMoneyAndMonths(inbound);
    if (!parsed.salary) return send("ask_income", copy.askIncome);
    thread.answers.salary = parsed.salary;
    thread.answers.tenureMonths = parsed.tenureMonths;
    const result = qualifyAutoCredit({
      playbook: input.playbook,
      salary: parsed.salary,
      tenureMonths: parsed.tenureMonths,
    });
    thread.answers.eligible = result.eligible ?? null;
    thread.answers.maxPrice = result.maxPrice ?? null;
    return send("ask_contact", copy.eligible(result, input.playbook));
  }

  if (thread.stage === "ask_contact") {
    const contact = parseContact(inbound);
    if (!contact.phone && !contact.email) return send("ask_contact", copy.needContact);
    thread.answers.fullName = contact.fullName ?? thread.answers.fullName ?? thread.author_name;
    thread.answers.phone = contact.phone;
    thread.answers.email = contact.email;
    return send("qualified", copy.done);
  }

  return { thread, reply: null };
}
