import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { routing } from "@/i18n/routing";
import { getSupabasePublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function localeFrom(value: unknown) {
  return routing.locales.find((item) => item === value) ?? routing.defaultLocale;
}

export async function POST(request: Request) {
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
      console.error("[presale] waitlist join failed", error.message, error.code);
      return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WAITLIST_FAILED";
    console.error("[presale] waitlist failed", message);
    return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
  }
}
