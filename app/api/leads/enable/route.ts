import { NextResponse } from "next/server";
import { loadWorkspace } from "@/lib/clients";
import { canEnableLeadAgent } from "@/lib/leads/knowledge";
import { loadLeadAgent, setLeadAgentEnabled } from "@/lib/leads/store";
import { createServerSupabase, getRequestAuth } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { enabled?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  const agent = await loadLeadAgent(supabase, user.id, workspace.clientId);
  if (!canEnableLeadAgent(agent)) {
    return NextResponse.json({ error: "not_trained" }, { status: 409 });
  }

  try {
    const next = await setLeadAgentEnabled({
      supabase,
      userId: user.id,
      clientId: workspace.clientId,
      enabled: payload.enabled === true,
    });
    return NextResponse.json({ ok: true, enabled: next.enabled });
  } catch {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
}
