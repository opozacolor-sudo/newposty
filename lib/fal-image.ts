import { getFalKey } from "@/lib/env";

export type FalImageSize = "portrait_4_3" | "square_hd" | "landscape_4_3";

/** Nano Banana 2.1 at 1K + medium thinking: ~$0.04 / image. */
export const FAL_TEXT_MODEL = "google/nano-banana-2.1";
export const FAL_EDIT_MODEL = "google/nano-banana-2.1/edit";
export const FAL_IMAGE_RESOLUTION = "1K";
export const FAL_IMAGE_THINKING = "medium";

export function falImageAspectRatio(size: FalImageSize) {
  if (size === "square_hd") return "1:1";
  if (size === "landscape_4_3") return "4:3";
  return "4:5";
}

type FalImage = { url?: string };

export class FalImageError extends Error {
  readonly code: "unauthorized" | "credits" | "failed";
  constructor(code: FalImageError["code"], message: string) {
    super(message);
    this.name = "FalImageError";
    this.code = code;
  }
}

function firstImageUrl(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const images = (body as { images?: FalImage[] }).images;
  const url = images?.[0]?.url;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

export function falDetail(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  const detail = record.detail ?? record.error ?? record.message;
  if (typeof detail === "string") return detail.slice(0, 240);
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) return String((item as { msg: unknown }).msg);
        return "";
      })
      .filter(Boolean)
      .join("; ")
      .slice(0, 240);
  }
  if (detail && typeof detail === "object" && "message" in detail) {
    return String((detail as { message: unknown }).message).slice(0, 240);
  }
  return "";
}

export function classifyFalError(status: number, detail: string) {
  const text = detail.toLowerCase();
  if (status === 401 || status === 403 || text.includes("unauthor") || text.includes("forbidden")) {
    return "unauthorized" as const;
  }
  if (
    status === 402 ||
    text.includes("credit") ||
    text.includes("balance") ||
    text.includes("quota") ||
    text.includes("exhaust")
  ) {
    return "credits" as const;
  }
  return "failed" as const;
}

export function pickFalImageModel(_hasReferences?: boolean) {
  return FAL_TEXT_MODEL;
}

async function runFalImage(input: {
  prompt: string;
  imageSize: FalImageSize;
}) {
  const key = getFalKey();
  const model = pickFalImageModel();
  const body: Record<string, unknown> = {
    prompt: input.prompt,
    aspect_ratio: falImageAspectRatio(input.imageSize),
    resolution: FAL_IMAGE_RESOLUTION,
    thinking_level: FAL_IMAGE_THINKING,
    output_format: "jpeg",
    num_images: 1,
    enable_web_search: false,
  };

  const response = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const payload = (await response.json().catch(() => null)) as unknown;
  const detail = falDetail(payload);
  if (!response.ok) {
    console.error(`[poster] fal ${model} ${response.status}${detail ? `: ${detail}` : ""}`);
    throw new FalImageError(classifyFalError(response.status, detail), detail || `Image generation failed (${response.status})`);
  }
  const url = firstImageUrl(payload);
  if (!url) {
    console.error(`[poster] fal ${model} returned no file`);
    throw new FalImageError("failed", "Image generation returned no file.");
  }
  return url;
}

export async function generateFalImage(input: {
  prompt: string;
  imageUrls?: string[];
  imageSize?: FalImageSize;
}) {
  return runFalImage({
    prompt: input.prompt,
    imageSize: input.imageSize ?? "portrait_4_3",
  });
}
