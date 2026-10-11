import { NextResponse } from "next/server";
import { firstVideoUrl, falRequestId } from "@/lib/fal-video";
import { finalizePendingVideo } from "@/lib/chat-post/video";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const requestId = falRequestId(record) || falRequestId(record.payload);
  const remoteUrl =
    firstVideoUrl(record.payload) || firstVideoUrl(record) || firstVideoUrl(record.data);
  if (!requestId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createAdminSupabase();
  const { data: conversation } = await admin
    .from("conversations")
    .select("id")
    .eq("video_job->>requestId", requestId)
    .maybeSingle();
  if (!conversation) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    await finalizePendingVideo({
      supabase: admin,
      conversationId: conversation.id as string,
      remoteUrl: remoteUrl ?? undefined,
    });
  } catch (error) {
    console.error("[video] fal webhook failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Could not store clip" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
