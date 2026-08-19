import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function AccountsIndexPage() {
  const locale = await getLocale();
  redirect({ href: "/accounts/posts", locale });
}
