import { looksLikePraiseOnly, textMatchesPhrases } from "@/lib/leads/triggers";

function isOwnInboxMessage(row: { direction?: string; from?: string }) {
  const direction = (row.direction || "").toLowerCase();
  const from = String(row.from || "").toLowerCase();
  if (isExplicitInbound(direction)) return false;
  return /(out|send|agent|page|business)/.test(direction) || /(page|business|self|owner)/.test(from);
}

export function isExplicitInbound(direction?: string | null) {
  return /(^|[^a-z])(in|inbound|incoming|received|user|customer|participant)([^a-z]|$)/.test(
    (direction || "").toLowerCase(),
  );
}

export function looksLikeOwnOutreach(text: string) {
  return /sunt daniel|pre[iî]nregistreaz|agentul posty\.now|sunt agentul posty/i.test(text);
}

export function inboxMessageTime(row: {
  createdTime?: string;
  createdAt?: string;
  sentAt?: string;
}) {
  const value = row.createdTime || row.createdAt || row.sentAt;
  return value ? String(value) : undefined;
}

export function isAfterListenFrom(createdTime: string | undefined, listenFrom: string | null | undefined) {
  if (!listenFrom || !createdTime) return false;
  const created = Date.parse(createdTime);
  const from = Date.parse(listenFrom);
  if (Number.isNaN(created) || Number.isNaN(from)) return false;
  return created >= from;
}

export function isInboundLeadMessage(row: { direction?: string; from?: string; message?: string; text?: string }) {
  const text = String(row.message || row.text || "").trim();
  if (!text || looksLikeOwnOutreach(text)) return false;
  if (isOwnInboxMessage(row)) return false;
  if (isExplicitInbound(row.direction)) return true;
  return false;
}

export function isNewLeadInbound(
  text: string,
  phrases: string[],
  createdTime: string | undefined,
  listenFrom: string | null | undefined,
) {
  if (!isAfterListenFrom(createdTime, listenFrom)) return false;
  if (!text || looksLikeOwnOutreach(text) || looksLikePraiseOnly(text)) return false;
  return textMatchesPhrases(text, phrases);
}
