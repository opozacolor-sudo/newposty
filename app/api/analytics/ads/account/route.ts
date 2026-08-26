import { NextResponse } from "next/server";
import { getOwnedSocialAccount, getZernioProfileId } from "@/lib/account-server";
import { loadAdsAccountAnalytics } from "@/lib/ads-analytics";
import { isValidYmd, rangeFromPreset } from "@/lib/analytics-shared";
import { isAdsPlatformId } from "@/lib/platforms";
import { getRequestAuth } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId") ?? "";
  const preset = url.searchParams.get("range");
  let from = url.searchParams.get("from") ?? "";
  let to = url.searchParams.get("to") ?? "";
  if (preset === "7" || preset === "30" || preset === "90") {
    const range = rangeFromPreset(Number(preset) as 7 | 30 | 90);
    from = range.from;
    to = range.to;
  }
  if (!isValidYmd(from) || !isValidYmd(to) || from > to) {
    const range = rangeFromPreset(30);
    from = range.from;
    to = range.to;
  }

  const account = await getOwnedSocialAccount(user.id, accountId);
  if (
    !account ||
    !isAdsPlatformId(String(account.platform)) ||
    typeof account.zernio_account_id !== "string"
  ) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const profileId = await getZernioProfileId(user.id);
  if (!profileId) {
    return NextResponse.json({ error: "Profile is not ready" }, { status: 409 });
  }

  try {
    const analytics = await loadAdsAccountAnalytics({
      accountId: account.zernio_account_id,
      platform: String(account.platform),
      from,
      to,
    });
    return NextResponse.json(
      { from, to, ...analytics },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analytics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
