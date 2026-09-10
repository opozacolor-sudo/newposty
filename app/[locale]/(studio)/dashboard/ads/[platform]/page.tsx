import { notFound } from "next/navigation";
import { AdsAnalyticsDetail } from "@/components/studio/ads-analytics-detail";
import { applyClientScope, asRows, loadWorkspace } from "@/lib/clients";
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
  const workspace = await loadWorkspace(supabase, user.id);
  let query = applyClientScope(
    supabase
      .from("social_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("is_active", true),
    workspace,
  ).order("connected_at", { ascending: false });
  if (account) query = query.eq("id", account);

  const { data } = await query;
  const accounts = asRows<{
    id: string;
    username: string | null;
    display_name: string | null;
  }>(data);
  const selected = accounts[0];
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
