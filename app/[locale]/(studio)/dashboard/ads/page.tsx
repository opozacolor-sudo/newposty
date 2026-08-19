import { getTranslations } from "next-intl/server";
import { PlatformStatsCards } from "@/components/studio/platform-stats-cards";
import { requireUser } from "@/lib/data";
import { isAdsPlatformId } from "@/lib/platforms";

export default async function DashboardAdsPage() {
  const t = await getTranslations("Dashboard");
  const { supabase, user } = await requireUser();

  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const adsAccounts = (accounts ?? []).filter((account) =>
    isAdsPlatformId(String(account.platform)),
  );

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("adsTitle")}</h1>

      <section className="mt-8">
        <PlatformStatsCards
          variant="ads"
          accounts={adsAccounts.map((account) => ({
            id: account.id,
            platform: String(account.platform),
            username: account.username,
            display_name: account.display_name,
          }))}
        />
      </section>
    </main>
  );
}
