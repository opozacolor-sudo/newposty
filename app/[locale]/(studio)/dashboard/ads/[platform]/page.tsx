import { notFound } from "next/navigation";
import { AdsAnalyticsDetail } from "@/components/studio/ads-analytics-detail";
import { requireUser } from "@/lib/data";
import { ADS_PLATFORMS, isAdsPlatformId } from "@/lib/platforms";

export default async function DashboardAdsPlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ account?: string }>;
}) {
  const { platform } = await params;
  const { account } = await searchParams;
  if (!isAdsPlatformId(platform)) notFound();
  const visual = ADS_PLATFORMS.find((item) => item.id === platform);
  if (!visual) notFound();

  const { supabase, user } = await requireUser();
  let query = supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("platform", platform)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });
  if (account) query = query.eq("id", account);

  const { data: accounts } = await query;
  const selected = accounts?.[0];
  const accountLabel = selected
    ? selected.username
      ? `@${String(selected.username).replace(/^@/, "")}`
      : (selected.display_name ?? visual.label)
    : visual.label;

  return (
    <AdsAnalyticsDetail
      platform={visual}
      accountId={selected?.id ?? null}
      accountLabel={accountLabel}
    />
  );
}
