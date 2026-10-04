import { parseDateOnly } from "@/lib/chat-post/best-time";
import { addCalendarDays, localIsoInZone, ymdInZone, zonedLocalToUtc } from "@/lib/chat-post/timezone";
import type { ChatMedia } from "@/lib/chat-post/types";

export const MAX_CHAT_ATTACHMENTS = 50;
export const MAX_REMIX_POSTS = 100;
export const POSTING_HOUR_CAP = 25;

function compactBrief(text: string) {
  return text
    .toLocaleLowerCase("ro")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "");
}

export function wantsDailySeries(input: {
  cadence?: string | null;
  brief?: string;
  mediaCount: number;
}) {
  if (input.mediaCount < 2) return false;
  if ((input.cadence ?? "").toLowerCase() === "daily") return true;
  const text = (input.brief ?? "").toLowerCase();
  if (
    /c[aâ]te una pe zi|cate una pe zi|una pe zi|one per day|one a day|one each day|every day|in fiecare zi|în fiecare zi|zilnic|pe lun[aă]|for a month|o lun[aă]|campanie|campaign|\bserie\b|starting tomorrow|starting today|începând de mâine|începând de azi|incepand de maine|incepand de azi|aceste materiale|these materials/.test(
      text,
    )
  ) {
    return true;
  }
  return /cateunapezi|unapezi|oneperday|oneaday|oneeachday|everyday|infiecarezi|zilnic|peluna|foramonth|oluna|campanie|campaign|serie|startingtomorrow|startingtoday|incepanddemaine|incepanddeazi|acestemateriale|thesematerials/.test(
    compactBrief(input.brief ?? ""),
  );
}

export function wantsBroadcastSeries(brief?: string) {
  const text = (brief ?? "").toLowerCase();
  return /același pe toate|acelasi pe toate|pe toate la fel|same on all|same everywhere|broadcast/.test(text);
}

export type CrossAssignment = {
  dayIndex: number;
  platform: string;
  mediaId: string;
};

/** One unique file per network per day; files rotate across days so the month stays full. */
export function planCrossAssignments(input: {
  mediaIds: string[];
  platforms: string[];
  accepts: (platform: string, mediaId: string) => boolean;
}): CrossAssignment[] {
  const mediaIds = input.mediaIds.filter(Boolean);
  const platforms = input.platforms.filter(Boolean);
  if (mediaIds.length === 0 || platforms.length === 0) return [];
  const assignments: CrossAssignment[] = [];
  for (let dayIndex = 0; dayIndex < mediaIds.length; dayIndex += 1) {
    const used = new Set<string>();
    for (let platformIndex = 0; platformIndex < platforms.length; platformIndex += 1) {
      const platform = platforms[platformIndex];
      for (let offset = 0; offset < mediaIds.length; offset += 1) {
        const mediaId = mediaIds[(dayIndex + platformIndex + offset) % mediaIds.length];
        if (used.has(mediaId)) continue;
        if (!input.accepts(platform, mediaId)) continue;
        assignments.push({ dayIndex, platform, mediaId });
        used.add(mediaId);
        break;
      }
    }
  }
  return assignments;
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

export function wantsOlderChatMedia(brief?: string) {
  const text = (brief ?? "").toLowerCase();
  return /dinainte|de mai devreme|din spate|și pe celelalte|si pe celelalte|toate pozele din chat|toate fișierele|toate fisierele|earlier (files|photos|ones)|previous (files|photos|ones)|the (other|older) (ones|files|photos)/.test(
    text,
  );
}

export function mediaForThisTurn(input: {
  refs?: string[];
  all: ChatMedia[];
  thisMessage: ChatMedia[];
  brief?: string;
}) {
  const ordered = orderedMedia(input.refs, input.all);
  if (input.thisMessage.length === 0 || wantsOlderChatMedia(input.brief)) {
    return ordered;
  }
  const allowed = new Set(input.thisMessage.map((item) => item.id));
  const scoped = ordered.filter((item) => allowed.has(item.id));
  return scoped.length > 0 ? scoped : input.thisMessage;
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
  const compact = compactBrief(brief);
  const mentionsTomorrow = /mâine|maine|tomorrow/.test(brief) || /maine|tomorrow/.test(compact);
  const mentionsToday =
    /\b(azi|astăzi|astazi|today)\b/.test(brief) || /deazi|astazi|(?:^|[^a-z])azi(?:[^a-z]|$)|today/.test(compact);
  if (mentionsToday && !mentionsTomorrow) return today;
  return addCalendarDays(today, 1);
}

export function seriesDayYmd(startOn: string, dayIndex: number) {
  return addCalendarDays(startOn, dayIndex);
}

export type RemixPlan = {
  count: number;
  size: number;
  pack: "fill_day" | "daily";
};

export function parseRemixRequest(input: {
  cadence?: string | null;
  brief?: string;
  remix_count?: number | null;
  remix_size?: number | null;
  pack?: string | null;
  photoCount: number;
}): RemixPlan | null {
  const brief = input.brief ?? "";
  const text = brief.toLowerCase();
  const named =
    input.cadence === "remix" ||
    (typeof input.remix_count === "number" && input.remix_count > 1) ||
    (/carusel|carousel/.test(text) &&
      /mix|diferit|combin|c[aâ]te\s*\d|cu\s+c[aâ]te|fiecare postare/.test(text)) ||
    (/\d+\s*(de\s+)?post/.test(text) && /carusel|carousel|mixate|mix/.test(text));
  if (!named || input.photoCount < 2) return null;

  const countMatch = brief.match(/(\d{1,3})\s*(de\s+)?post/i)?.[1];
  const sizeMatch = brief.match(/c[aâ]te\s+(\d{1,2})|cu\s+c[aâ]te\s+(\d{1,2})|(\d{1,2})\s+poze/i);
  const count = Math.min(
    MAX_REMIX_POSTS,
    Math.max(2, Number(input.remix_count || countMatch || 0) || 10),
  );
  const size = Math.min(10, Math.max(2, Number(input.remix_size || sizeMatch?.[1] || sizeMatch?.[2] || sizeMatch?.[3] || 5)));
  const pack: RemixPlan["pack"] =
    input.pack === "daily" || /c[aâ]te una pe zi|una pe zi|one per day|pe zile/.test(text)
      ? "daily"
      : "fill_day";
  return { count, size, pack };
}

function shuffleIds(ids: string[], seed: number) {
  const order = [...ids];
  let state = (seed + 1) >>> 0;
  for (let i = order.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function planRemixSets(ids: string[], size: number, count: number) {
  const pool = ids.filter(Boolean);
  const want = Math.min(MAX_REMIX_POSTS, Math.max(0, count));
  if (pool.length < size || want < 1) return [] as string[][];
  const sets: string[][] = [];
  const seenCombo = new Set<string>();
  const seenOrder = new Set<string>();
  for (let phase = 0; phase < 2 && sets.length < want; phase += 1) {
    for (let seed = 0; seed < want * 80 && sets.length < want; seed += 1) {
      const combo = shuffleIds(pool, seed + phase * 10_000).slice(0, size);
      const orderKey = combo.join("|");
      const comboKey = [...combo].sort().join("|");
      if (seenOrder.has(orderKey)) continue;
      if (phase === 0 && seenCombo.has(comboKey)) continue;
      seenOrder.add(orderKey);
      seenCombo.add(comboKey);
      sets.push(combo);
    }
  }
  return sets;
}

export function dailyPostCap(platform: string) {
  if (platform === "instagram" || platform === "facebook") return 100;
  if (platform === "threads") return 250;
  if (platform === "twitter") return 50;
  if (platform === "pinterest") return 25;
  if (platform === "tiktok") return 15;
  return 50;
}

export function calendarDaysBetween(fromYmd: string, toYmd: string) {
  const from = Date.parse(`${fromYmd}T00:00:00Z`);
  const to = Date.parse(`${toYmd}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.round((to - from) / 86_400_000);
}

export function nextPackedSlot(input: {
  platform: string;
  used: Map<string, number>;
  cursor: Date;
  timeZone: string;
  pack: "fill_day" | "daily";
  postIndex: number;
  startOn: string;
}) {
  let at = input.cursor;
  if (input.pack === "daily") {
    const day = seriesDayYmd(input.startOn, input.postIndex);
    const clock = localIsoInZone(input.cursor, input.timeZone).slice(11, 19);
    at = zonedLocalToUtc(`${day}T${clock}`, input.timeZone) ?? input.cursor;
  }
  for (let guard = 0; guard < 800; guard += 1) {
    const local = localIsoInZone(at, input.timeZone);
    const dayKey = `${input.platform}:${local.slice(0, 10)}`;
    const hourKey = `${input.platform}:${local.slice(0, 13)}`;
    const dayCount = input.used.get(dayKey) ?? 0;
    const hourCount = input.used.get(hourKey) ?? 0;
    if (dayCount < dailyPostCap(input.platform) && hourCount < POSTING_HOUR_CAP) {
      input.used.set(dayKey, dayCount + 1);
      input.used.set(hourKey, hourCount + 1);
      return at;
    }
    if (hourCount >= POSTING_HOUR_CAP) {
      at = new Date(at.getTime() + 60 * 60 * 1000);
      continue;
    }
    const nextDay = addCalendarDays(local.slice(0, 10), 1);
    at =
      zonedLocalToUtc(`${nextDay}T${local.slice(11, 19)}`, input.timeZone) ??
      new Date(at.getTime() + 24 * 60 * 60 * 1000);
  }
  return at;
}
