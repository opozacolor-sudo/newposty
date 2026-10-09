import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

const RETIRED_LOCALES = new Set(["pt", "ar", "hi", "ru", "zh"]);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
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

  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)"],
};
