import { NextResponse } from "next/server";
import { fulfillCheckoutSessionById } from "@/lib/billing/sync";
import { getTrustedRequestOrigin } from "@/lib/env";
import { isAppLocale } from "@/lib/locales";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user } = await getRequestAuth();
  const origin = getTrustedRequestOrigin(request);
  const url = new URL(request.url);
  const locale = isAppLocale(url.searchParams.get("locale")) ? url.searchParams.get("locale")! : "en";
  const sessionId = url.searchParams.get("session_id") ?? "";
  const plan = new URL(`/${locale}/plan`, origin);

  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, origin));
  }
  if (!sessionId.startsWith("cs_")) {
    plan.searchParams.set("billing", "cancel");
    return NextResponse.redirect(plan);
  }

  try {
    const session = await fulfillCheckoutSessionById(sessionId);
    const owner = session.metadata?.user_id || session.client_reference_id;
    if (owner && owner !== user.id) {
      plan.searchParams.set("billing", "cancel");
      return NextResponse.redirect(plan);
    }
    plan.searchParams.set("billing", "success");
  } catch {
    plan.searchParams.set("billing", "pending");
  }
  return NextResponse.redirect(plan);
}
