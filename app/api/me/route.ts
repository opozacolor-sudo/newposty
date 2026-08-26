import { NextResponse } from "next/server";
import { resolveStudioAccess } from "@/lib/access";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, lifetime_access, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const access = resolveStudioAccess(profile);
  let lifetimeTranche: number | null = null;
  try {
    const admin = createAdminSupabase();
    const { data: purchase } = await admin
      .from("presale_purchases")
      .select("tranche")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (typeof purchase?.tranche === "number") lifetimeTranche = purchase.tranche;
  } catch {
    lifetimeTranche = null;
  }

  return NextResponse.json({
    email: profile?.email ?? user.email,
    lifetimeAccess: access.lifetime,
    access: access.kind,
    allowed: access.allowed,
    createdAt: profile?.created_at ?? user.created_at,
    lifetimeTranche,
  });
}
