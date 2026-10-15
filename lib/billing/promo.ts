import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  PROMO_PHOTO_UNITS,
  PROMO_UNTIL_ISO,
  PROMO_VIDEO_UNITS,
  promoCreditSessionId,
  promoStillOpen,
} from "@/lib/promo";

export async function grantLaunchPromo(userId: string) {
  if (!userId || !promoStillOpen()) return false;
  const admin = createAdminSupabase();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, lifetime_access, promo_until")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return false;

  if (!profile.promo_until) {
    const { error } = await admin
      .from("profiles")
      .update({ promo_until: PROMO_UNTIL_ISO })
      .eq("id", userId)
      .is("promo_until", null);
    if (error) throw error;
  }

  for (const kind of ["image", "video"] as const) {
    const units = kind === "image" ? PROMO_PHOTO_UNITS : PROMO_VIDEO_UNITS;
    const { error } = await admin.from("credit_packs").insert({
      user_id: userId,
      kind,
      units_total: units,
      units_remaining: units,
      stripe_checkout_session_id: promoCreditSessionId(userId, kind),
      expires_at: PROMO_UNTIL_ISO,
    });
    if (error && error.code !== "23505" && !error.message.toLowerCase().includes("duplicate")) {
      throw error;
    }
  }
  return true;
}
