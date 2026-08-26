import { NextResponse } from "next/server";
import { countActiveSocialAccounts, loadLifetimePurchase, refundPreview, requireAccountUser } from "@/lib/account-server";
import { getStripe } from "@/lib/presale-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user } = await requireAccountUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connectedAccounts = await countActiveSocialAccounts(user.id);
  const purchase = await loadLifetimePurchase(user.id, user.email);
  const refund = purchase ? refundPreview(purchase) : null;

  let subscription: { id: string; cancelAtPeriodEnd: boolean } | null = null;
  if (purchase?.stripe_customer_id) {
    try {
      const stripe = getStripe();
      const list = await stripe.subscriptions.list({
        customer: purchase.stripe_customer_id,
        status: "active",
        limit: 1,
      });
      const item = list.data[0];
      if (item) {
        subscription = { id: item.id, cancelAtPeriodEnd: item.cancel_at_period_end };
      }
    } catch {
      subscription = null;
    }
  }

  return NextResponse.json({
    connectedAccounts,
    canDelete: connectedAccounts === 0,
    lifetime: Boolean(purchase),
    refund: refund
      ? {
          amountEur: refund.amountEur,
          monthsConsumed: refund.monthsConsumed,
          paidEur: purchase?.price_eur ?? 0,
          fullWithdrawal: refund.fullWithdrawal,
        }
      : null,
    subscription,
  });
}
