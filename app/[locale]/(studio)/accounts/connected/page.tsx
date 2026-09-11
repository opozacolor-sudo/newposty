import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { loadWorkspace } from "@/lib/clients";
import { ensureZernioProfile, syncSocialAccounts } from "@/lib/data";
import { oauthClientCookieName, oauthStateCookieName, readOAuthState } from "@/lib/oauth-state";
import { isAdsPlatformId } from "@/lib/platforms";
import { createServerSupabase } from "@/lib/supabase/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function ConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; state?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const signed = readOAuthState(params.state);
  const cookieState = (await cookies()).get(oauthStateCookieName())?.value ?? null;
  const cookieMatches = Boolean(params.state && cookieState && params.state === cookieState);

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const next = `/accounts/connected?${new URLSearchParams({
      ...(params.platform ? { platform: params.platform } : {}),
      ...(params.state ? { state: params.state } : {}),
    }).toString()}`;
    redirect({ href: `/login?next=${encodeURIComponent(next)}`, locale });
    return;
  }

  if ((signed && signed.userId !== user.id) || (!signed && !cookieMatches)) {
    redirect({ href: "/accounts/posts?error=oauth_state", locale });
  }

  const platform = signed?.platform || params.platform || "";
  const profile = await ensureZernioProfile(user.id, user.email);
  if (profile.zernio_profile_id) {
    const workspace = await loadWorkspace(supabase, user.id);
    const cookieClient = (await cookies()).get(oauthClientCookieName())?.value ?? null;
    const clientId =
      signed?.clientId ??
      (workspace.isTeam && cookieClient && workspace.clients.some((client) => client.id === cookieClient)
        ? cookieClient
        : workspace.clientId);
    let accounts = await syncSocialAccounts(user.id, profile.zernio_profile_id, clientId);
    if (platform && !accounts.some((account) => String(account.platform) === platform && account.is_active !== false)) {
      await sleep(1500);
      await syncSocialAccounts(user.id, profile.zernio_profile_id, clientId);
    }
  }

  const target = new URLSearchParams({ connected: "1" });
  if (platform) target.set("platform", platform);
  const href = isAdsPlatformId(platform)
    ? `/accounts/ads?${target.toString()}`
    : `/accounts/posts?${target.toString()}`;
  redirect({ href, locale });
}
