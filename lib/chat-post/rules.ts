import {
  canonicalizePlatform,
  getPlatformCapability,
  type PlatformCapability,
  ALL_CONNECTED,
} from "@/lib/platform-capabilities";
import type { ChatMedia } from "@/lib/chat-post/types";

export { ALL_CONNECTED };

export function resolvePlatformSelection(input: {
  requested: string[];
  excluded: string[];
  connectedPlatforms: string[];
}) {
  const unknown: string[] = [];
  const excludedIds = input.excluded
    .map((value) => canonicalizePlatform(value))
    .filter((value): value is string => Boolean(value) && value !== ALL_CONNECTED);

  const wantsAll = input.requested.some((value) => canonicalizePlatform(value) === ALL_CONNECTED);
  const explicit = input.requested
    .map((value) => canonicalizePlatform(value))
    .filter((value): value is string => Boolean(value) && value !== ALL_CONNECTED);

  for (const value of input.requested) {
    if (!canonicalizePlatform(value)) unknown.push(value);
  }

  const selected = wantsAll ? [...input.connectedPlatforms] : explicit;
  const platforms = selected.filter((platform) => !excludedIds.includes(platform));

  return {
    wantsAll,
    platforms,
    excludedIds,
    unknown,
  };
}

export function userRequestedCaption(text: string) {
  const lower = text.toLowerCase();
  if (/fără descriere|fara descriere|fără caption|fara caption|no caption|fără text|fara text/.test(lower)) {
    return false;
  }
  if (
    /descriere|caption|hashtag|aceeași descriere|aceeasi descriere|same caption|same description|scrie un text|scrie o descriere/.test(
      lower,
    )
  ) {
    return true;
  }
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1;
}

export function inferMediaKind(media: ChatMedia[]) {
  const hasImage = media.some((item) => item.type === "image");
  const hasVideo = media.some((item) => item.type === "video");
  if (hasVideo && hasImage) return "mixed";
  if (hasVideo) return "video";
  if (hasImage) return "image";
  return "none";
}

const VIDEO_EQUIVALENT_TYPES = new Set([
  "video",
  "reels",
  "reel",
  "stories",
  "story",
  "feed",
  "carousel",
]);

export function normalizeRequestedContentType(requested?: string) {
  const value = requested?.trim().toLowerCase();
  if (!value) return undefined;
  if (value === "reel") return "reels";
  if (value === "story") return "stories";
  return value;
}

/** Map a user/AI content type onto what this platform actually accepts. */
export function adaptContentType(input: {
  platform: string;
  requested?: string;
  mediaKind: ReturnType<typeof inferMediaKind>;
}): { contentType?: string; incompatible: boolean } {
  const capability = getPlatformCapability(input.platform);
  if (!capability) return { incompatible: true };

  const requested = normalizeRequestedContentType(input.requested);
  if (!requested) return { contentType: undefined, incompatible: false };

  const allowed = capability.contentTypes.map((item) => item.toLowerCase());
  if (allowed.includes(requested)) {
    return { contentType: requested, incompatible: false };
  }

  if (VIDEO_EQUIVALENT_TYPES.has(requested) && input.mediaKind === "video") {
    if (allowed.includes("video")) {
      return { contentType: "video", incompatible: false };
    }
    if (requested === "stories" && allowed.includes("stories")) {
      return { contentType: "stories", incompatible: false };
    }
    if (allowed.includes("reels")) {
      return { contentType: "reels", incompatible: false };
    }
  }

  return { contentType: requested, incompatible: true };
}

function perPlatformContentType(contentTypes: Record<string, string> | undefined, platform: string) {
  if (!contentTypes) return undefined;
  for (const [key, value] of Object.entries(contentTypes)) {
    if (canonicalizePlatform(key) === platform) return value;
  }
  return undefined;
}

/**
 * “Instagram reel and TikTok” must not stamp reels onto TikTok.
 * A global content_type only applies to platforms that actually have that format.
 */
export function contentTypeForPlatform(input: {
  platform: string;
  contentType?: string;
  contentTypes?: Record<string, string>;
}) {
  const per = perPlatformContentType(input.contentTypes, input.platform);
  if (per) return per;

  const global = normalizeRequestedContentType(input.contentType);
  if (!global) return undefined;

  const capability = getPlatformCapability(input.platform);
  const allowed = capability?.contentTypes.map((item) => item.toLowerCase()) ?? [];
  if (allowed.includes(global)) return global;
  return undefined;
}

export function validationReason(input: {
  platform: string;
  capability: PlatformCapability | null;
  media: ChatMedia[];
  contentType?: string;
  locale: string;
}): string | null {
  const { capability, media, contentType, locale } = input;
  const ro = locale === "ro";
  if (!capability) {
    return ro
      ? "Platforma nu e disponibilă la postare din chat."
      : "This platform is not available for posting from chat.";
  }

  const kind = inferMediaKind(media);
  if (capability.requiresMedia && kind === "none") {
    return ro
      ? `Această platformă cere material (foto sau video). ${capability.notes ?? ""}`.trim()
      : `This platform requires media (photo or video). ${capability.notes ?? ""}`.trim();
  }

  if (input.platform === "tiktok" && kind !== "video") {
    return ro
      ? "TikTok acceptă doar video, fără imagine sau text."
      : "TikTok only accepts video, not images or text-only posts.";
  }

  if (input.platform === "youtube" && kind !== "video") {
    return ro ? "YouTube acceptă doar video." : "YouTube only accepts video.";
  }

  const adapted = adaptContentType({
    platform: input.platform,
    requested: contentType,
    mediaKind: kind,
  });
  if (contentType && adapted.incompatible) {
    return ro
      ? `Tipul „${contentType}” nu e suportat. Acceptat: ${capability.contentTypes.join(", ")}.`
      : `Content type “${contentType}” is not supported. Allowed: ${capability.contentTypes.join(", ")}.`;
  }

  if (capability.maxAttachments && media.length > capability.maxAttachments) {
    return ro
      ? `Maximum ${capability.maxAttachments} fișiere pe această platformă.`
      : `This platform allows at most ${capability.maxAttachments} files.`;
  }

  if (kind === "mixed" && (input.platform === "twitter" || input.platform === "tiktok")) {
    return ro
      ? "Pe această platformă nu poți amesteca imagini și video în aceeași postare."
      : "This platform cannot mix images and video in the same post.";
  }

  return null;
}

export function truncateCaption(caption: string, maxChars?: number) {
  if (!maxChars || caption.length <= maxChars) {
    return { caption, truncated: false };
  }
  const sliceAt = Math.max(0, maxChars - 1);
  return { caption: `${caption.slice(0, sliceAt).trimEnd()}…`, truncated: true };
}

export function matchScheduledReference<
  T extends {
    id: string;
    platform: string;
    caption: string | null;
    scheduled_at: string | null;
    handle?: string | null;
  },
>(reference: string, candidates: T[]) {
  const needle = reference.trim().toLowerCase();
  if (!needle) return candidates;
  return candidates.filter((item) => {
    const hay = [item.platform, item.caption ?? "", item.handle ?? "", item.scheduled_at ?? ""]
      .join(" ")
      .toLowerCase();
    return needle.split(/\s+/).every((part) => hay.includes(part) || item.platform.includes(part));
  });
}
