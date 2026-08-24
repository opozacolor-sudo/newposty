import { parseDateOnly } from "@/lib/chat-post/best-time";
import { addCalendarDays, ymdInZone } from "@/lib/chat-post/timezone";
import type { ChatMedia } from "@/lib/chat-post/types";

export const MAX_CHAT_ATTACHMENTS = 30;

export function wantsDailySeries(input: {
  cadence?: string | null;
  brief?: string;
  mediaCount: number;
}) {
  if (input.mediaCount < 2) return false;
  if ((input.cadence ?? "").toLowerCase() === "daily") return true;
  const text = (input.brief ?? "").toLowerCase();
  return /c[aâ]te una pe zi|cate una pe zi|una pe zi|one per day|one a day|one each day|every day|in fiecare zi|în fiecare zi|zilnic|pe lun[aă]|for a month|o lun[aă]|campanie|campaign|\bserie\b|starting tomorrow|începând de mâine|incepand de maine/.test(
    text,
  );
}

export function orderedMedia(refs: string[] | undefined, all: ChatMedia[]) {
  if (!refs || refs.length === 0) return all;
  const byId = new Map(all.map((item) => [item.id, item]));
  const ordered: ChatMedia[] = [];
  for (const id of refs) {
    const item = byId.get(id);
    if (item) ordered.push(item);
  }
  return ordered;
}

export function inferSeriesStartYmd(input: {
  brief?: string;
  scheduled_on?: string;
  scheduled_at_iso?: string;
  timeZone: string;
  now?: Date;
}) {
  const named = parseDateOnly(input.scheduled_on) ?? parseDateOnly(input.scheduled_at_iso);
  if (named) return named;
  const now = input.now ?? new Date();
  const today = ymdInZone(now, input.timeZone);
  const brief = (input.brief ?? "").toLowerCase();
  const mentionsTomorrow = /mâine|maine|tomorrow/.test(brief);
  const mentionsToday = /\b(azi|astăzi|astazi|today)\b/.test(brief);
  if (mentionsToday && !mentionsTomorrow) return today;
  return addCalendarDays(today, 1);
}

export function seriesDayYmd(startOn: string, dayIndex: number) {
  return addCalendarDays(startOn, dayIndex);
}
