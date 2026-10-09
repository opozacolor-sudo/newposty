import { FalImageError } from "@/lib/fal-image";
import { generateFalVideo } from "@/lib/fal-video";
import { loadSiteBrief } from "@/lib/site-brief";
import type { ChatMedia, GeneratedVideoPayload } from "@/lib/chat-post/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export function buildVideoPrompt(input: {
  locale: string;
  brief: string;
  brandName?: string | null;
  siteTitle?: string;
  siteDescription?: string;
  siteUrl?: string;
  hasImage: boolean;
}) {
  const ro = input.locale === "ro";
  return [
    "Vertical 9:16 social clip, 5 seconds, Reels and TikTok, product or brand, clean motion, no watermark, no fake UI chrome.",
    "Subtle camera move, sharp, commercial. Do not invent a different product or logo.",
    input.brandName ? `Brand: ${input.brandName}.` : "",
    input.siteTitle ? `Title: ${input.siteTitle}.` : "",
    input.siteUrl ? `Product or site page: ${input.siteUrl}.` : "",
    input.siteDescription ? `About: ${input.siteDescription}` : "",
    input.brief ? `User brief: ${input.brief}` : "",
    input.hasImage
      ? "Animate the attached still. Keep the product, layout, and text that are already in the photo."
      : "",
    ro ? "If the brief is Romanian, on-screen text stays Romanian." : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function createGeneratedVideo(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  locale: string;
  brief: string;
  siteUrl?: string;
  brandName?: string | null;
  references: ChatMedia[];
}): Promise<{ ok: true; payload: GeneratedVideoPayload } | { ok: false; error: string }> {
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

  const prompt = buildVideoPrompt({
    locale: input.locale,
    brief: input.brief,
    brandName: input.brandName,
    siteTitle: site?.title,
    siteDescription: site?.description,
    siteUrl: site?.url,
    hasImage: false,
  });

  let remoteUrl: string;
  try {
    remoteUrl = await generateFalVideo({ prompt });
  } catch (error) {
    const missing = error instanceof Error && error.message === "MISSING_FAL_KEY";
    const code = error instanceof FalImageError ? error.code : null;
    const ro = input.locale === "ro";
    return {
      ok: false,
      error: missing
        ? ro
          ? "Generarea de video nu e pornită pe server (lipsește cheia)."
          : "Video generation is not enabled on the server (missing key)."
        : code === "unauthorized"
          ? ro
            ? "Cheia de generare e invalidă. Verific-o pe server."
            : "The image key is invalid. Check it on the server."
          : code === "credits"
            ? ro
              ? "Contul de generare n-are credit. Pune câțiva dolari pe el și reîncearcă."
              : "The image account has no credit. Add a few dollars and try again."
            : ro
              ? "Nu am putut genera clipul. Încearcă din nou peste un moment."
              : "I could not generate the clip. Try again in a moment.",
    };
  }

  try {
    const downloaded = await fetch(remoteUrl, { signal: AbortSignal.timeout(30_000) });
    if (!downloaded.ok) throw new Error("download");
    const buffer = Buffer.from(await downloaded.arrayBuffer());
    if (buffer.length < 200) throw new Error("empty");
    const path = `${input.userId}/${crypto.randomUUID()}-clip.mp4`;
    const { error: uploadError } = await input.supabase.storage.from("media").upload(path, buffer, {
      contentType: "video/mp4",
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
        type: "video",
        name: "clip.mp4",
      })
      .select("id, url, type, name")
      .single();
    const media: ChatMedia = mediaRow ?? {
      id: crypto.randomUUID(),
      url: publicData.publicUrl,
      type: "video",
      name: "clip.mp4",
    };
    if (error && !mediaRow) {
      /* still return a usable url so the user can see the clip */
    }
    return {
      ok: true,
      payload: {
        type: "generated_video",
        media,
        site_url: site?.url ?? null,
      },
    };
  } catch {
    return {
      ok: false,
      error:
        input.locale === "ro"
          ? "Am generat clipul, dar nu am putut să-l salvez. Încearcă din nou."
          : "I generated the clip but could not save it. Try again.",
    };
  }
}
