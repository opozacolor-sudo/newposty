import type { ImageBlockParam } from "@anthropic-ai/sdk/resources/messages/messages";
import type { ChatMedia } from "@/lib/chat-post/types";

const MAX_PHOTOS = 20;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export function photosOnly(media: ChatMedia[]) {
  return media.filter((item) => item.type === "image" && Boolean(item.url));
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
    const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
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

export async function photoBlocksForClaude(media: ChatMedia[]) {
  const photos = photosOnly(media).slice(0, MAX_PHOTOS);
  const blocks: ImageBlockParam[] = [];
  for (const photo of photos) {
    const block = await photoBlock(photo.url);
    if (block) blocks.push(block);
  }
  return blocks;
}

export function withPhotos(
  text: string,
  photos: ImageBlockParam[],
): string | Array<ImageBlockParam | { type: "text"; text: string }> {
  if (photos.length === 0) return text;
  return [...photos, { type: "text", text }];
}
