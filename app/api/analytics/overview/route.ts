import { NextResponse } from "next/server";
import { loadOverviewCards } from "@/lib/analytics";
import { getZernioProfileId, listActiveSocialAccounts } from "@/lib/account-server";
import { isPlatformId, platformHasLimitedStats } from "@/lib/platforms";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  const { user } = await getRequestAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let accounts: Awaited<ReturnType<typeof listActiveSocialAccounts>>;
  try {
    accounts = await listActiveSocialAccounts(user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load accounts";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const posting = accounts.filter(
    (account) =>
      isPlatformId(String(account.platform)) && typeof account.zernio_account_id === "string",
  ) as Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>;

  const profileId = await getZernioProfileId(user.id);
  if (!profileId) {
    return NextResponse.json(
      {
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
      },
      noStore,
    );
  }

  try {
    const cards = await loadOverviewCards(profileId, posting);
    return NextResponse.json({ cards }, noStore);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analytics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
