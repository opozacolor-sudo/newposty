import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const path = new URL(referer).pathname;
      const match = routing.locales.find(
        (locale) => path === `/${locale}` || path.startsWith(`/${locale}/`),
      );
      if (match) return match;
    } catch {
      // ignore invalid referer
    }
  }
  return routing.defaultLocale;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  const locale = localeFromRequest(request);
  const home = new URL(`/${locale}`, request.url);
  return NextResponse.redirect(home, { status: 303 });
}
