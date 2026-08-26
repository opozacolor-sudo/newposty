import { computeLifetimeRefund } from "@/lib/billing";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getRequestAuth } from "@/lib/supabase/server";

export type BillingPurchase = {
  id: string;
  email: string;
  price_eur: number;
  created_at: string;
  registered_at: string | null;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  immediate_start_consent: boolean | null;
};

export async function requireAccountUser() {
  const { user, supabase } = await getRequestAuth();
  if (!user) return { user: null, supabase };
  return { user, supabase };
}

export async function countActiveSocialAccounts(userId: string) {
  const supabase = createAdminSupabase();
  const { count, error } = await supabase
    .from("social_accounts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true);
  if (error) throw error;
  return count ?? 0;
}

export async function listActiveSocialAccounts(userId: string) {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("social_accounts")
    .select("id, platform, username, display_name, zernio_account_id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getOwnedSocialAccount(userId: string, accountId: string) {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("social_accounts")
    .select("id, platform, username, display_name, zernio_account_id")
    .eq("user_id", userId)
    .eq("id", accountId)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

export async function getZernioProfileId(userId: string) {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("profiles")
    .select("zernio_profile_id")
    .eq("id", userId)
    .maybeSingle();
  return typeof data?.zernio_profile_id === "string" ? data.zernio_profile_id : null;
}

export async function loadLifetimePurchase(userId: string, email: string | undefined) {
  const admin = createAdminSupabase();
  const { data: byUser } = await admin
    .from("presale_purchases")
    .select(
      "id, email, price_eur, created_at, registered_at, stripe_customer_id, stripe_payment_intent_id, status, immediate_start_consent",
    )
    .eq("user_id", userId)
    .neq("status", "refunded")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (byUser) return byUser as BillingPurchase;

  const normalised = email?.trim().toLowerCase() ?? "";
  if (!normalised) return null;
  const { data: byEmail } = await admin
    .from("presale_purchases")
    .select(
      "id, email, price_eur, created_at, registered_at, stripe_customer_id, stripe_payment_intent_id, status, immediate_start_consent",
    )
    .eq("email", normalised)
    .neq("status", "refunded")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (byEmail as BillingPurchase | null) ?? null;
}

export function refundPreview(purchase: BillingPurchase, now = new Date()) {
  const startedAt = new Date(purchase.registered_at || purchase.created_at);
  return computeLifetimeRefund({
    paidEur: Number(purchase.price_eur),
    startedAt,
    now,
    consentedImmediateStart: Boolean(purchase.immediate_start_consent),
  });
}

export async function logBillingEvent(input: {
  userId?: string | null;
  email?: string | null;
  kind: "refund" | "cancel_subscription" | "delete_account";
  amountEur?: number | null;
  stripeRefundId?: string | null;
  detail?: Record<string, unknown>;
}) {
  const admin = createAdminSupabase();
  await admin.from("billing_events").insert({
    user_id: input.userId ?? null,
    email: input.email ?? null,
    kind: input.kind,
    amount_eur: input.amountEur ?? null,
    stripe_refund_id: input.stripeRefundId ?? null,
    detail: input.detail ?? {},
  });
}
