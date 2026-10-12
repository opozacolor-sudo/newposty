import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  canUseLeads,
  type PackKind,
  type EffectivePlan,
  leadsIncludedFor,
} from "@/lib/stripe-catalog";

export type ConsumedCredit = { packId: string; remaining: number };

function asRows<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function remainingCredits(userId: string, kind: PackKind) {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("credit_packs")
    .select("units_remaining")
    .eq("user_id", userId)
    .eq("kind", kind)
    .gt("units_remaining", 0)
    .gt("expires_at", new Date().toISOString());
  return asRows<{ units_remaining: number }>(data).reduce(
    (sum, row) => sum + Number(row.units_remaining ?? 0),
    0,
  );
}

export async function consumeCredit(userId: string, kind: PackKind): Promise<ConsumedCredit | null> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("consume_credit_pack", {
    p_user_id: userId,
    p_kind: kind,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") return null;
  const packId = (row as { pack_id?: string }).pack_id;
  const remaining = (row as { units_remaining?: number }).units_remaining;
  if (!packId) return null;
  return { packId, remaining: Number(remaining ?? 0) };
}

export async function refundCredit(packId: string) {
  const admin = createAdminSupabase();
  const { error } = await admin.rpc("refund_credit_pack", { p_pack_id: packId });
  if (error) throw error;
}

export function calendarMonthStartUtc(now = new Date()) {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export async function loadLeadPeriodStart(userId: string) {
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("billing_subscriptions")
    .select("current_period_start")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();
  const raw = data?.current_period_start;
  if (typeof raw === "string" && raw.length >= 10) return raw.slice(0, 10);
  return calendarMonthStartUtc();
}

export async function leadsIncludedRemaining(userId: string, plan: EffectivePlan) {
  const included = leadsIncludedFor(plan);
  if (included <= 0) return 0;
  const periodStart = await loadLeadPeriodStart(userId);
  const admin = createAdminSupabase();
  const { data } = await admin
    .from("plan_usage")
    .select("leads_used")
    .eq("user_id", userId)
    .eq("period_start", periodStart)
    .maybeSingle();
  return Math.max(0, included - Number(data?.leads_used ?? 0));
}

export async function takeLeadSlot(userId: string, plan: EffectivePlan) {
  if (!canUseLeads(plan)) return false;
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("take_lead_slot", {
    p_user_id: userId,
    p_included: leadsIncludedFor(plan),
    p_period_start: await loadLeadPeriodStart(userId),
  });
  if (error) throw error;
  return data === "included" || data === "pack";
}
