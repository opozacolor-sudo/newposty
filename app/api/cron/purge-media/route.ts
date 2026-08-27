import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/env";

export const maxDuration = 60;

export async function GET(request: Request) {
  const cron = request.headers.get("x-vercel-cron");
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  const allowed = Boolean(secret) && (cron === "1" || auth === `Bearer ${secret}`);
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, anonKey } = getSupabasePublicEnv();
  const response = await fetch(`${url}/functions/v1/purge-media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
  });
  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.ok ? 200 : 502 });
}
