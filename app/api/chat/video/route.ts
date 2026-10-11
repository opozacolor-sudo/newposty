import { NextResponse } from "next/server";
import { finalizePendingVideo, latestReadyVideo } from "@/lib/chat-post/video";
import { FalImageError } from "@/lib/fal-image";
import { parseVideoJob } from "@/lib/fal-video";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = new URL(request.url).searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ error: "Missing conversation" }, { status: 400 });

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, video_job")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ready = await latestReadyVideo(supabase, conversationId);
  const job = parseVideoJob(conversation.video_job);
  if (!job) {
    if (ready) return NextResponse.json({ payload: ready.payload, content: ready.content });
    const { data: message } = await supabase
      .from("messages")
      .select("payload")
      .eq("conversation_id", conversationId)
      .eq("kind", "generated_video")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return NextResponse.json({ payload: message?.payload ?? null });
  }

  try {
    const payload = await finalizePendingVideo({
      supabase,
      conversationId,
      userId: user.id,
    });
    if (!payload) {
      return NextResponse.json({
        payload: { type: "generated_video", status: "pending", media: { id: job.requestId, url: "", type: "video" } },
      });
    }
    const { data: message } = await supabase
      .from("messages")
      .select("content")
      .eq("conversation_id", conversationId)
      .eq("kind", "generated_video")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return NextResponse.json({ payload, content: message?.content ?? null });
  } catch (error) {
    if (error instanceof FalImageError && error.code === "failed") {
      return NextResponse.json({ payload: null, failed: true });
    }
    return NextResponse.json({
      payload: { type: "generated_video", status: "pending", media: { id: job.requestId, url: "", type: "video" } },
    });
  }
}
