import { FalImageError } from "@/lib/fal-image";
import {
  parseVideoJob,
  submitFalVideo,
  waitFalVideo,
  type FalVideoPending,
} from "@/lib/fal-video";
import { loadSiteBrief } from "@/lib/site-brief";
import type { ChatMedia, GeneratedVideoPayload } from "@/lib/chat-post/types";
import type { SupabaseClient } from "@supabase/supabase-js";

function alreadyFullVideoPrompt(brief: string) {
  const lower = brief.toLowerCase();
  return (
    brief.trim().length >= 240 ||
    (brief.trim().length >= 120 &&
      /9:16|cinematic|photoreal|slow (?:push|pan|dolly)|close-?up|steam rising|espresso/.test(lower))
  );
}

/** Short chat lines become a shot the model can film. Long pasted prompts stay as-is. */
export function expandVideoBrief(brief: string, locale: string) {
  const trimmed = brief.trim();
  if (!trimmed) return "";
  if (alreadyFullVideoPrompt(trimmed)) return trimmed;
  const ro = locale === "ro";
  return [
    "Vertical 9:16 TikTok and Reels clip, 5 seconds, photoreal, commercial, no watermark, no phone UI.",
    "One subject. Slow camera. Sharp detail. Warm natural light.",
    `Scene to film: ${trimmed}`,
    /cafenea|cafea|coffee|espresso|brasil|brazil/i.test(trimmed)
      ? "Close-up of a fresh espresso pouring into a ceramic cup, thick crema blooming, steam rising toward the lens, slow push-in, wood café counter, morning window light. Must make the viewer crave a hot fresh coffee."
      : "",
    ro ? "Any on-screen text stays Romanian. No English captions unless the brief asked." : "",
  ]
    .filter(Boolean)
    .join(" ");
}

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
    input.brief ? `User brief: ${expandVideoBrief(input.brief, input.locale)}` : "",
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

  const { data: conversation } = await input.supabase
    .from("conversations")
    .select("video_job")
    .eq("id", input.conversationId)
    .maybeSingle();
  const existing = parseVideoJob(conversation?.video_job);

  let remoteUrl: string;
  try {
    if (existing) {
      remoteUrl = await waitFalVideo(existing);
    } else {
      const started = await submitFalVideo(prompt);
      if ("url" in started) {
        remoteUrl = started.url;
      } else {
        await saveVideoJob(input.supabase, input.conversationId, started.pending);
        remoteUrl = await waitFalVideo(started.pending);
      }
    }
    await saveVideoJob(input.supabase, input.conversationId, null);
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
            : code === "pending"
              ? ro
                ? "Clipul de 5 secunde încă se renderizează. Nu mai trimite același mesaj — scrie doar „gata?”."
                : "The 5-second clip is still rendering. Do not send the same request again — just write “ready?”."
              : ro
                ? "Nu am putut genera clipul de 5 secunde. Nu reporni jobul. Scrie „gata?” ca să luăm fișierul deja plătit."
                : "I could not finish the 5-second clip. Do not start another job. Write “ready?” so we can collect the file already paid for.",
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
          ? "Clipul de 5 secunde e gata la generator, dar nu l-am putut salva. Scrie „gata?” — nu pornim alt job."
          : "The 5-second clip is ready at the generator, but I could not save it. Write “ready?” — we will not start another job.",
    };
  }
}

async function saveVideoJob(
  supabase: SupabaseClient,
  conversationId: string,
  pending: FalVideoPending | null,
) {
  await supabase
    .from("conversations")
    .update({
      video_job: pending
        ? {
            requestId: pending.requestId,
            statusUrl: pending.statusUrl,
            resultUrl: pending.resultUrl,
          }
        : null,
    })
    .eq("id", conversationId);
}
