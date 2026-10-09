import { FalImageError, generateFalImage, type FalImageSize } from "@/lib/fal-image";
import { loadSiteBrief } from "@/lib/site-brief";
import type { ChatMedia, GeneratedPosterPayload } from "@/lib/chat-post/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export function buildPosterPrompt(input: {
  locale: string;
  brief: string;
  headline?: string;
  brandName?: string | null;
  siteTitle?: string;
  siteDescription?: string;
  siteUrl?: string;
  price?: string | null;
  hasReferences: boolean;
}) {
  const ro = input.locale === "ro";
  const headline = (input.headline || input.siteTitle || input.brandName || "").trim();
  return [
    "Commercial social-media poster, vertical 4:5, premium advertising, sharp product photography, clean layout.",
    "Large readable headline, correct spelling, high contrast. No watermark, no fake UI chrome, no extra invented logos.",
    headline ? `Put this headline on the poster, spelled exactly: “${headline.slice(0, 80)}”.` : "No invented brand name.",
    input.brandName ? `Brand: ${input.brandName}.` : "",
    input.siteUrl ? `Product or site page: ${input.siteUrl}.` : "",
    input.price ? `Show this price if it fits the layout, spelled exactly: ${input.price}.` : "",
    input.siteDescription ? `About: ${input.siteDescription}` : "",
    input.brief ? `User brief: ${input.brief}` : "",
    input.hasReferences
      ? "Use the attached or page photos as the real product and brand look. Keep what is in them. Do not invent a different product."
      : "",
    ro ? "If the brief is Romanian, the headline on the poster is Romanian." : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function createGeneratedPoster(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  locale: string;
  brief: string;
  siteUrl?: string;
  headline?: string;
  brandName?: string | null;
  references: ChatMedia[];
  aspect?: "portrait" | "square";
}): Promise<{ ok: true; payload: GeneratedPosterPayload } | { ok: false; error: string }> {
  let site = null;
  if (input.siteUrl) {
    site = await loadSiteBrief(input.siteUrl);
    if (!site) {
      return {
        ok: false,
        error:
          input.locale === "ro"
            ? "Linkul nu e valid. Trimite un https public (site sau produs)."
            : "That link is not valid. Send a public https URL (site or product).",
      };
    }
  }

  const imageSize: FalImageSize = input.aspect === "square" ? "square_hd" : "portrait_4_3";
  const prompt = buildPosterPrompt({
    locale: input.locale,
    brief: input.brief,
    headline: input.headline,
    brandName: input.brandName,
    siteTitle: site?.title,
    siteDescription: site?.description,
    siteUrl: site?.url,
    price: site?.price,
    hasReferences: false,
  });

  let remoteUrl: string;
  try {
    remoteUrl = await generateFalImage({ prompt, imageSize });
  } catch (error) {
    const missing = error instanceof Error && error.message === "MISSING_FAL_KEY";
    const code = error instanceof FalImageError ? error.code : null;
    const ro = input.locale === "ro";
    return {
      ok: false,
      error: missing
        ? ro
          ? "Generarea de poze nu e pornită pe server (lipsește cheia)."
          : "Image generation is not enabled on the server (missing key)."
        : code === "unauthorized"
          ? ro
            ? "Cheia de generare e invalidă. Verific-o pe server."
            : "The image key is invalid. Check it on the server."
          : code === "credits"
            ? ro
              ? "Contul de generare n-are credit. Pune câțiva dolari pe el și reîncearcă."
              : "The image account has no credit. Add a few dollars and try again."
            : ro
              ? "Nu am putut genera posterul. Încearcă din nou peste un moment."
              : "I could not generate the poster. Try again in a moment.",
    };
  }

  try {
    const downloaded = await fetch(remoteUrl, { signal: AbortSignal.timeout(20_000) });
    if (!downloaded.ok) throw new Error("download");
    const buffer = Buffer.from(await downloaded.arrayBuffer());
    if (buffer.length < 100) throw new Error("empty");
    const path = `${input.userId}/${crypto.randomUUID()}-poster.jpg`;
    const { error: uploadError } = await input.supabase.storage.from("media").upload(path, buffer, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data: publicData } = input.supabase.storage.from("media").getPublicUrl(path);
    const { data: mediaRow, error } = await input.supabase
      .from("conversation_media")
      .insert({
        user_id: input.userId,
        conversation_id: input.conversationId,
        url: publicData.publicUrl,
        type: "image",
        name: "poster.jpg",
      })
      .select("id, url, type, name")
      .single();
    const media: ChatMedia = mediaRow ?? {
      id: crypto.randomUUID(),
      url: publicData.publicUrl,
      type: "image",
      name: "poster.jpg",
    };
    if (error && !mediaRow) {
      /* still return a usable url so the user can see the poster */
    }
    return {
      ok: true,
      payload: {
        type: "generated_poster",
        media,
        site_url: site?.url ?? null,
        headline: (input.headline || site?.title || "").slice(0, 80) || null,
      },
    };
  } catch {
    return {
      ok: false,
      error:
        input.locale === "ro"
          ? "Am generat imaginea, dar nu am putut s-o salvez. Încearcă din nou."
          : "I generated the image but could not save it. Try again.",
    };
  }
}
