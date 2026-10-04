import { NextResponse } from "next/server";
import { scanLeadsInbox } from "@/lib/leads/scan";
import { getRequestAuth } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST() {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const stats = await scanLeadsInbox(user.id);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Scan failed" }, { status: 502 });
  }
}
