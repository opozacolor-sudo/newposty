import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { routing } from "@/i18n/routing";
import { getSupabasePublicEnv } from "@/lib/env";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function localeFrom(value: unknown) {
  return routing.locales.find((item) => item === value) ?? routing.defaultLocale;
}

export async function POST(request: Request) {
  const limited = rateLimit(`waitlist:${clientIp(request)}`, 10, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      locale?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!emailPattern.test(email) || email.length > 320) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const { url, anonKey } = getSupabasePublicEnv();
    const supabase = createClient(url, anonKey);
    const { error } = await supabase.rpc("join_presale_waitlist", {
      p_email: email,
      p_locale: localeFrom(body.locale),
    });
    if (error) {
      return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
  }
}
