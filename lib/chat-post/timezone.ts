const DEFAULT_TIMEZONE = "Europe/Bucharest";

export function userTimezone(profileTimezone?: string | null) {
  if (profileTimezone && profileTimezone.trim() && profileTimezone !== "UTC") {
    return profileTimezone;
  }
  return DEFAULT_TIMEZONE;
}

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
}

export function localIsoInZone(date: Date, timeZone: string) {
  const parts = partsInZone(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second ?? "00"}`;
}

export function formatInZone(date: Date, timeZone: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function offsetMs(date: Date, timeZone: string) {
  const local = localIsoInZone(date, timeZone);
  return new Date(`${local}Z`).getTime() - date.getTime();
}

export function zonedLocalToUtc(localIso: string, timeZone: string) {
  const normalized = localIso.length === 16 ? `${localIso}:00` : localIso;
  const naive = new Date(`${normalized.replace("Z", "").slice(0, 19)}Z`);
  if (Number.isNaN(naive.getTime())) return null;
  const utc = new Date(naive.getTime() - offsetMs(naive, timeZone));
  const verify = localIsoInZone(utc, timeZone).slice(0, 16);
  const wanted = normalized.slice(0, 16);
  if (verify !== wanted) {
    const adjusted = new Date(utc.getTime() + (new Date(`${wanted}:00Z`).getTime() - new Date(`${verify}:00Z`).getTime()));
    return adjusted;
  }
  return utc;
}

export function parseScheduledAt(value: string, timeZone: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return zonedLocalToUtc(trimmed, timeZone);
}

export function isFutureDate(date: Date, now = new Date()) {
  return date.getTime() > now.getTime() + 15_000;
}
