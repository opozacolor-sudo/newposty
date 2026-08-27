import { getTranslations } from "next-intl/server";
import { AccountCard } from "@/components/studio/account-card";
import { requireUser } from "@/lib/data";
import { PLATFORMS, platformLabel } from "@/lib/platforms";

export default async function AccountsPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; platform?: string }>;
}) {
  const t = await getTranslations("Accounts");
  const { supabase, user } = await requireUser();
  const params = await searchParams;
  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });

  const byPlatform = new Map<string, typeof accounts>();
  for (const account of accounts ?? []) {
    const current = byPlatform.get(account.platform as string) ?? [];
    current.push(account);
    byPlatform.set(account.platform as string, current);
  }

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>

      {params.connected ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-good">
          {params.platform
            ? t("connectedNamed", { platform: platformLabel(params.platform) })
            : t("connectedGeneric")}
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-accent">
          {params.error === "oauth_state"
            ? t("oauthState")
            : params.error === "connect_failed"
              ? t("connectFailed")
              : t("connectFailed")}
        </p>
      ) : null}

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const connected = byPlatform.get(platform.id) ?? [];
          return (
            <AccountCard
              key={platform.id}
              platform={platform}
              accounts={(connected ?? []).map((account) => ({
                id: account.id,
                username: account.username,
                display_name: account.display_name,
              }))}
              rows={[
                { label: t("canPost"), value: t(`canPostValues.${platform.id}`) },
                platform.stats === "limited"
                  ? {
                      label: t("stats"),
                      value: t("statsLimited"),
                      badge: t("statsLimited"),
                      tooltip: t("statsLimitedTooltip"),
                      note:
                        platform.id === "bluesky" ? t("statsLimitedNoteBluesky") : undefined,
                    }
                  : { label: t("stats"), value: t("statsComplete") },
              ]}
              connectLabel={t("connect")}
              anotherLabel={t("connectAnother")}
              notConnectedLabel={t("notConnected")}
              connectedLabel={t("statusConnected")}
              disconnectLabel={t("disconnect")}
            />
          );
        })}
      </ul>
    </main>
  );
}
