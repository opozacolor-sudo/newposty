import { NextResponse } from "next/server";
import { resolveCreateActions } from "@/lib/chat-post/resolve";
import { resolveManageAction, savePendingAction } from "@/lib/chat-post/store";
import { userTimezone } from "@/lib/chat-post/timezone";
import type { ChatMedia, ManageAction, ToolPostAction } from "@/lib/chat-post/types";
import { getAnthropicApiKey } from "@/lib/env";
import { isAdsPlatformId } from "@/lib/platforms";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    conversationId?: string;
    locale?: string;
    actions?: ToolPostAction[];
    manage?: { reference: string; action: ManageAction; new_value?: string };
    media_ids?: string[];
    brief?: string;
  };

  if (!body.conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, skip_confirmation")
    .eq("id", body.conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("id, platform, username, display_name, zernio_account_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const posting = (accounts ?? []).filter(
    (account) => !isAdsPlatformId(String(account.platform)) && typeof account.zernio_account_id === "string",
  ) as Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>;

  let mediaQuery = supabase.from("conversation_media").select("id, url, type, name").eq("user_id", user.id);
  if (body.media_ids && body.media_ids.length > 0) {
    mediaQuery = mediaQuery.in("id", body.media_ids);
  } else {
    mediaQuery = mediaQuery.eq("conversation_id", body.conversationId);
  }
  const { data: mediaRows } = await mediaQuery;
  const media = (mediaRows ?? []) as ChatMedia[];

  const locale = body.locale === "ro" ? "ro" : "en";
  const timezone = userTimezone(profile?.timezone as string | undefined);
  let apiKey = "";
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    apiKey = "";
  }

  if (body.manage) {
    const managed = await resolveManageAction({
      supabase,
      userId: user.id,
      reference: body.manage.reference,
      action: body.manage.action,
      new_value: body.manage.new_value,
      timezone,
      locale,
    });
    if (!managed.ok) return NextResponse.json(managed, { status: 400 });
    const resolved = await savePendingAction({
      supabase,
      userId: user.id,
      conversationId: body.conversationId,
      resolved: managed.resolved,
    });
    return NextResponse.json({
      resolved_action: resolved,
      skip_confirmation: Boolean(conversation.skip_confirmation),
    });
  }

  const resolved = await resolveCreateActions({
    actions: body.actions ?? [],
    accounts: posting,
    media,
    locale,
    timezone,
    apiKey,
    brandName: profile?.brand_name as string | null,
    brandVoice: profile?.brand_voice as string | null,
    fallbackBrief: body.brief,
  });
  if (!resolved.ok) return NextResponse.json(resolved, { status: 400 });

  const saved = await savePendingAction({
    supabase,
    userId: user.id,
    conversationId: body.conversationId,
    resolved: resolved.resolved,
  });

  return NextResponse.json({
    resolved_action: saved,
    skip_confirmation: Boolean(conversation.skip_confirmation),
  });
}
