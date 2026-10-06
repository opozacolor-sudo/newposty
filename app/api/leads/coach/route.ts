import { NextResponse } from "next/server";
import { loadWorkspace } from "@/lib/clients";
import { absorbOwnerBrief, coachReply } from "@/lib/leads/coach";
import { localeFromLeadText } from "@/lib/leads/locale";
import { loadLeadAgent, saveAgentKnowledge } from "@/lib/leads/store";
import { createServerSupabase, getRequestAuth } from "@/lib/supabase/server";

export const maxDuration = 40;

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = String(payload.message ?? "").trim();
  if (message.length < 3 || message.length > 4000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  const existing = await loadLeadAgent(supabase, user.id, workspace.clientId);
  const locale = localeFromLeadText(message);
  const nextKnowledge = absorbOwnerBrief(existing?.knowledge ?? {}, message);
  const reply = await coachReply(nextKnowledge, message, locale);
  nextKnowledge.coach = [
    ...(nextKnowledge.coach ?? []),
    { role: "agent" as const, text: reply, at: new Date().toISOString() },
  ].slice(-24);

  const agent = await saveAgentKnowledge({
    supabase,
    userId: user.id,
    clientId: workspace.clientId,
    knowledge: nextKnowledge,
    markTrained: Boolean(existing?.trained_at || nextKnowledge.booking?.url || message.length >= 40),
  });

  return NextResponse.json({
    ok: true,
    reply,
    trained: Boolean(agent?.trained_at),
    bookingUrl: agent?.knowledge.booking?.url ?? null,
    coach: agent?.knowledge.coach ?? [],
  });
}
