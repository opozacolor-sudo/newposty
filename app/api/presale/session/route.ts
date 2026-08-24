import { NextResponse } from "next/server";
import { getStripe, issueRegistrationToken } from "@/lib/presale-server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();
  const mint = url.searchParams.get("mint") === "1";
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ status: "unpaid" }, { status: 402 });
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntentId) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }

  const admin = createAdminSupabase();
  const { data: purchase } = await admin
    .from("presale_purchases")
    .select("id, email, status, slot_number, price_eur")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }
  if (purchase.status === "registered") {
    return NextResponse.json({ status: "registered", email: purchase.email });
  }

  if (!mint) {
    return NextResponse.json({
      status: "paid",
      email: purchase.email,
      slot: purchase.slot_number,
      priceEur: purchase.price_eur,
    });
  }

  const token = await issueRegistrationToken(purchase.id);
  return NextResponse.json({
    status: "paid",
    email: purchase.email,
    slot: purchase.slot_number,
    priceEur: purchase.price_eur,
    token,
  });
}
