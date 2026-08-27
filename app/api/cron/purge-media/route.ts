import { NextResponse } from "next/server";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "@/lib/env";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = getSupabasePublicEnv();
  const serviceKey = getSupabaseServiceRoleKey();
  const response = await fetch(`${url}/functions/v1/purge-media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    removed?: unknown;
    kept?: unknown;
    scanned?: unknown;
  };
  return NextResponse.json(
    {
      removed: payload.removed ?? 0,
      kept: payload.kept ?? 0,
      scanned: payload.scanned ?? 0,
    },
    { status: response.ok ? 200 : 502 },
  );
}
