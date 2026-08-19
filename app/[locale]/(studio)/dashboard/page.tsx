import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function DashboardIndexPage() {
  const locale = await getLocale();
  redirect({ href: "/dashboard/posts", locale });
}
