import { notFound } from "next/navigation";
import { PlatformAnalyticsDetail } from "@/components/studio/platform-analytics-detail";
import { requireUser } from "@/lib/data";
import { PLATFORMS, isPlatformId } from "@/lib/platforms";

export default async function DashboardPlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ platform: string }>;
  searchParams: Promise<{ account?: string }>;
}) {
  const { platform } = await params;
  const { account } = await searchParams;
  if (!isPlatformId(platform)) notFound();
  const visual = PLATFORMS.find((item) => item.id === platform);
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
  if (!selected) notFound();

  const accountLabel = selected.username
    ? `@${String(selected.username).replace(/^@/, "")}`
    : (selected.display_name ?? visual.label);

  return (
    <PlatformAnalyticsDetail
      platform={visual}
      accountId={selected.id}
      accountLabel={accountLabel}
    />
  );
}
