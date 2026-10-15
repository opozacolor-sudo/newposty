import { NextResponse } from "next/server";
import { grantLaunchPromo } from "@/lib/billing/promo";
import { INVITE_SIGNUP } from "@/lib/flags";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!INVITE_SIGNUP) return NextResponse.json({ error: "Closed" }, { status: 404 });
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await grantLaunchPromo(user.id);
  return NextResponse.json({ ok: true });
}
