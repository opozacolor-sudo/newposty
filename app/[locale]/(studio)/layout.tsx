import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { StudioSidebar } from "@/components/studio/sidebar";
import { resolveStudioAccess } from "@/lib/access";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("lifetime_access")
    .eq("id", user.id)
    .maybeSingle();
  const access = resolveStudioAccess(profile);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#1A1A1A] lg:h-dvh lg:flex-row lg:overflow-hidden">
      <StudioSidebar email={user.email ?? ""} lifetime={access.lifetime} />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:h-full lg:overflow-hidden">{children}</div>
    </div>
  );
}
