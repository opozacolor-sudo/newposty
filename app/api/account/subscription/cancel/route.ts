import { NextResponse } from "next/server";
import { loadLifetimePurchase, logBillingEvent, requireAccountUser } from "@/lib/account-server";
import { getStripe } from "@/lib/presale-server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const { user } = await requireAccountUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const purchase = await loadLifetimePurchase(user.id, user.email);
  const { data: profile } = await createAdminSupabase()
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  const customerId =
    (typeof profile?.stripe_customer_id === "string" && profile.stripe_customer_id) ||
    purchase?.stripe_customer_id ||
    null;
  if (!customerId) {
    return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 409 });
  }

  try {
    const stripe = getStripe();
    const list = await stripe.subscriptions.list({
      customer: customerId,
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
    if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 409 });
    }
    return NextResponse.json({ error: "CANCEL_FAILED" }, { status: 502 });
  }
}
