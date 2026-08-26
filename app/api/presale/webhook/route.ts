import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eurosFromStripeAmount } from "@/lib/presale";
import {
  getStripe,
  issueRegistrationToken,
  sendPresaleRegisterEmail,
} from "@/lib/presale-server";
import { getStripeWebhookSecret } from "@/lib/env";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RecordResult = {
  purchase?: {
    id: string;
    email: string;
    slot_number: number;
    tranche: number;
    price_eur: number;
  };
  catalog_price?: number;
  price_mismatch?: boolean;
  replay?: boolean;
};

function idFrom(value: { id?: string } | string | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id ?? "";
}

async function fulfillCheckout(session: Stripe.Checkout.Session) {
  const email = (
    session.metadata?.email ||
    session.customer_details?.email ||
    session.customer_email ||
    ""
  )
    .trim()
    .toLowerCase();
  const paymentIntentId = idFrom(session.payment_intent);
  const customerId = idFrom(session.customer);
  const paid = eurosFromStripeAmount(session.amount_total);
  const locale = session.metadata?.locale === "en" ? "en" : "ro";

  if (!email || !paymentIntentId) {
    throw new Error("Missing email or payment_intent on checkout session");
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("record_presale_purchase", {
    p_email: email,
    p_payment_intent_id: paymentIntentId,
    p_stripe_customer_id: customerId,
    p_paid_price_eur: paid,
  });

  if (error) {
    if (error.message.includes("PRESALE_SOLD_OUT")) {
      const stripe = getStripe();
      await stripe.refunds.create({ payment_intent: paymentIntentId });
      console.error("[presale] refunded oversold payment", paymentIntentId);
      return;
    }
    throw error;
  }

  const result = data as RecordResult;
  const purchase = result.purchase;
  if (!purchase) throw new Error("record_presale_purchase returned no purchase");

  if (result.price_mismatch) {
    console.warn("[presale] paid price differs from allocated tranche catalog price", {
      email: purchase.email,
      slot: purchase.slot_number,
      tranche: purchase.tranche,
      paid: purchase.price_eur,
      catalog: result.catalog_price,
      paymentIntentId,
    });
  }

  const consented = session.metadata?.immediate_start_consent === "1";
  if (consented) {
    await admin
      .from("presale_purchases")
      .update({ immediate_start_consent: true })
      .eq("id", purchase.id);
  }

  if (result.replay) return;

  const token = await issueRegistrationToken(purchase.id);
  await sendPresaleRegisterEmail({
    email: purchase.email,
    token,
    locale,
    slot: purchase.slot_number,
    priceEur: purchase.price_eur,
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, getStripeWebhookSecret());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await fulfillCheckout(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}
