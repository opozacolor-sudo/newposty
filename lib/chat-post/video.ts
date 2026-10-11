import { FalImageError } from "@/lib/fal-image";
import {
  harvestFalVideo,
  parseVideoJob,
  submitFalVideo,
  type FalVideoPending,
} from "@/lib/fal-video";
import { getSiteUrl } from "@/lib/env";
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

  try {
    if (existing) {
      try {
        const remoteUrl = await harvestFalVideo(existing);
        if (remoteUrl) {
          const stored = await storeRemoteClip({
            supabase: input.supabase,
            userId: input.userId,
            conversationId: input.conversationId,
            remoteUrl,
            siteUrl: site?.url ?? null,
          });
          await saveVideoJob(input.supabase, input.conversationId, null);
          return { ok: true, payload: stored };
        }
        return { ok: true, payload: pendingVideoPayload(existing.requestId, site?.url ?? null) };
      } catch (error) {
        if (error instanceof FalImageError && error.code === "failed") {
          await saveVideoJob(input.supabase, input.conversationId, null);
        }
        throw error;
      }
    }

    const webhook = falVideoWebhookUrl();
    const started = await submitFalVideo(prompt, webhook);
    if ("url" in started) {
      const stored = await storeRemoteClip({
        supabase: input.supabase,
        userId: input.userId,
        conversationId: input.conversationId,
        remoteUrl: started.url,
        siteUrl: site?.url ?? null,
      });
      return { ok: true, payload: stored };
    }

    await saveVideoJob(input.supabase, input.conversationId, {
      ...started.pending,
      userId: input.userId,
      locale: input.locale,
      siteUrl: site?.url ?? null,
    });
    return { ok: true, payload: pendingVideoPayload(started.pending.requestId, site?.url ?? null) };
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

}

function pendingVideoPayload(requestId: string, siteUrl: string | null): GeneratedVideoPayload {
  return {
    type: "generated_video",
    status: "pending",
    site_url: siteUrl,
    media: { id: requestId, url: "", type: "video", name: "clip.mp4" },
  };
}

function falVideoWebhookUrl() {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return undefined;
  return `${getSiteUrl()}/api/webhooks/fal?secret=${encodeURIComponent(secret)}`;
}

export async function storeRemoteClip(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  remoteUrl: string;
  siteUrl?: string | null;
}): Promise<GeneratedVideoPayload> {
  const downloaded = await fetch(input.remoteUrl, { signal: AbortSignal.timeout(30_000) });
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
  const { data: mediaRow } = await input.supabase
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
  return {
    type: "generated_video",
    status: "ready",
    media,
    site_url: input.siteUrl ?? null,
  };
}

export async function latestReadyVideo(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<{ id: string; content: string; createdAt: string; payload: GeneratedVideoPayload } | null> {
  const { data } = await supabase
    .from("messages")
    .select("id, content, created_at, payload")
    .eq("conversation_id", conversationId)
    .eq("kind", "generated_video")
    .order("created_at", { ascending: false })
    .limit(8);
  for (const row of data ?? []) {
    const payload = row.payload as GeneratedVideoPayload | null;
    if (payload?.type === "generated_video" && payload.media?.url && payload.status !== "pending") {
      return {
        id: String(row.id),
        content: String(row.content ?? ""),
        createdAt: String(row.created_at ?? ""),
        payload,
      };
    }
  }
  return null;
}

export async function finalizePendingVideo(input: {
  supabase: SupabaseClient;
  conversationId: string;
  userId?: string;
  remoteUrl?: string;
}) {
  const { data: conversation } = await input.supabase
    .from("conversations")
    .select("id, user_id, video_job")
    .eq("id", input.conversationId)
    .maybeSingle();
  const job = parseVideoJob(conversation?.video_job);
  if (!conversation || !job) return null;
  let remoteUrl = input.remoteUrl ?? null;
  try {
    remoteUrl = remoteUrl ?? (await harvestFalVideo(job));
  } catch (error) {
    if (error instanceof FalImageError && error.code === "failed") {
      await saveVideoJob(input.supabase, input.conversationId, null);
    }
    throw error;
  }
  if (!remoteUrl) return null;
  const payload = await storeRemoteClip({
    supabase: input.supabase,
    userId: input.userId || job.userId || String(conversation.user_id),
    conversationId: input.conversationId,
    remoteUrl,
    siteUrl: job.siteUrl ?? null,
  });
  await saveVideoJob(input.supabase, input.conversationId, null);
  const locale = job.locale === "ro" ? "ro" : "en";
  const content =
    locale === "ro"
      ? "Am făcut clipul de 5 secunde. Vrei postare organică sau reclamă?"
      : "Here’s the 5-second clip. Organic post or paid ad?";
  const { data: pendingMsg } = await input.supabase
    .from("messages")
    .select("id, payload")
    .eq("conversation_id", input.conversationId)
    .eq("kind", "generated_video")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const pendingPayload = pendingMsg?.payload as GeneratedVideoPayload | null;
  if (pendingMsg && (!pendingPayload?.media?.url || pendingPayload.status === "pending")) {
    await input.supabase
      .from("messages")
      .update({ content, payload })
      .eq("id", pendingMsg.id);
  } else {
    await input.supabase.from("messages").insert({
      conversation_id: input.conversationId,
      user_id: input.userId || job.userId || String(conversation.user_id),
      role: "assistant",
      content,
      kind: "generated_video",
      payload,
    });
  }
  return payload;
}

async function saveVideoJob(
  supabase: SupabaseClient,
  conversationId: string,
  pending: (FalVideoPending & { userId?: string; locale?: string; siteUrl?: string | null }) | null,
) {
  await supabase
    .from("conversations")
    .update({
      video_job: pending
        ? {
            requestId: pending.requestId,
            statusUrl: pending.statusUrl,
            resultUrl: pending.resultUrl,
            userId: pending.userId ?? null,
            locale: pending.locale ?? null,
            siteUrl: pending.siteUrl ?? null,
          }
        : null,
    })
    .eq("id", conversationId);
}
