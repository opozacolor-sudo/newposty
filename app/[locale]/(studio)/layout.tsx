import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { StudioChrome } from "@/components/studio/chrome";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    throw new Error("Unauthorized");
  }

  return <StudioChrome email={user.email ?? ""}>{children}</StudioChrome>;
}
