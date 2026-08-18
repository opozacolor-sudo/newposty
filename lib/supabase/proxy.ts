import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/env";
import { routing } from "@/i18n/routing";

function splitLocale(pathname: string) {
  const match = routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (!match) {
    return { locale: routing.defaultLocale, path: pathname || "/" };
  }
  const path = pathname.slice(match.length + 1) || "/";
  return { locale: match, path };
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

export async function updateSession(request: NextRequest, response: NextResponse) {
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, path } = splitLocale(request.nextUrl.pathname);
  const isAuthPage = path === "/login" || path === "/signup";
  const isProtected =
    path === "/chat" ||
    path.startsWith("/chat/") ||
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/accounts" ||
    path.startsWith("/accounts/");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.searchParams.set("next", path);
    return copyCookies(response, NextResponse.redirect(redirectUrl));
  }

  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/chat`;
    redirectUrl.search = "";
    return copyCookies(response, NextResponse.redirect(redirectUrl));
  }

  return response;
}
