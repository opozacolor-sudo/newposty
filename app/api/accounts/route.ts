import { NextResponse } from "next/server";
import { ensureZernioProfile, syncSocialAccounts } from "@/lib/data";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ACCOUNT_FIELDS = "id, platform, username, display_name, avatar_url, is_active, connected_at";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  const { user } = await getRequestAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("social_accounts")
    .select(ACCOUNT_FIELDS)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load accounts" }, { status: 500 });
  }

  return NextResponse.json({ accounts: data ?? [] }, noStore);
}

export async function POST() {
  const { user } = await getRequestAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await ensureZernioProfile(user.id, user.email);
    if (!profile.zernio_profile_id) {
      throw new Error("Missing Zernio profile");
    }
    const accounts = await syncSocialAccounts(user.id, profile.zernio_profile_id);
    return NextResponse.json(
      {
        accounts: accounts.map((account) => ({
          id: account.id,
          platform: account.platform,
          username: account.username,
          display_name: account.display_name,
          avatar_url: account.avatar_url,
          is_active: account.is_active,
          connected_at: account.connected_at,
        })),
      },
      noStore,
    );
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
