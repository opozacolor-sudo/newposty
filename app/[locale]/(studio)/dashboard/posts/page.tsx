import { getTranslations } from "next-intl/server";
import { PlatformStatsCards } from "@/components/studio/platform-stats-cards";
import { applyClientScope, asRows, loadWorkspace } from "@/lib/clients";
import { requireUser } from "@/lib/data";
import { isPlatformId } from "@/lib/platforms";

export default async function DashboardPostsPage() {
  const t = await getTranslations("Dashboard");
  const { supabase, user } = await requireUser();

  const workspace = await loadWorkspace(supabase, user.id);
  const { data } = await applyClientScope(
    supabase.from("social_accounts").select("*").eq("user_id", user.id).eq("is_active", true),
    workspace,
  );
  const accounts = asRows<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
  }>(data);

  const postingAccounts = (accounts ?? []).filter((account) =>
    isPlatformId(String(account.platform)),
  );

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>

      <section className="mt-8">
        <PlatformStatsCards
          accounts={postingAccounts.map((account) => ({
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
