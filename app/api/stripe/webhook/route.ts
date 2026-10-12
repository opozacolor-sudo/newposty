import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { handleBillingEvent } from "@/lib/billing/sync";
import { constructStripeWebhookEvent } from "@/lib/billing/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = constructStripeWebhookEvent(raw, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await handleBillingEvent(event);
  return NextResponse.json({ received: true });
}
