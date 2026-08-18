import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ensureZernioProfile, requireUser, syncSocialAccounts } from "@/lib/data";

export default async function ConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const { user } = await requireUser();
  const params = await searchParams;
  const profile = await ensureZernioProfile(user.id, user.email);
  if (profile.zernio_profile_id) {
    await syncSocialAccounts(user.id, profile.zernio_profile_id);
  }
  const target = new URLSearchParams({ connected: "1" });
  if (params.platform) target.set("platform", params.platform);
  const locale = await getLocale();
  redirect({ href: `/accounts?${target.toString()}`, locale });
}
