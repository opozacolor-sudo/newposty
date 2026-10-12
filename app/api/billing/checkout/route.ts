import { NextResponse } from "next/server";
import { BillingCheckoutError, startBillingCheckout } from "@/lib/billing/checkout";
import { localeFromRequest } from "@/lib/locale-time";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { lookupKey?: unknown; locale?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lookupKey = String(payload.lookupKey ?? "").trim();
  const locale = localeFromRequest(request, typeof payload.locale === "string" ? payload.locale : null);

  try {
    const result = await startBillingCheckout({
      user: { id: user.id, email: user.email },
      lookupKey,
      locale,
      request,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BillingCheckoutError) {
      const status = error.code === "STRIPE" ? 502 : 400;
      return NextResponse.json({ error: error.code, message: error.message }, { status });
    }
    return NextResponse.json(
      { error: "CHECKOUT_FAILED", message: error instanceof Error ? error.message : "Checkout failed." },
      { status: 502 },
    );
  }
}
