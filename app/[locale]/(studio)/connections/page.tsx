import { getTranslations } from "next-intl/server";
import { ConnectionList } from "@/components/studio/connection-list";
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

      <div className="mx-auto mt-4 max-w-xl">
        <ConnectionList
          title={t("socialHeading")}
          disconnectLabel={t("disconnect")}
          connectLabel={t("connect")}
          items={PLATFORMS.map((platform) => ({
            id: platform.id,
            label: platform.label,
            brand: platform.brand,
            iconBg: platform.iconBg,
            iconPath: platform.icon.path,
            connectHref: `/api/connect?platform=${platform.id}`,
            comingSoon: isConnectDisabled(platform.id) ? t("comingSoon") : undefined,
            accounts: (byPlatform.get(platform.id) ?? []).map((account) => ({
              id: account.id,
              username: account.username,
              display_name: account.display_name,
            })),
          }))}
        />
        <div id="promotions">
          <ConnectionList
            title={t("adsHeading")}
            disconnectLabel={t("disconnect")}
            connectLabel={t("connect")}
            items={ADS_PLATFORMS.map((platform) => ({
              id: platform.id,
              label: platform.label,
              brand: platform.brand,
              iconBg: platform.iconBg,
              iconPath: platform.icon.path,
              connectHref: `/api/connect?platform=${platform.id}&force=1`,
              comingSoon: isConnectDisabled(platform.id) ? t("comingSoon") : undefined,
              accounts: (byPlatform.get(platform.id) ?? []).map((account) => ({
                id: account.id,
                username: account.username,
                display_name: account.display_name,
              })),
            }))}
          />
        </div>
      </div>
    </main>
  );
}
