import { createAdminSupabase } from "@/lib/supabase/admin";
import { canUseLeads, type PackKind, type EffectivePlan } from "@/lib/stripe-catalog";

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

export async function takeLeadSlot(_userId: string, plan: EffectivePlan) {
  return canUseLeads(plan);
}
