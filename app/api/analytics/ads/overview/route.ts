import { NextResponse } from "next/server";
import { loadAdsOverviewCards } from "@/lib/ads-analytics";
import { getProfile } from "@/lib/data";
import { isAdsPlatformId } from "@/lib/platforms";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: accounts, error } = await supabase
    .from("social_accounts")
    .select("id, platform, username, display_name, zernio_account_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const adsAccounts = (accounts ?? []).filter(
    (account) =>
      isAdsPlatformId(String(account.platform)) &&
      typeof account.zernio_account_id === "string",
  ) as Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>;

  const profile = await getProfile(user.id);
  if (!profile?.zernio_profile_id) {
    return NextResponse.json({
      cards: adsAccounts.map((account) => ({
        accountId: account.id,
        platform: account.platform,
        username: account.username,
        displayName: account.display_name,
        posts30d: null,
        engagement30d: null,
        followers: null,
        campaigns30d: null,
        spend30d: null,
        impressions30d: null,
        limited: false,
      })),
    });
  }

  try {
    const cards = await loadAdsOverviewCards(adsAccounts);
    return NextResponse.json({ cards });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analytics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
