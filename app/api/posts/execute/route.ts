import { NextResponse } from "next/server";
import { applyCaptionOverrides, executeResolvedAction, refreshPendingResults } from "@/lib/chat-post/execute";
import {
  cancelPendingAction,
  claimPendingAction,
  finishAction,
  loadPendingAction,
  saveRefreshedResults,
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
    const row = await loadPendingAction({ supabase, userId: user.id, actionId: body.action_id });
    const pending = claimed.results.some((item) => item.status === "pending");
    const results = pending
      ? await refreshPendingResults({ results: claimed.results, locale: claimed.resolved.locale })
      : claimed.results;
    if (pending && row) {
      await saveRefreshedResults({
        supabase,
        actionId: body.action_id,
        userId: user.id,
        conversationId: row.conversation_id as string,
        results,
      });
    }
    return NextResponse.json({
      action_id: body.action_id,
      results,
      allFailed: results.length > 0 && results.every((item) => item.status === "error"),
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
  return NextResponse.json({
    action_id: body.action_id,
    results,
    allFailed,
    excluded_by_validation: resolved.excluded_by_validation,
  });
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
      if (!result || result.status === "error") continue;
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
  const url = new URL(request.url);
  const actionId = url.searchParams.get("action_id");
  const refresh = url.searchParams.get("refresh") === "1";
  if (!actionId) return NextResponse.json({ error: "action_id is required" }, { status: 400 });
  const row = await loadPendingAction({ supabase, userId: user.id, actionId });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const resolved = { ...(row.resolved as object), action_id: row.id } as ResolvedAction;
  let results = (row.results as Awaited<ReturnType<typeof executeResolvedAction>>) ?? [];
  if (refresh && results.some((item) => item.status === "pending")) {
    results = await refreshPendingResults({ results, locale: resolved.locale });
    await saveRefreshedResults({
      supabase,
      actionId,
      userId: user.id,
      conversationId: row.conversation_id as string,
      results,
    });
  }
  return NextResponse.json({
    status: row.status,
    resolved: row.resolved,
    results,
    allFailed: results.length > 0 && results.every((item) => item.status === "error"),
  });
}
