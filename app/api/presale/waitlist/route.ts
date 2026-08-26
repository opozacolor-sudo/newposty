import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { createAdminSupabase } from "@/lib/supabase/admin";

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

    const admin = createAdminSupabase();
    const { error } = await admin.from("presale_waitlist").upsert(
      { email, locale: localeFrom(body.locale) },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) {
      return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json({ error: "SERVER_MISCONFIGURED" }, { status: 503 });
    }
    return NextResponse.json({ error: "WAITLIST_FAILED" }, { status: 500 });
  }
}
