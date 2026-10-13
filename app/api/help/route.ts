import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { applyClientScope, loadWorkspace } from "@/lib/clients";
import { loadProfileBilling } from "@/lib/billing/entitlements";
import { getAnthropicApiKey } from "@/lib/env";
import { helpSystemPrompt } from "@/lib/help/prompt";
import { localeFromRequest } from "@/lib/locale-time";
import { platformLabel } from "@/lib/platforms";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 60;

type ChatTurn = { role: "user" | "assistant"; content: string };

function asTurns(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  const turns: ChatTurn[] = [];
  for (const item of value.slice(-12)) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const role = row.role === "assistant" ? "assistant" : row.role === "user" ? "user" : null;
    const content = typeof row.content === "string" ? row.content.trim() : "";
    if (!role || !content || content.length > 2000) continue;
    turns.push({ role, content });
  }
  return turns;
}

async function viewerContext() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false as const, email: null as string | null };
  const billing = await loadProfileBilling(user.id);
  try {
    const workspace = await loadWorkspace(supabase, user.id);
    const { data } = await applyClientScope(
      supabase
        .from("social_accounts")
        .select("platform, username, display_name")
        .eq("user_id", user.id)
        .eq("is_active", true),
      workspace,
    );
    const accounts = (data ?? []).map((row) => {
      const handle = String(row.username ?? row.display_name ?? "").trim();
      return handle ? `${platformLabel(String(row.platform))} ${handle}` : platformLabel(String(row.platform));
    });
    return {
      signedIn: true as const,
      email: user.email ?? null,
      plan: billing.plan,
      accounts,
    };
  } catch {
    return { signedIn: true as const, email: user.email ?? null, plan: billing.plan, accounts: [] as string[] };
  }
}

export async function GET() {
  const viewer = await viewerContext();
  return NextResponse.json({ email: viewer.email, signedIn: viewer.signedIn });
}

export async function POST(request: Request) {
  const limited = rateLimit(`help:${clientIp(request)}`, 24, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  let payload: { messages?: unknown; path?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const turns = asTurns(payload.messages);
  const last = turns.at(-1);
  if (!last || last.role !== "user") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const locale = localeFromRequest(request);
  const path = typeof payload.path === "string" ? payload.path.slice(0, 180) : null;
  const viewer = await viewerContext();

  let apiKey = "";
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return NextResponse.json({ error: "Help is unavailable." }, { status: 503 });
  }

  const anthropic = new Anthropic({ apiKey });
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      system: helpSystemPrompt({
        locale,
        path,
        viewer,
      }),
      messages: turns.map((turn) => ({ role: turn.role, content: turn.content })),
    });
    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n")
      .trim();
    if (!text) {
      return NextResponse.json({ error: "Empty reply" }, { status: 502 });
    }
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("[help]", error instanceof Error ? error.message : "failed");
    return NextResponse.json({ error: "Help is unavailable." }, { status: 502 });
  }
}
