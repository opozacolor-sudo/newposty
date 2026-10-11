import { NextResponse } from "next/server";
import { loadWorkspace } from "@/lib/clients";
import { resetLeadAgent } from "@/lib/leads/store";
import { createServerSupabase, getRequestAuth } from "@/lib/supabase/server";

export async function POST() {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  try {
    await resetLeadAgent({
      supabase,
      userId: user.id,
      clientId: workspace.clientId,
    });
    return NextResponse.json({ ok: true, trained: false, enabled: false });
  } catch {
    return NextResponse.json({ error: "reset_failed" }, { status: 502 });
  }
}
