import { getTranslations } from "next-intl/server";
import { AccountCard } from "@/components/studio/account-card";
import { requireUser } from "@/lib/data";
import { ADS_PLATFORMS, platformLabel } from "@/lib/platforms";

export default async function AccountsAdsPage({
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

  const errorMessage =
    params.error === "need_x"
      ? t("adsNeedXFirst")
      : params.error === "openai_key"
        ? t("openaiIntro")
        : params.error;

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("adsTitle")}</h1>

      {params.connected ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-good">
          {params.platform
            ? t("adsConnectedNamed", { platform: platformLabel(params.platform) })
            : t("adsConnectedGeneric")}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-accent">
          {errorMessage}
        </p>
      ) : null}

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {ADS_PLATFORMS.map((platform) => {
          const connected = byPlatform.get(platform.id) ?? [];
          const audienceRow =
            platform.audienceBadge === "readonly"
              ? {
                  label: t("audiences"),
                  value: t("audiencesReadonly"),
                  badge: t("audiencesReadonly"),
                  tooltip: t("audiencesReadonlyTooltip"),
                }
              : platform.audienceBadge === "unavailable"
                ? {
                    label: t("audiences"),
                    value: t("audiencesUnavailable"),
                    badge: t("audiencesUnavailable"),
                    tooltip:
                      platform.id === "googleads"
                        ? t("audiencesUnavailableTooltipGoogle")
                        : t("audiencesUnavailableTooltipX"),
                  }
                : {
                    label: t("audiences"),
                    value: t(`adsAudiences.${platform.id}`),
                  };

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
                { label: t("canCreate"), value: t(`adsCanCreate.${platform.id}`) },
                { label: t("boost"), value: t(`adsBoost.${platform.id}`) },
                audienceRow,
                {
                  label: t("stats"),
                  value: t(`adsStats.${platform.id}`),
                },
              ]}
              newBadge={platform.isNew ? t("newBadge") : undefined}
              footerNote={
                platform.id === "openaiads" ? t("adsNote.openaiads") : undefined
              }
              connectForce
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
