import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ensureZernioProfile, requireUser, syncSocialAccounts } from "@/lib/data";
import { oauthStateCookieName } from "@/lib/oauth-state";
import { isAdsPlatformId } from "@/lib/platforms";

export default async function ConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; state?: string }>;
}) {
  const { user } = await requireUser();
  const params = await searchParams;
  const expected = (await cookies()).get(oauthStateCookieName())?.value;
  if (!params.state || !expected || params.state !== expected) {
    const locale = await getLocale();
    redirect({ href: "/accounts/posts?error=oauth_state", locale });
  }
  const profile = await ensureZernioProfile(user.id, user.email);
  if (profile.zernio_profile_id) {
    await syncSocialAccounts(user.id, profile.zernio_profile_id);
  }
  const target = new URLSearchParams({ connected: "1" });
  if (params.platform) target.set("platform", params.platform);
  const locale = await getLocale();
  const href = isAdsPlatformId(params.platform ?? "")
    ? `/accounts/ads?${target.toString()}`
    : `/accounts/posts?${target.toString()}`;
  redirect({ href, locale });
}
