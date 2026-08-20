import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { createPost } from "@/lib/zernio";
import { platformLabel } from "@/lib/platforms";
import { clockSnapshot, isAppLocale } from "@/lib/locale-time";

type ChatMessage = { role: "user" | "assistant"; content: string };
type MediaItem = { url: string; type: "image" | "video" };

const tools: Anthropic.Tool[] = [
  {
    name: "list_connected_accounts",
    description: "List the user's connected social accounts.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "update_brand_profile",
    description: "Save the user's brand name and voice so future drafts stay on-tone.",
    input_schema: {
      type: "object",
      properties: {
        brand_name: { type: "string" },
        brand_voice: { type: "string" },
      },
    },
  },
  {
    name: "publish_post",
    description:
      "Publish or schedule a post to one or more connected accounts via Zernio. Use only when the user clearly asks to post or schedule.",
    input_schema: {
      type: "object",
      required: ["content", "account_ids"],
      properties: {
        content: { type: "string" },
        account_ids: {
          type: "array",
          items: { type: "string" },
          description: "newposty social_accounts.id values, not Zernio IDs.",
        },
        publish_now: { type: "boolean" },
        scheduled_for: {
          type: "string",
          description: "ISO-8601 local datetime without timezone, e.g. 2026-08-20T14:00:00",
        },
        timezone: { type: "string" },
      },
    },
  },
];

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!conversation) {
    return NextResponse.json({ conversationId: null, messages: [] });
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    conversationId: conversation.id,
    messages: messages ?? [],
  });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let apiKey: string;
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    conversationId?: string | null;
    message: string;
    media?: MediaItem[];
    locale?: string;
  };

  const text = body.message?.trim();
  if (!text) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("id, platform, username, display_name, zernio_account_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  let conversationId = body.conversationId ?? null;
  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: text.slice(0, 72),
      })
      .select("id")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    conversationId = created.id as string;
  }

  const userContent =
    body.media && body.media.length > 0
      ? `${text}\n\nAttached media:\n${body.media.map((item) => `- ${item.type}: ${item.url}`).join("\n")}`
      : text;

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "user",
    content: userContent,
  });

  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(40);

  const locale = isAppLocale(body.locale) ? body.locale : "en";
  const clock = clockSnapshot(locale);
  const timeZone = clock.timeZone;

  const anthropic = new Anthropic({ apiKey });
  const system = [
    "You are Newposty's social studio assistant.",
    "Help the user draft captions, generate post ideas, refine brand voice, and publish or schedule posts.",
    "Keep replies concise and useful. Offer 1-3 caption options when drafting.",
    profile?.brand_name ? `Brand: ${profile.brand_name}` : "Brand name is not set yet.",
    profile?.brand_voice ? `Voice: ${profile.brand_voice}` : "",
    `The site clock the user sees is ${timeZone} (from the selected language).`,
    `Right now that clock shows ${clock.dateLabel}, ${clock.timeLabel}.`,
    `Today is ${clock.ymd}. Tomorrow is ${clock.tomorrowYmd}. Current local datetime: ${clock.localIso}.`,
    "When the user says tomorrow, in N days, Monday, next week, or similar, resolve the date from this clock — not from memory.",
    `Schedule with scheduled_for as local datetime in ${timeZone}, without a timezone suffix, e.g. ${clock.ymd}T10:00:00.`,
    accounts && accounts.length > 0
      ? `Connected accounts:\n${accounts
          .map(
            (account) =>
              `- id=${account.id} platform=${platformLabel(account.platform as string)} handle=${account.username ?? account.display_name ?? "unknown"}`,
          )
          .join("\n")}`
      : "No social accounts are connected. Ask them to connect accounts on the Accounts page before publishing.",
    body.media && body.media.length > 0
      ? `The latest user message includes media that can be attached when publishing: ${JSON.stringify(body.media)}`
      : "",
    "When publishing, use social_accounts.id values from the list above.",
  ]
    .filter(Boolean)
    .join("\n");

  const anthropicMessages: Anthropic.MessageParam[] = (history ?? []).map(
    (message) => ({
      role: message.role as ChatMessage["role"],
      content: message.content as string,
    }),
  );

  let finalText = "";
  let published: unknown = null;

  for (let round = 0; round < 4; round += 1) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1400,
      system,
      tools,
      messages: anthropicMessages,
    });

    const toolUses = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );
    finalText = textBlocks.map((block) => block.text).join("\n").trim();

    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      break;
    }

    anthropicMessages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tool of toolUses) {
      try {
        if (tool.name === "list_connected_accounts") {
          toolResults.push({
            type: "tool_result",
            tool_use_id: tool.id,
            content: JSON.stringify(accounts ?? []),
          });
        } else if (tool.name === "update_brand_profile") {
          const input = tool.input as { brand_name?: string; brand_voice?: string };
          await supabase
            .from("profiles")
            .update({
              brand_name: input.brand_name ?? profile?.brand_name,
              brand_voice: input.brand_voice ?? profile?.brand_voice,
            })
            .eq("id", user.id);
          toolResults.push({
            type: "tool_result",
            tool_use_id: tool.id,
            content: "Brand profile saved.",
          });
        } else if (tool.name === "publish_post") {
          const input = tool.input as {
            content: string;
            account_ids: string[];
            publish_now?: boolean;
            scheduled_for?: string;
            timezone?: string;
          };
          const selected = (accounts ?? []).filter((account) =>
            input.account_ids.includes(account.id as string),
          );
          if (selected.length === 0) {
            throw new Error("No matching connected accounts.");
          }
          const zernioPost = await createPost({
            content: input.content,
            platforms: selected.map((account) => ({
              platform: account.platform as string,
              accountId: account.zernio_account_id as string,
            })),
            mediaItems: body.media,
            publishNow: Boolean(input.publish_now) && !input.scheduled_for,
            scheduledFor: input.scheduled_for,
            timezone: timeZone,
          });
          const { data: post } = await supabase
            .from("posts")
            .insert({
              user_id: user.id,
              content: input.content,
              media: body.media ?? [],
              status: zernioPost.status ?? (input.scheduled_for ? "scheduled" : "publishing"),
              scheduled_for: input.scheduled_for ?? null,
              timezone: timeZone,
              zernio_post_id: zernioPost._id,
              platform_results: zernioPost.platforms ?? [],
            })
            .select("*")
            .single();
          published = post;
          toolResults.push({
            type: "tool_result",
            tool_use_id: tool.id,
            content: JSON.stringify({ ok: true, post }),
          });
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: tool.id,
            content: "Unknown tool",
            is_error: true,
          });
        }
      } catch (error) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: tool.id,
          is_error: true,
          content: error instanceof Error ? error.message : "Tool failed",
        });
      }
    }

    anthropicMessages.push({ role: "user", content: toolResults });
  }

  if (!finalText) {
    finalText = published
      ? "Done — the post is on its way."
      : "I drafted that, but had nothing else to add.";
  }

  await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "assistant",
    content: finalText,
  });

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({
    conversationId,
    reply: finalText,
    published,
  });
}
