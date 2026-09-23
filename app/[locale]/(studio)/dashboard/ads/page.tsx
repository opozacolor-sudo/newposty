import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function DashboardAdsPage() {
  const locale = await getLocale();
  redirect({ href: "/ads", locale });
}
