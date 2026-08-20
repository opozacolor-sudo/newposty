import { NextResponse } from "next/server";
import { applyCaptionOverrides, executeResolvedAction } from "@/lib/chat-post/execute";
import {
  cancelPendingAction,
  claimPendingAction,
  finishAction,
  loadPendingAction,
} from "@/lib/chat-post/store";
import type { ResolvedAction } from "@/lib/chat-post/types";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    action_id?: string;
    captions?: Record<string, string>;
    cancel?: boolean;
    skip_confirmation?: boolean;
  };
  if (!body.action_id) {
    return NextResponse.json({ error: "action_id is required" }, { status: 400 });
  }

  if (body.cancel) {
    await cancelPendingAction({ supabase, userId: user.id, actionId: body.action_id });
    return NextResponse.json({ cancelled: true });
  }

  const claimed = await claimPendingAction({
    supabase,
    userId: user.id,
    actionId: body.action_id,
  });

  if (claimed.kind === "missing" || claimed.kind === "expired" || claimed.kind === "cancelled") {
    return NextResponse.json({ error: "This confirmation is no longer valid." }, { status: 409 });
  }

  if (claimed.kind === "already") {
    return NextResponse.json({
      action_id: body.action_id,
      results: claimed.results,
      allFailed: claimed.results.length > 0 && claimed.results.every((item) => item.status === "error"),
    });
  }

  const resolved = applyCaptionOverrides(claimed.resolved, body.captions);
  if (body.skip_confirmation) {
    await supabase
      .from("conversations")
      .update({ skip_confirmation: true })
      .eq("id", claimed.row.conversation_id)
      .eq("user_id", user.id);
  }
  await supabase
    .from("chat_post_actions")
    .update({ resolved })
    .eq("id", body.action_id)
    .eq("user_id", user.id);

  const results = await executeResolvedAction({
    resolved,
    locale: resolved.locale,
  });

  await finishAction({
    supabase,
    actionId: body.action_id,
    userId: user.id,
    conversationId: claimed.row.conversation_id as string,
    resolved,
    results,
  });

  await persistDashboardPosts({
    supabase,
    userId: user.id,
    resolved,
    results,
  });

  const allFailed = results.length > 0 && results.every((item) => item.status === "error");
  return NextResponse.json({ action_id: body.action_id, results, allFailed });
}

async function persistDashboardPosts(input: {
  supabase: Awaited<ReturnType<typeof createServerSupabase>>;
  userId: string;
  resolved: ResolvedAction;
  results: Awaited<ReturnType<typeof executeResolvedAction>>;
}) {
  for (const action of input.resolved.actions) {
    for (const target of action.platforms) {
      const result = input.results.find(
        (item) => item.platform === target.platform && item.handle === target.handle,
      );
      if (!result || result.status !== "success") continue;
      await input.supabase.from("posts").insert({
        user_id: input.userId,
        content: target.caption,
        media: action.media,
        status: action.mode === "schedule" ? "scheduled" : "publishing",
        scheduled_for: action.scheduled_at_utc,
        timezone: input.resolved.timezone,
        zernio_post_id: result.zernio_post_id ?? null,
        platform_results: [],
      });
    }
  }
}

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const actionId = new URL(request.url).searchParams.get("action_id");
  if (!actionId) return NextResponse.json({ error: "action_id is required" }, { status: 400 });
  const row = await loadPendingAction({ supabase, userId: user.id, actionId });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    status: row.status,
    resolved: row.resolved,
    results: row.results,
  });
}
