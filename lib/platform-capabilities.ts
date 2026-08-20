export const PLATFORM_ALIASES: Record<string, string[]> = {
  instagram: ["insta", "ig", "instagram"],
  facebook: ["fb", "facebook", "pagina de facebook"],
  tiktok: ["tiktok", "tik tok", "tt"],
  youtube: ["youtube", "yt"],
  linkedin: ["linkedin", "li"],
  twitter: ["x", "twitter"],
  threads: ["threads"],
  bluesky: ["bluesky", "blue sky"],
  pinterest: ["pinterest", "pin"],
  reddit: ["reddit"],
  googlebusiness: ["google business", "google my business", "gmb", "google_business"],
  snapchat: ["snapchat", "snap"],
  telegram: ["telegram"],
  discord: ["discord"],
  whatsapp: ["whatsapp", "wa"],
};

export type PlatformCapability = {
  contentTypes: string[];
  requiresMedia: boolean;
  maxCaptionChars?: number;
  maxVideoSeconds?: number;
  maxImageMB?: number;
  maxAttachments?: number;
  notes?: string;
};

export const PLATFORM_CAPABILITIES: Record<string, PlatformCapability> = {
  instagram: {
    contentTypes: ["feed", "stories", "reels", "carousel"],
    requiresMedia: true,
    maxCaptionChars: 2200,
    maxImageMB: 8,
    maxVideoSeconds: 3600,
    maxAttachments: 10,
    notes: "Media obligatorie. Stories fără caption vizibil, max 60s. Reels max 90s.",
  },
  facebook: {
    contentTypes: ["text", "image", "video", "reels", "stories"],
    requiresMedia: false,
    maxCaptionChars: 63206,
    maxImageMB: 4,
    maxVideoSeconds: 14400,
    notes: "Stories fără caption vizibil, max 120s; doar Pages",
  },
  tiktok: {
    contentTypes: ["video"],
    requiresMedia: true,
    maxCaptionChars: 2200,
    maxVideoSeconds: 600,
    notes: "doar video, fără imagine/text-only",
  },
  youtube: {
    contentTypes: ["video"],
    requiresMedia: true,
    maxCaptionChars: 5000,
    maxVideoSeconds: 43200,
    notes: "doar video",
  },
  linkedin: {
    contentTypes: ["text", "image", "video", "document"],
    requiresMedia: false,
    maxCaptionChars: 3000,
    maxImageMB: 10,
    maxAttachments: 20,
  },
  twitter: {
    contentTypes: ["text", "image", "video"],
    requiresMedia: false,
    maxCaptionChars: 280,
    maxImageMB: 5,
    maxVideoSeconds: 140,
    maxAttachments: 4,
    notes: "Imagini și video nu se combină",
  },
  threads: {
    contentTypes: ["text", "image", "video"],
    requiresMedia: false,
    maxCaptionChars: 500,
    maxAttachments: 10,
  },
  bluesky: {
    contentTypes: ["text", "image", "video"],
    requiresMedia: false,
    maxCaptionChars: 300,
    maxImageMB: 1,
    maxVideoSeconds: 60,
    maxAttachments: 4,
  },
  pinterest: {
    contentTypes: ["image", "video"],
    requiresMedia: true,
    maxCaptionChars: 500,
    maxAttachments: 1,
    notes: "Un pin = o imagine sau un video",
  },
  reddit: {
    contentTypes: ["text", "image", "video", "link"],
    requiresMedia: false,
    maxCaptionChars: 40000,
  },
  googlebusiness: {
    contentTypes: ["text", "image"],
    requiresMedia: false,
    maxCaptionChars: 1500,
    maxAttachments: 1,
  },
  snapchat: {
    contentTypes: ["image", "video"],
    requiresMedia: true,
    maxCaptionChars: 160,
    maxAttachments: 1,
  },
  telegram: {
    contentTypes: ["text", "image", "video"],
    requiresMedia: false,
    maxCaptionChars: 4096,
  },
  discord: {
    contentTypes: ["text", "embed", "poll"],
    requiresMedia: false,
    maxCaptionChars: 2000,
    maxAttachments: 10,
    notes: "fișiere max 25MB, max 10 embeds/mesaj, polls nu se combină cu media",
  },
  whatsapp: {
    contentTypes: ["text", "image", "video"],
    requiresMedia: false,
    maxCaptionChars: 1024,
  },
};

export const CANONICAL_PLATFORM_IDS = Object.keys(PLATFORM_ALIASES);
export const ALL_CONNECTED = "__all_connected__";

export function canonicalizePlatform(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  if (trimmed === ALL_CONNECTED) return ALL_CONNECTED;
  const needle = trimmed.replace(/[_-]+/g, " ").trim();

  for (const [id, aliases] of Object.entries(PLATFORM_ALIASES)) {
    const names = [id.replace(/[_-]+/g, " "), ...aliases.map((alias) => alias.toLowerCase())];
    if (names.includes(needle) || names.includes(raw.trim().toLowerCase())) return id;
  }
  return null;
}

export function canonicalizePlatforms(values: string[]): {
  platforms: string[];
  unknown: string[];
} {
  const platforms: string[] = [];
  const unknown: string[] = [];
  for (const value of values) {
    const id = canonicalizePlatform(value);
    if (!id) {
      unknown.push(value);
      continue;
    }
    if (!platforms.includes(id)) platforms.push(id);
  }
  return { platforms, unknown };
}

export function getPlatformCapability(platform: string) {
  return PLATFORM_CAPABILITIES[platform] ?? null;
}
