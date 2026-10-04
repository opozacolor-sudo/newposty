import { getFalKey } from "@/lib/env";

export type FalImageSize = "portrait_4_3" | "square_hd" | "landscape_4_3";

type FalImage = { url?: string };

function firstImageUrl(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const images = (body as { images?: FalImage[] }).images;
  const url = images?.[0]?.url;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

export async function generateFalImage(input: {
  prompt: string;
  imageUrls?: string[];
  imageSize?: FalImageSize;
}) {
  const key = getFalKey();
  const refs = (input.imageUrls ?? []).filter((url) => url.startsWith("http")).slice(0, 3);
  const model = refs.length > 0 ? "fal-ai/flux-2-pro/edit" : "fal-ai/flux-2-pro";
  const body: Record<string, unknown> = {
    prompt: input.prompt,
    image_size: input.imageSize ?? "portrait_4_3",
    output_format: "jpeg",
    safety_tolerance: "2",
  };
  if (refs.length > 0) body.image_urls = refs;

  const response = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(50_000),
  });
  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : `Image generation failed (${response.status})`;
    throw new Error(message);
  }
  const url = firstImageUrl(payload);
  if (!url) throw new Error("Image generation returned no file.");
  return url;
}
