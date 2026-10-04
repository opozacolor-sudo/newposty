import { NextResponse } from "next/server";
import { loadWorkspace } from "@/lib/clients";
import { saveTrainedAgent } from "@/lib/leads/store";
import { trainLeadAgentFromSite } from "@/lib/leads/train";
import { createServerSupabase, getRequestAuth } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { site_url?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  try {
    const trained = await trainLeadAgentFromSite(String(payload.site_url ?? ""));
    const agent = await saveTrainedAgent({
      supabase,
      userId: user.id,
      clientId: workspace.clientId,
      siteUrl: trained.siteUrl,
      knowledge: trained.knowledge,
    });
    return NextResponse.json({
      ok: true,
      trained: true,
      enabled: false,
      siteUrl: agent?.site_url,
      business: agent?.knowledge.business,
      products: agent?.knowledge.products?.length ?? 0,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "train_failed";
    const status = code === "invalid_url" ? 400 : 502;
    return NextResponse.json({ error: code }, { status });
  }
}
