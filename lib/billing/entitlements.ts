import { createAdminSupabase } from "@/lib/supabase/admin";
import { ADS_PLATFORMS } from "@/lib/platforms";
import {
  adsAccountsMax,
  canUseAds,
  canUseLeads,
  effectivePlan,
  type EffectivePlan,
} from "@/lib/stripe-catalog";
import { remainingCredits } from "@/lib/billing/credits";

export type ProfileBilling = {
  lifetime: boolean;
  plan: EffectivePlan;
  storedPlan: string;
  stripeCustomerId: string | null;
};

export async function loadProfileBilling(userId: string): Promise<ProfileBilling> {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("profiles")
    .select("lifetime_access, plan, stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();
  const storedPlan = typeof data?.plan === "string" ? data.plan : "none";
  return {
    lifetime: Boolean(data?.lifetime_access),
    plan: effectivePlan(Boolean(data?.lifetime_access), storedPlan),
    storedPlan,
    stripeCustomerId: typeof data?.stripe_customer_id === "string" ? data.stripe_customer_id : null,
  };
}

export async function countAdsAccounts(
  userId: string,
  clientId: string | null,
  isTeam: boolean,
) {
  const admin = createAdminSupabase();
  let query = admin
    .from("social_accounts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true)
    .in(
      "platform",
      ADS_PLATFORMS.map((platform) => platform.id),
    );
  query = isTeam
    ? query.eq("client_id", clientId ?? "00000000-0000-0000-0000-000000000000")
    : query.is("client_id", null);
  const { count } = await query;
  return count ?? 0;
}

export async function assertAdsConnectAllowed(input: {
  userId: string;
  clientId: string | null;
  isTeam: boolean;
}): Promise<"ok" | "plan_ads" | "ads_limit"> {
  const billing = await loadProfileBilling(input.userId);
  if (!canUseAds(billing.plan)) return "plan_ads";
  const used = await countAdsAccounts(input.userId, input.clientId, input.isTeam);
  if (used >= adsAccountsMax(billing.plan)) return "ads_limit";
  return "ok";
}

export async function loadBillingSnapshot(userId: string) {
  const billing = await loadProfileBilling(userId);
  const [photos, videos] = await Promise.all([
    remainingCredits(userId, "image"),
    remainingCredits(userId, "video"),
  ]);
  return {
    ...billing,
    canAds: canUseAds(billing.plan),
    canLeads: canUseLeads(billing.plan),
    credits: { photos, videos },
  };
}
