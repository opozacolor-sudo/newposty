import { NextResponse } from "next/server";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = rateLimit(`waitlist:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  let payload: { email?: unknown; locale?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  const locale = payload.locale === "en" ? "en" : "ro";
  if (!emailPattern.test(email) || email.length > 320) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("join_presale_waitlist", {
    p_email: email,
    p_locale: locale,
  });

  if (error) {
    return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
