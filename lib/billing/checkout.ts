import { getTrustedRequestOrigin } from "@/lib/env";
import { getStripe } from "@/lib/presale-server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  canUseLeads,
  catalogByLookupKey,
  isCatalogLookupKey,
  type CatalogLookupKey,
} from "@/lib/stripe-catalog";
import { loadProfileBilling } from "@/lib/billing/entitlements";
import { billingCopy } from "@/lib/billing/copy";
import { isAppLocale } from "@/lib/locales";
import { syncStripeCustomer } from "@/lib/billing/sync";

export class BillingCheckoutError extends Error {
  constructor(
    public readonly code: "UNKNOWN_LOOKUP" | "PRICE_MISSING" | "LEADS_PACK_NEEDS_GROWTH" | "STRIPE",
    message: string,
  ) {
    super(message);
    this.name = "BillingCheckoutError";
  }
}

export async function getOrCreateStripeCustomer(user: { id: string; email?: string | null }) {
  const admin = createAdminSupabase();
  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id, email, billing_name")
    .eq("id", user.id)
    .maybeSingle();
  if (typeof profile?.stripe_customer_id === "string" && profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email || (typeof profile?.email === "string" ? profile.email : undefined) || undefined,
    name: typeof profile?.billing_name === "string" ? profile.billing_name : undefined,
    metadata: { user_id: user.id },
  });

  const { data: saved } = await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id)
    .is("stripe_customer_id", null)
    .select("stripe_customer_id")
    .maybeSingle();
  if (saved?.stripe_customer_id) return saved.stripe_customer_id as string;

  const { data: raced } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (typeof raced?.stripe_customer_id === "string" && raced.stripe_customer_id !== customer.id) {
    await stripe.customers.del(customer.id).catch(() => undefined);
    return raced.stripe_customer_id;
  }
  return customer.id;
}

export async function priceIdForLookupKey(lookupKey: string) {
  const stripe = getStripe();
  const list = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  const id = list.data[0]?.id;
  if (!id) throw new BillingCheckoutError("PRICE_MISSING", "Stripe price is missing for this lookup key.");
  return id;
}

export async function startBillingCheckout(input: {
  user: { id: string; email?: string | null };
  lookupKey: string;
  locale: string;
  request: Request;
}): Promise<{ url: string } | { updated: true }> {
  if (!isCatalogLookupKey(input.lookupKey)) {
    throw new BillingCheckoutError("UNKNOWN_LOOKUP", "Unknown price.");
  }
  const entry = catalogByLookupKey(input.lookupKey);
  if (!entry) throw new BillingCheckoutError("UNKNOWN_LOOKUP", "Unknown price.");

  const locale = isAppLocale(input.locale) ? input.locale : "en";
  const billing = await loadProfileBilling(input.user.id);
  if (entry.pack === "leads" && !canUseLeads(billing.plan)) {
    throw new BillingCheckoutError("LEADS_PACK_NEEDS_GROWTH", billingCopy(locale, "leadsPackNeedsGrowth"));
  }

  const customerId = await getOrCreateStripeCustomer(input.user);
  const priceId = await priceIdForLookupKey(input.lookupKey);
  const stripe = getStripe();

  if (entry.kind === "plan") {
    const existing = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });
    const current = existing.data[0];
    const itemId = current?.items.data[0]?.id;
    if (current && itemId) {
      await stripe.subscriptions.update(current.id, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: "create_prorations",
        metadata: { user_id: input.user.id, lookup_key: input.lookupKey, purpose: "billing" },
      });
      await syncStripeCustomer(customerId);
      return { updated: true };
    }
  }

  const origin = getTrustedRequestOrigin(input.request);
  const metadata = {
    purpose: "billing",
    user_id: input.user.id,
    lookup_key: input.lookupKey,
    locale,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: entry.kind === "plan" ? "subscription" : "payment",
      customer: customerId,
      client_reference_id: input.user.id,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/api/billing/return?session_id={CHECKOUT_SESSION_ID}&locale=${locale}`,
      cancel_url: `${origin}/${locale}/profile?billing=cancel`,
      metadata,
      ...(entry.kind === "plan"
        ? { subscription_data: { metadata } }
        : { payment_intent_data: { metadata } }),
    });
    if (!session.url) throw new BillingCheckoutError("STRIPE", "Checkout URL missing.");
    return { url: session.url };
  } catch (error) {
    if (error instanceof BillingCheckoutError) throw error;
    throw new BillingCheckoutError("STRIPE", error instanceof Error ? error.message : "Checkout failed.");
  }
}

export async function startBillingPortal(input: { userId: string; request: Request; locale: string }) {
  const billing = await loadProfileBilling(input.userId);
  if (!billing.stripeCustomerId) return null;
  const origin = getTrustedRequestOrigin(input.request);
  const locale = isAppLocale(input.locale) ? input.locale : "en";
  const session = await getStripe().billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: `${origin}/${locale}/profile`,
  });
  return session.url;
}

export type { CatalogLookupKey };
