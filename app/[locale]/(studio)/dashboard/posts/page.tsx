import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function DashboardPostsPage() {
  const locale = await getLocale();
  redirect({ href: "/posts", locale });
}
