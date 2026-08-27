import { NextResponse } from "next/server";
import {
  loadLifetimePurchase,
  logBillingEvent,
  refundPreview,
  requireAccountUser,
} from "@/lib/account-server";
import { getStripe } from "@/lib/presale-server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const { user } = await requireAccountUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const purchase = await loadLifetimePurchase(user.id, user.email);
  if (!purchase) {
    return NextResponse.json({ error: "NO_PURCHASE" }, { status: 404 });
  }
  if (!purchase.stripe_payment_intent_id) {
    return NextResponse.json({ error: "NO_PAYMENT" }, { status: 409 });
  }

  const preview = refundPreview(purchase);
  const admin = createAdminSupabase();
  let stripeRefundId: string | null = null;

  if (preview.amountEur > 0) {
    try {
      const refund = await getStripe().refunds.create({
        payment_intent: purchase.stripe_payment_intent_id,
        amount: preview.amountEur * 100,
      });
      stripeRefundId = refund.id;
    } catch (error) {
      return NextResponse.json({ error: "REFUND_FAILED" }, { status: 502 });
    }
  }

  const { error: updateError } = await admin
    .from("presale_purchases")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refund_amount_eur: preview.amountEur,
    })
    .eq("id", purchase.id)
    .in("status", ["paid", "registered"]);
  if (updateError) {
    return NextResponse.json({ error: "REFUND_FAILED" }, { status: 500 });
  }

  await admin.from("profiles").update({ lifetime_access: false }).eq("id", user.id);

  await logBillingEvent({
    userId: user.id,
    email: user.email,
    kind: "refund",
    amountEur: preview.amountEur,
    stripeRefundId,
    detail: {
      purchaseId: purchase.id,
      monthsConsumed: preview.monthsConsumed,
      fullWithdrawal: preview.fullWithdrawal,
      paidEur: purchase.price_eur,
    },
  });

  return NextResponse.json({ ok: true, amountEur: preview.amountEur, stripeRefundId });
}
