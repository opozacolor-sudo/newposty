import { getFalKey } from "@/lib/env";

export type FalImageSize = "portrait_4_3" | "square_hd" | "landscape_4_3";

/** Flux.2 [dev]: ~$0.012/MP. Edit bills input+output (~$0.024 with one reference). */
export const FAL_TEXT_MODEL = "fal-ai/flux-2";
export const FAL_EDIT_MODEL = "fal-ai/flux-2/edit";

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

function falDetail(payload: unknown) {
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

function classifyFalError(status: number, detail: string) {
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

export function pickFalImageModel(hasReferences: boolean) {
  return hasReferences ? FAL_EDIT_MODEL : FAL_TEXT_MODEL;
}

async function runFalImage(input: {
  prompt: string;
  imageUrls: string[];
  imageSize: FalImageSize;
}) {
  const key = getFalKey();
  const model = pickFalImageModel(input.imageUrls.length > 0);
  const body: Record<string, unknown> = {
    prompt: input.prompt,
    image_size: input.imageSize,
    output_format: "jpeg",
    enable_safety_checker: true,
    num_images: 1,
  };
  if (input.imageUrls.length > 0) body.image_urls = input.imageUrls;

  const response = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
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
  const refs = (input.imageUrls ?? []).filter((url) => url.startsWith("http")).slice(0, 4);
  const imageSize = input.imageSize ?? "portrait_4_3";
  try {
    return await runFalImage({ prompt: input.prompt, imageUrls: refs, imageSize });
  } catch (error) {
    if (error instanceof FalImageError && error.code !== "failed") throw error;
    if (refs.length === 0) throw error;
    console.error("[poster] edit failed, retrying text-only");
    return runFalImage({ prompt: input.prompt, imageUrls: [], imageSize });
  }
}
