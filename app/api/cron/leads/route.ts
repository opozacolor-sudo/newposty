import { NextResponse } from "next/server";
import { scanLeadsInbox } from "@/lib/leads/scan";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await scanLeadsInbox();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Lead scan failed" }, { status: 502 });
  }
}
