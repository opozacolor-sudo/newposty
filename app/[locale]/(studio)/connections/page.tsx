import { getTranslations } from "next-intl/server";
import { AccountCard } from "@/components/studio/account-card";
import { applyClientScope, asRows, loadWorkspace } from "@/lib/clients";
import { requireUser } from "@/lib/data";
import {
  ADS_PLATFORMS,
  PLATFORMS,
  isConnectDisabled,
  platformLabel,
} from "@/lib/platforms";

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; platform?: string; section?: string }>;
}) {
  const t = await getTranslations("Accounts");
  const { supabase, user } = await requireUser();
  const params = await searchParams;
  const workspace = await loadWorkspace(supabase, user.id);
  const { data } = await applyClientScope(
    supabase.from("social_accounts").select("*").eq("user_id", user.id).eq("is_active", true),
    workspace,
  ).order("connected_at", { ascending: false });
  const accounts = asRows<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
  }>(data);

  const byPlatform = new Map<string, typeof accounts>();
  for (const account of accounts) {
    const current = byPlatform.get(account.platform) ?? [];
    current.push(account);
    byPlatform.set(account.platform, current);
  }

  const errorMessage =
    params.error === "need_x"
      ? t("adsNeedXFirst")
      : params.error === "openai_key"
        ? t("openaiIntro")
        : params.error === "coming_soon"
          ? t("comingSoon")
          : params.error === "need_client"
            ? t("needClient")
            : params.error === "oauth_state"
              ? t("oauthState")
              : params.error
                ? t("connectFailed")
                : null;

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("connectionsTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("connectionsLead")}</p>

      {params.connected ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-good">
          {params.platform
            ? t("connectedNamed", { platform: platformLabel(params.platform) })
            : t("connectedGeneric")}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-accent">
          {errorMessage}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PLATFORMS.map((platform) => {
            const connected = byPlatform.get(platform.id) ?? [];
            return (
              <AccountCard
                key={platform.id}
                platform={platform}
                accounts={connected.map((account) => ({
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
                        note: platform.id === "bluesky" ? t("statsLimitedNoteBluesky") : undefined,
                      }
                    : { label: t("stats"), value: t("statsComplete") },
                ]}
                connectLabel={t("connect")}
                anotherLabel={t("connectAnother")}
                notConnectedLabel={t("notConnected")}
                connectedLabel={t("statusConnected")}
                disconnectLabel={t("disconnect")}
                comingSoonLabel={isConnectDisabled(platform.id) ? t("comingSoon") : undefined}
              />
            );
          })}
        </ul>
      </section>

      <section id="promotions" className="mt-12">
        <h2 className="text-lg font-semibold">{t("adsTitle")}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  : { label: t("audiences"), value: t(`adsAudiences.${platform.id}`) };

            return (
              <AccountCard
                key={platform.id}
                platform={platform}
                accounts={connected.map((account) => ({
                  id: account.id,
                  username: account.username,
                  display_name: account.display_name,
                }))}
                rows={[
                  { label: t("canCreate"), value: t(`adsCanCreate.${platform.id}`) },
                  { label: t("boost"), value: t(`adsBoost.${platform.id}`) },
                  audienceRow,
                  { label: t("stats"), value: t(`adsStats.${platform.id}`) },
                ]}
                newBadge={platform.isNew ? t("newBadge") : undefined}
                footerNote={platform.id === "openaiads" ? t("adsNote.openaiads") : undefined}
                connectForce
                connectLabel={t("connect")}
                anotherLabel={t("connectAnother")}
                notConnectedLabel={t("notConnected")}
                connectedLabel={t("statusConnected")}
                disconnectLabel={t("disconnect")}
                comingSoonLabel={isConnectDisabled(platform.id) ? t("comingSoon") : undefined}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}
