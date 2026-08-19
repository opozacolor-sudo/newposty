import { getTranslations } from "next-intl/server";
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
      <p className="mt-2 max-w-xl text-sm text-muted">{t("intro")}</p>

      {params.connected ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-good">
          {params.platform
            ? t("connectedNamed", { platform: platformLabel(params.platform) })
            : t("connectedGeneric")}
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-accent">
          {params.error}
        </p>
      ) : null}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const connected = byPlatform.get(platform.id) ?? [];
          return (
            <li key={platform.id} className="rounded-2xl border border-line bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">{platform.label}</h2>
                  <p className="mt-1 text-sm text-muted">{t(`hints.${platform.id}`)}</p>
                </div>
                <a
                  href={`/api/connect?platform=${platform.id}`}
                  className="rounded-full bg-[#FF4713] px-3 py-2 text-xs text-white hover:bg-[#e03d0f]"
                >
                  {connected.length > 0 ? t("connectAnother") : t("connect")}
                </a>
              </div>
              {connected.length > 0 ? (
                <ul className="mt-4 space-y-1 text-sm">
                  {connected.map((account) => (
                    <li key={account.id} className="text-muted">
                      {account.username ?? account.display_name ?? t("connectedFallback")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">{t("notConnected")}</p>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
