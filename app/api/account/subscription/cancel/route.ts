import { NextResponse } from "next/server";
import { loadLifetimePurchase, logBillingEvent, requireAccountUser } from "@/lib/account-server";
import { getStripe } from "@/lib/presale-server";

export const dynamic = "force-dynamic";

export async function POST() {
  const { user } = await requireAccountUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const purchase = await loadLifetimePurchase(user.id, user.email);
  if (!purchase?.stripe_customer_id) {
    return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 409 });
  }

  try {
    const stripe = getStripe();
    const list = await stripe.subscriptions.list({
      customer: purchase.stripe_customer_id,
      status: "active",
      limit: 1,
    });
    const subscription = list.data[0];
    if (!subscription) {
      return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 409 });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    await logBillingEvent({
      userId: user.id,
      email: user.email,
      kind: "cancel_subscription",
      detail: { subscriptionId: updated.id, cancelAtPeriodEnd: true },
    });

    return NextResponse.json({ ok: true, cancelAtPeriodEnd: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CANCEL_FAILED";
    if (message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
