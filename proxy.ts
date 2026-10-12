import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

const RETIRED_LOCALES = new Set(["pt", "ar", "hi", "ru", "zh"]);

function withPathnameHeader(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return new NextRequest(request.url, { headers });
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/") {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const locale =
      cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)
        ? cookieLocale
        : routing.defaultLocale;
    const target = request.nextUrl.clone();
    target.pathname = `/${locale}`;
    return NextResponse.redirect(target, cookieLocale ? 307 : 301);
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (first && RETIRED_LOCALES.has(first)) {
    const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
    const target = request.nextUrl.clone();
    target.pathname = rest ? `/en/${rest}` : "/en";
    return NextResponse.redirect(target, 301);
  }

  const code = request.nextUrl.searchParams.get("code");
  if (code && !request.nextUrl.pathname.startsWith("/auth/callback")) {
    const target = request.nextUrl.clone();
    target.pathname = "/auth/callback";
    return NextResponse.redirect(target);
  }

  const intlRequest = withPathnameHeader(request);
  const response = handleI18nRouting(intlRequest);
  return updateSession(intlRequest, response);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)"],
};
