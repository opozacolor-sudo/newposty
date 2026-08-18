import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { routing } from "@/i18n/routing";
import { createServerSupabase } from "@/lib/supabase/server";

function localeFromRequest(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];
  if (cookie && routing.locales.includes(cookie as (typeof routing.locales)[number])) {
    return cookie;
  }
  return routing.defaultLocale;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = await createServerSupabase();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    await supabase.auth.signOut();
  }

  const locale = localeFromRequest(request);
  const login = new URL(`/${locale}/login`, getSiteUrl());
  login.searchParams.set("confirmed", "1");
  return NextResponse.redirect(login);
}
