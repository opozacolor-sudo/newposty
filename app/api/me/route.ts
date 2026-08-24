import { NextResponse } from "next/server";
import { resolveStudioAccess } from "@/lib/access";
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
    .select("email, lifetime_access")
    .eq("id", user.id)
    .maybeSingle();

  const access = resolveStudioAccess(profile);
  return NextResponse.json({
    email: profile?.email ?? user.email,
    lifetimeAccess: access.lifetime,
    access: access.kind,
    allowed: access.allowed,
  });
}
