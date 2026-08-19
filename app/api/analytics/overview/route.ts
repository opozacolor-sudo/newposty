import { NextResponse } from "next/server";
import { loadOverviewCards } from "@/lib/analytics";
import { getProfile } from "@/lib/data";
import { isPlatformId, platformHasLimitedStats } from "@/lib/platforms";
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

  const posting = (accounts ?? []).filter(
    (account) =>
      isPlatformId(String(account.platform)) &&
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
      cards: posting.map((account) => ({
        accountId: account.id,
        platform: account.platform,
        username: account.username,
        displayName: account.display_name,
        posts30d: null,
        engagement30d: null,
        followers: null,
        limited: platformHasLimitedStats(account.platform),
      })),
    });
  }

  try {
    const cards = await loadOverviewCards(profile.zernio_profile_id, posting);
    return NextResponse.json({ cards });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analytics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
