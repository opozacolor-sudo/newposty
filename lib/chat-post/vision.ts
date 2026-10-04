import type { ImageBlockParam } from "@anthropic-ai/sdk/resources/messages/messages";
import type { ChatMedia } from "@/lib/chat-post/types";

export const CHAT_TURN_PHOTO_LIMIT = 4;
export const CAPTION_PHOTO_LIMIT = 2;
const MAX_BYTES = 8 * 1024 * 1024;
const FETCH_MS = 6_000;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export function photosOnly(media: ChatMedia[]) {
  return media.filter((item) => item.type === "image" && Boolean(item.url));
}

export function selectPhotosForClaude(media: ChatMedia[], limit: number) {
  return photosOnly(media).slice(0, Math.max(0, limit));
}

function mediaTypeOf(contentType: string | null, url: string): "image/jpeg" | "image/png" | "image/gif" | "image/webp" | null {
  const type = (contentType ?? "").split(";")[0]?.trim().toLowerCase();
  if (type && ALLOWED.has(type)) return type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return null;
}

async function photoBlock(url: string): Promise<ImageBlockParam | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_MS) });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_BYTES) return null;
    const mediaType = mediaTypeOf(response.headers.get("content-type"), url);
    if (!mediaType) return null;
    return {
      type: "image",
      source: { type: "base64", media_type: mediaType, data: buffer.toString("base64") },
    };
  } catch {
    return null;
  }
}

export async function photoBlocksForClaude(
  media: ChatMedia[],
  limitOrOptions: number | { limit?: number } = CHAT_TURN_PHOTO_LIMIT,
) {
  const limit = typeof limitOrOptions === "number" ? limitOrOptions : (limitOrOptions.limit ?? CHAT_TURN_PHOTO_LIMIT);
  const photos = selectPhotosForClaude(media, limit);
  const blocks = await Promise.all(photos.map((photo) => photoBlock(photo.url)));
  return blocks.filter((block): block is ImageBlockParam => Boolean(block));
}

export function withPhotos(
  text: string,
  photos: ImageBlockParam[],
): string | Array<ImageBlockParam | { type: "text"; text: string }> {
  if (photos.length === 0) return text;
  return [...photos, { type: "text", text }];
}
