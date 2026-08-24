import { isFutureDate, localIsoInZone, zonedLocalToUtc } from "@/lib/chat-post/timezone";

/**
 * Ranked peak windows from public 2024–2026 industry reports
 * (Sprout Social, Hootsuite, Later, Buffer). Times are in the user's
 * local timezone as a stand-in for audience local time — not personal analytics.
 */
type Slot = {
  hour: number;
  minute?: number;
  /** 0 = Sunday … 6 = Saturday. Omit = any day. */
  weekdays?: number[];
};

const WEEKDAYS = [1, 2, 3, 4, 5];
const TUE_THU = [2, 3, 4];

const DEFAULT_SLOTS: Slot[] = [
  { hour: 18, weekdays: WEEKDAYS },
  { hour: 18 },
];

const BY_PLATFORM: Record<string, Slot[]> = {
  instagram: [
    { hour: 11, weekdays: TUE_THU },
    { hour: 11, weekdays: WEEKDAYS },
    { hour: 19, weekdays: WEEKDAYS },
    { hour: 12 },
    { hour: 19 },
  ],
  tiktok: [
    { hour: 19, weekdays: TUE_THU },
    { hour: 19, weekdays: WEEKDAYS },
    { hour: 12, weekdays: TUE_THU },
    { hour: 9, weekdays: WEEKDAYS },
    { hour: 19 },
  ],
  facebook: [
    { hour: 13, weekdays: WEEKDAYS },
    { hour: 11, weekdays: TUE_THU },
    { hour: 13 },
  ],
  linkedin: [
    { hour: 10, weekdays: TUE_THU },
    { hour: 9, weekdays: [1, 5] },
  ],
  youtube: [
    { hour: 15, weekdays: [4, 5] },
    { hour: 14, weekdays: WEEKDAYS },
    { hour: 10, weekdays: [6] },
    { hour: 15 },
  ],
  twitter: [
    { hour: 9, weekdays: WEEKDAYS },
    { hour: 12, weekdays: WEEKDAYS },
    { hour: 9 },
  ],
  threads: [
    { hour: 12, weekdays: WEEKDAYS },
    { hour: 19, weekdays: WEEKDAYS },
    { hour: 12 },
  ],
  bluesky: [
    { hour: 9, weekdays: WEEKDAYS },
    { hour: 12, weekdays: WEEKDAYS },
    { hour: 9 },
  ],
  pinterest: [
    { hour: 20, weekdays: [0, 6] },
    { hour: 20, weekdays: WEEKDAYS },
    { hour: 20 },
  ],
  snapchat: [
    { hour: 20, weekdays: WEEKDAYS },
    { hour: 20 },
  ],
  reddit: [
    { hour: 8, weekdays: WEEKDAYS },
    { hour: 10, weekdays: [6] },
    { hour: 8 },
  ],
  googlebusiness: [
    { hour: 11, weekdays: WEEKDAYS },
    { hour: 11 },
  ],
  telegram: [{ hour: 18 }, { hour: 20 }],
  discord: [{ hour: 18 }, { hour: 20 }],
  whatsapp: [{ hour: 18 }, { hour: 20 }],
};

const INSTAGRAM_STORIES: Slot[] = [
  { hour: 12, weekdays: WEEKDAYS },
  { hour: 19, weekdays: WEEKDAYS },
  { hour: 12 },
  { hour: 19 },
];

export function isBestTimeToken(value?: string | null) {
  const raw = (value ?? "").trim().toLowerCase().replace(/[_-]+/g, " ");
  return raw === "best" || raw === "best time" || raw === "besttime";
}

export function wantsBestTime(input: {
  use_best_time?: boolean | string;
  scheduled_at_iso?: string;
  new_value?: string;
}) {
  return (
    input.use_best_time === true ||
    input.use_best_time === "true" ||
    isBestTimeToken(input.scheduled_at_iso) ||
    isBestTimeToken(input.new_value)
  );
}

export function parseDateOnly(value?: string | null) {
  const raw = (value ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  return raw;
}

export function hasClockTime(value?: string | null) {
  const raw = (value ?? "").trim();
  if (!raw || isBestTimeToken(raw) || parseDateOnly(raw)) return false;
  return /T\d{2}:\d{2}/.test(raw) || /[zZ]|[+-]\d{2}:\d{2}$/.test(raw);
}

function slotsFor(platform: string, contentType?: string | null): Slot[] {
  const type = (contentType ?? "").toLowerCase();
  if (platform === "instagram" && (type === "stories" || type === "story")) {
    return INSTAGRAM_STORIES;
  }
  return BY_PLATFORM[platform] ?? DEFAULT_SLOTS;
}

function ymdInZone(date: Date, timeZone: string) {
  return localIsoInZone(date, timeZone).slice(0, 10);
}

function addCalendarDays(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function weekdayFromYmd(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function nextBestTime(input: {
  platform: string;
  contentType?: string | null;
  timeZone: string;
  now?: Date;
  onOrAfterYmd?: string | null;
}): Date | null {
  const now = input.now ?? new Date();
  const startYmd = input.onOrAfterYmd ?? ymdInZone(now, input.timeZone);
  const slots = slotsFor(input.platform, input.contentType);
  for (let offset = 0; offset <= 14; offset += 1) {
    const ymd = addCalendarDays(startYmd, offset);
    const weekday = weekdayFromYmd(ymd);
    for (const slot of slots) {
      if (slot.weekdays && !slot.weekdays.includes(weekday)) continue;
      const hour = String(slot.hour).padStart(2, "0");
      const minute = String(slot.minute ?? 0).padStart(2, "0");
      const utc = zonedLocalToUtc(`${ymd}T${hour}:${minute}:00`, input.timeZone);
      if (utc && isFutureDate(utc, now)) return utc;
    }
  }
  return null;
}

export function bestTimeResearchWarning(locale: string) {
  return locale === "ro"
    ? "Ora e din research pe platforme (când e de obicei cea mai activă audiența), nu din statisticile contului tău."
    : "This time comes from platform research on typical peak hours, not from your account analytics.";
}
