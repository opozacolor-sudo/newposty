import { getFalKey } from "@/lib/env";
import { FalImageError, classifyFalError, falDetail } from "@/lib/fal-image";

/** 480p × 5s text-to-video. Promo until 15 Oct 2026: ~$0.075. Then ~$0.125. */
export const VIDEO_RESOLUTION = "480P";
export const VIDEO_DURATION_SEC = 5;
export const FAL_TEXT_VIDEO_MODEL = "minimax/h3-max-turbo/text-to-video";
export const FAL_IMAGE_VIDEO_MODEL = "minimax/h3-max-turbo/image-to-video";

const POLL_MS = 2_500;
const MAX_WAIT_MS = 270_000;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function firstVideoUrl(body: unknown): string | null {
  const record = asRecord(body);
  if (!record) return null;
  const nested = [record.video, asRecord(record.data)?.video, asRecord(record.output)?.video];
  for (const video of nested) {
    if (typeof video === "string" && video.startsWith("http")) return video;
    const url = asRecord(video)?.url;
    if (typeof url === "string" && url.startsWith("http")) return url;
  }
  if (typeof record.video_url === "string" && record.video_url.startsWith("http")) return record.video_url;
  return null;
}

export function falRequestId(body: unknown): string {
  const record = asRecord(body);
  if (!record) return "";
  for (const key of ["request_id", "requestId", "id"] as const) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export type FalVideoPending = {
  requestId: string;
  statusUrl: string;
  resultUrl: string;
  userId?: string;
  locale?: string;
  siteUrl?: string | null;
};

export function parseVideoJob(value: unknown): FalVideoPending | null {
  const record = asRecord(value);
  if (!record) return null;
  const requestId = falRequestId(record);
  const statusUrl = typeof record.statusUrl === "string" ? record.statusUrl : typeof record.status_url === "string" ? record.status_url : "";
  const resultUrl = typeof record.resultUrl === "string" ? record.resultUrl : typeof record.response_url === "string" ? record.response_url : "";
  if (!requestId || !statusUrl || !resultUrl) return null;
  return {
    requestId,
    statusUrl,
    resultUrl,
    userId: typeof record.userId === "string" ? record.userId : undefined,
    locale: typeof record.locale === "string" ? record.locale : undefined,
    siteUrl: typeof record.siteUrl === "string" ? record.siteUrl : null,
  };
}

export function videoRequestBody(prompt: string) {
  return {
    prompt,
    duration: VIDEO_DURATION_SEC,
    resolution: VIDEO_RESOLUTION,
    aspect_ratio: "9:16" as const,
    enable_safety_checker: true,
    prompt_expansion_mode: "disabled" as const,
  };
}

export function pickFalVideoModel(_hasImage?: boolean) {
  return FAL_TEXT_VIDEO_MODEL;
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

async function waitForFalVideo(input: { statusUrl: string; resultUrl: string; key: string }) {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    const { response, payload } = await falJson(input.statusUrl, { headers: falHeaders(input.key) });
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
      const result = await falJson(input.resultUrl, { headers: falHeaders(input.key) });
      if (!result.response.ok) {
        const detail = falDetail(result.payload);
        throw new FalImageError(classifyFalError(result.response.status, detail), detail || "Video result failed.");
      }
      const url = firstVideoUrl(result.payload);
      if (!url) {
        console.error("[video] completed but no url", Object.keys(asRecord(result.payload) ?? {}));
        throw new FalImageError("failed", "Video generation returned no file.");
      }
      return url;
    }
  }
  const late = firstVideoUrl(
    (await falJson(input.resultUrl, { headers: falHeaders(input.key) })).payload,
  );
  if (late) return late;
  throw new FalImageError("pending", "Video generation still running.");
}

export async function harvestFalVideo(pending: FalVideoPending): Promise<string | null> {
  const key = getFalKey();
  const statusRes = await falJson(pending.statusUrl, { headers: falHeaders(key) });
  const status =
    statusRes.payload && typeof statusRes.payload === "object" && "status" in statusRes.payload
      ? String((statusRes.payload as { status: unknown }).status)
      : "";
  if (status === "FAILED") {
    throw new FalImageError("failed", falDetail(statusRes.payload) || "Video generation failed.");
  }
  const result = await falJson(pending.resultUrl, { headers: falHeaders(key) });
  return firstVideoUrl(result.payload);
}

export async function submitFalVideo(
  prompt: string,
  webhookUrl?: string,
): Promise<{ url: string } | { pending: FalVideoPending }> {
  const key = getFalKey();
  const model = pickFalVideoModel();
  const body = videoRequestBody(prompt);
  if (body.duration !== 5) {
    throw new FalImageError("failed", "Video duration is locked to 5 seconds.");
  }
  const endpoint = webhookUrl
    ? `https://queue.fal.run/${model}?fal_webhook=${encodeURIComponent(webhookUrl)}`
    : `https://queue.fal.run/${model}`;
  const queued = await falJson(endpoint, {
    method: "POST",
    headers: falHeaders(key),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });

  const detail = falDetail(queued.payload);
  if (!queued.response.ok) {
    console.error(`[video] fal ${model} ${queued.response.status}${detail ? `: ${detail}` : ""}`);
    throw new FalImageError(
      classifyFalError(queued.response.status, detail),
      detail || `Video generation failed (${queued.response.status})`,
    );
  }

  const immediate = firstVideoUrl(queued.payload);
  if (immediate) return { url: immediate };

  const record = asRecord(queued.payload);
  const requestId = falRequestId(queued.payload);
  const statusUrl =
    (typeof record?.status_url === "string" && record.status_url) ||
    (requestId ? `https://queue.fal.run/${model}/requests/${requestId}/status` : "");
  const resultUrl =
    (typeof record?.response_url === "string" && record.response_url) ||
    (requestId ? `https://queue.fal.run/${model}/requests/${requestId}` : "");
  if (!statusUrl || !resultUrl || !requestId) {
    console.error("[video] fal returned no request id", Object.keys(record ?? {}));
    throw new FalImageError("failed", "Video generation returned no file.");
  }
  return { pending: { requestId, statusUrl, resultUrl } };
}

export async function waitFalVideo(pending: FalVideoPending) {
  return waitForFalVideo({
    statusUrl: pending.statusUrl,
    resultUrl: pending.resultUrl,
    key: getFalKey(),
  });
}

export async function generateFalVideo(input: {
  prompt: string;
  imageUrl?: string;
  resume?: FalVideoPending | null;
}) {
  if (input.resume) return waitFalVideo(input.resume);
  const started = await submitFalVideo(input.prompt);
  if ("url" in started) return started.url;
  return waitFalVideo(started.pending);
}
