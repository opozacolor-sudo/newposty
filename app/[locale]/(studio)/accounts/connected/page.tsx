import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { loadWorkspace } from "@/lib/clients";
import { ensureZernioProfile, requireUser, syncSocialAccounts } from "@/lib/data";
import { oauthClientCookieName, oauthStateCookieName } from "@/lib/oauth-state";
import { isAdsPlatformId } from "@/lib/platforms";

export default async function ConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; state?: string }>;
}) {
  const { user, supabase } = await requireUser();
  const params = await searchParams;
  const expected = (await cookies()).get(oauthStateCookieName())?.value;
  if (!params.state || !expected || params.state !== expected) {
    const locale = await getLocale();
    redirect({ href: "/accounts/posts?error=oauth_state", locale });
  }
  const profile = await ensureZernioProfile(user.id, user.email);
  if (profile.zernio_profile_id) {
    const workspace = await loadWorkspace(supabase, user.id);
    const cookieClient = (await cookies()).get(oauthClientCookieName())?.value ?? null;
    const clientId =
      workspace.isTeam && cookieClient && workspace.clients.some((client) => client.id === cookieClient)
        ? cookieClient
        : workspace.clientId;
    await syncSocialAccounts(user.id, profile.zernio_profile_id, clientId);
  }
  const target = new URLSearchParams({ connected: "1" });
  if (params.platform) target.set("platform", params.platform);
  const locale = await getLocale();
  const href = isAdsPlatformId(params.platform ?? "")
    ? `/accounts/ads?${target.toString()}`
    : `/accounts/posts?${target.toString()}`;
  redirect({ href, locale });
}
