import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export default async function AccountsPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const locale = await getLocale();
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  const suffix = query.toString();
  redirect({ href: suffix ? `/connections?${suffix}` : "/connections", locale });
}
