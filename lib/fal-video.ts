import { getFalKey } from "@/lib/env";
import { FalImageError, classifyFalError, falDetail } from "@/lib/fal-image";

/** Fixed cheap preset: 480p, 5 seconds. ~$0.08–0.13 / clip. */
export const VIDEO_RESOLUTION = "480P";
export const VIDEO_DURATION_SEC = 5;
export const FAL_TEXT_VIDEO_MODEL = "minimax/h3-max-turbo/text-to-video";
export const FAL_IMAGE_VIDEO_MODEL = "minimax/h3-max-turbo/image-to-video";

const POLL_MS = 2_000;
const MAX_WAIT_MS = 95_000;

function firstVideoUrl(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const video = (body as { video?: { url?: string } }).video;
  const url = video?.url;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

export function pickFalVideoModel(hasImage: boolean) {
  return hasImage ? FAL_IMAGE_VIDEO_MODEL : FAL_TEXT_VIDEO_MODEL;
}

function falHeaders(key: string) {
  return {
    Authorization: `Key ${key}`,
    "Content-Type": "application/json",
  };
}

async function falJson(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, signal: init.signal ?? AbortSignal.timeout(30_000) });
  const payload = (await response.json().catch(() => null)) as unknown;
  return { response, payload };
}

async function waitForFalVideo(model: string, requestId: string, key: string) {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    const { response, payload } = await falJson(`https://queue.fal.run/${model}/requests/${requestId}/status`, {
      headers: falHeaders(key),
    });
    const status =
      payload && typeof payload === "object" && "status" in payload
        ? String((payload as { status: unknown }).status)
        : "";
    if (!response.ok && response.status !== 404) {
      const detail = falDetail(payload);
      throw new FalImageError(classifyFalError(response.status, detail), detail || `Video status failed (${response.status})`);
    }
    if (status === "FAILED") {
      throw new FalImageError("failed", falDetail(payload) || "Video generation failed.");
    }
    if (status === "COMPLETED") {
      const result = await falJson(`https://queue.fal.run/${model}/requests/${requestId}`, {
        headers: falHeaders(key),
      });
      if (!result.response.ok) {
        const detail = falDetail(result.payload);
        throw new FalImageError(classifyFalError(result.response.status, detail), detail || "Video result failed.");
      }
      const url = firstVideoUrl(result.payload);
      if (!url) throw new FalImageError("failed", "Video generation returned no file.");
      return url;
    }
  }
  throw new FalImageError("failed", "Video generation timed out.");
}

export async function generateFalVideo(input: {
  prompt: string;
  imageUrl?: string;
}) {
  const key = getFalKey();
  const imageUrl = input.imageUrl?.startsWith("http") ? input.imageUrl : "";
  const model = pickFalVideoModel(Boolean(imageUrl));
  const body: Record<string, unknown> = {
    prompt: input.prompt,
    duration: VIDEO_DURATION_SEC,
    resolution: VIDEO_RESOLUTION,
    enable_safety_checker: true,
    prompt_expansion_mode: "disabled",
  };
  if (imageUrl) body.image_url = imageUrl;
  else body.aspect_ratio = "9:16";

  const { response, payload } = await falJson(`https://queue.fal.run/${model}`, {
    method: "POST",
    headers: falHeaders(key),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const detail = falDetail(payload);
  if (!response.ok) {
    console.error(`[video] fal ${model} ${response.status}${detail ? `: ${detail}` : ""}`);
    throw new FalImageError(classifyFalError(response.status, detail), detail || `Video generation failed (${response.status})`);
  }
  const immediate = firstVideoUrl(payload);
  if (immediate) return immediate;
  const requestId =
    payload && typeof payload === "object" && "request_id" in payload
      ? String((payload as { request_id: unknown }).request_id)
      : "";
  if (!requestId) {
    console.error("[video] fal returned no request_id");
    throw new FalImageError("failed", "Video generation returned no file.");
  }
  return waitForFalVideo(model, requestId, key);
}
