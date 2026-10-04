import { NextResponse } from "next/server";
import { recordLeadClick } from "@/lib/leads/store";
import { publicHttpUrl } from "@/lib/site-brief";
import { createAdminSupabase } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const threadId = url.searchParams.get("t")?.trim() ?? "";
  const target = publicHttpUrl(url.searchParams.get("u") ?? "");
  if (!threadId || !target) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }

  try {
    await recordLeadClick({ supabase: createAdminSupabase(), threadId, url: target });
  } catch {
    /* still redirect */
  }
  return NextResponse.redirect(target, 302);
}
