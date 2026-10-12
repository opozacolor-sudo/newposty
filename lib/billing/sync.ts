import type Stripe from "stripe";
import { getStripe } from "@/lib/presale-server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  PACK_EXPIRES_DAYS,
  PACK_UNITS,
  catalogByLookupKey,
  highestPlan,
  type PlanId,
} from "@/lib/stripe-catalog";

function idFrom(value: { id?: string } | string | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id ?? "";
}

function periodUnix(subscription: Stripe.Subscription) {
  const raw = subscription as Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
    items?: { data?: Array<{ current_period_start?: number; current_period_end?: number }> };
  };
  const item = raw.items?.data?.[0];
  const start =
    typeof raw.current_period_start === "number"
      ? raw.current_period_start
      : typeof item?.current_period_start === "number"
        ? item.current_period_start
        : null;
  const end =
    typeof raw.current_period_end === "number"
      ? raw.current_period_end
      : typeof item?.current_period_end === "number"
        ? item.current_period_end
        : null;
  return { start, end };
}

function isoFromUnix(unix: number | null) {
  return unix ? new Date(unix * 1000).toISOString() : null;
}

function lookupKeyFromSubscription(subscription: Stripe.Subscription) {
  const fromMeta = subscription.metadata?.lookup_key;
  if (fromMeta && catalogByLookupKey(fromMeta)?.plan) return fromMeta;
  const price = subscription.items?.data?.[0]?.price;
  if (price && typeof price !== "string" && price.lookup_key) return price.lookup_key;
  return "";
}

async function userIdForCustomer(customerId: string, fallback?: string | null) {
  const admin = createAdminSupabase();
  if (fallback) return fallback;
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return typeof data?.id === "string" ? data.id : null;
}

export async function fulfillBillingSession(session: Stripe.Checkout.Session) {
  if (session.metadata?.purpose !== "billing") return;
  if (session.payment_status && session.payment_status !== "paid" && session.mode === "payment") {
    return;
  }
  const customerId = idFrom(session.customer);
  const userId = await userIdForCustomer(customerId, session.metadata?.user_id ?? session.client_reference_id);
  if (!userId) return;

  const lookupKey = session.metadata?.lookup_key ?? "";
  const entry = catalogByLookupKey(lookupKey);
  const admin = createAdminSupabase();

  if (session.mode === "payment" && entry?.kind === "pack" && entry.pack) {
    const { error } = await admin.from("credit_packs").insert({
      user_id: userId,
      kind: entry.pack,
      units_total: PACK_UNITS,
      units_remaining: PACK_UNITS,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: idFrom(session.payment_intent) || null,
      expires_at: new Date(Date.now() + PACK_EXPIRES_DAYS * 86_400_000).toISOString(),
    });
    if (error && !error.message.toLowerCase().includes("duplicate") && error.code !== "23505") {
      throw error;
    }
    return;
  }

  if (session.mode === "subscription") {
    const subscriptionId = idFrom(session.subscription);
    if (subscriptionId) {
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
      await upsertSubscriptionRow(userId, customerId, subscription, lookupKey);
    }
    await syncStripeCustomer(customerId);
  }
}

async function upsertSubscriptionRow(
  userId: string,
  customerId: string,
  subscription: Stripe.Subscription,
  lookupKeyHint?: string,
) {
  const lookupKey = lookupKeyHint || lookupKeyFromSubscription(subscription);
  const entry = catalogByLookupKey(lookupKey);
  const plan = entry?.plan ?? null;
  const period = periodUnix(subscription);
  const admin = createAdminSupabase();
  const { error } = await admin.from("billing_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: idFrom(subscription.items.data[0]?.price) || "",
      lookup_key: lookupKey || "unknown",
      plan: plan ?? "studio",
      status: subscription.status,
      cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
      current_period_start: isoFromUnix(period.start),
      current_period_end: isoFromUnix(period.end),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw error;
}

export async function syncStripeCustomer(customerId: string) {
  if (!customerId) return;
  const userId = await userIdForCustomer(customerId);
  if (!userId) return;

  const stripe = getStripe();
  const list = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 20 });
  const plans: PlanId[] = [];
  for (const subscription of list.data) {
    await upsertSubscriptionRow(userId, customerId, subscription);
    if (subscription.status === "active" || subscription.status === "trialing") {
      const key = lookupKeyFromSubscription(subscription);
      const plan = catalogByLookupKey(key)?.plan;
      if (plan) plans.push(plan);
    }
  }
  const plan = highestPlan(plans) ?? "none";
  const admin = createAdminSupabase();
  const { error } = await admin.from("profiles").update({ plan }).eq("id", userId);
  if (error) throw error;
}

export async function handleBillingEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.purpose === "billing") {
      await fulfillBillingSession(session);
    }
    return;
  }
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    await syncStripeCustomer(idFrom(subscription.customer));
    return;
  }
  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice & { customer?: string | { id?: string } };
    await syncStripeCustomer(idFrom(invoice.customer));
  }
}

export async function fulfillCheckoutSessionById(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  await fulfillBillingSession(session);
  return session;
}
