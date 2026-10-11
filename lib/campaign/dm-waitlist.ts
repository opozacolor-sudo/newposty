import { localeFromLeadText } from "@/lib/leads/locale";
import { isAppLocale, type AppLocale } from "@/lib/locales";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { sendConversationMessage } from "@/lib/zernio";

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

const THANKS: Record<AppLocale, (email: string) => string> = {
  ro: (email) => `Te-am pus pe listă. Pe 15 octombrie îți scriem pe ${email}.`,
  en: (email) => `You're on the list. On 15 October we'll write to ${email}.`,
  de: (email) => `Du stehst auf der Liste. Am 15. Oktober schreiben wir an ${email}.`,
  it: (email) => `Sei in lista. Il 15 ottobre ti scriviamo a ${email}.`,
  fr: (email) => `Vous êtes sur la liste. Le 15 octobre, on écrit à ${email}.`,
  es: (email) => `Estás en la lista. El 15 de octubre te escribimos a ${email}.`,
};

export function extractSoloEmail(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 160) return null;
  const matches = trimmed.match(new RegExp(EMAIL_RE, "gi"));
  if (!matches || matches.length !== 1) return null;
  const email = matches[0].toLowerCase();
  const leftover = trimmed.replace(matches[0], "").replace(/[\s,;:<>()"']/g, "");
  if (leftover.length > 16) return null;
  return email;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function inboundWaitlistTarget(payload: Record<string, unknown>) {
  if (String(payload.event ?? "") !== "message.received") return null;
  const message = asRecord(payload.message);
  if (!message) return null;
  const direction = String(message.direction ?? "").toLowerCase();
  if (direction && !/(in|inbound|incoming|received)/.test(direction)) return null;
  const platform = String(message.platform ?? "").toLowerCase();
  if (platform && platform !== "instagram") return null;
  const text = String(message.text ?? "").trim();
  const email = extractSoloEmail(text);
  if (!email) return null;
  const conversationId = String(message.conversationId ?? message.conversation_id ?? "").trim();
  const account =
    asRecord(payload.account) ??
    asRecord(message.account);
  const accountId = String(
    account?.accountId ?? account?.id ?? message.accountId ?? "",
  ).trim();
  if (!conversationId || !accountId) return null;
  return {
    email,
    conversationId,
    accountId,
    platform: platform || "instagram",
    locale: localeFromLeadText(text),
    lastInboundAt: String(message.createdTime ?? message.createdAt ?? message.sentAt ?? ""),
  };
}

export async function captureDmWaitlist(payload: Record<string, unknown>) {
  const target = inboundWaitlistTarget(payload);
  if (!target) return false;

  const supabase = createAdminSupabase();
  const { error } = await supabase.rpc("join_presale_waitlist", {
    p_email: target.email,
    p_locale: isAppLocale(target.locale) ? target.locale : "ro",
  });
  if (error) throw error;

  const locale = isAppLocale(target.locale) ? target.locale : "ro";
  await sendConversationMessage(target.conversationId, target.accountId, THANKS[locale](target.email), {
    platform: target.platform,
    lastInboundAt: target.lastInboundAt || new Date().toISOString(),
  });
  return true;
}
