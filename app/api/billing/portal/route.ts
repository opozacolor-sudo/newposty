import { NextResponse } from "next/server";
import { startBillingPortal } from "@/lib/billing/checkout";
import { localeFromRequest } from "@/lib/locale-time";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const locale = localeFromRequest(request);
  try {
    const url = await startBillingPortal({ userId: user.id, request, locale });
    if (!url) return NextResponse.json({ error: "NO_CUSTOMER" }, { status: 409 });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "PORTAL_UNAVAILABLE" }, { status: 502 });
  }
}
