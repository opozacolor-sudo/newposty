import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { StudioChrome } from "@/components/studio/chrome";
import { TeamGate } from "@/components/studio/team-gate";
import { loadWorkspace } from "@/lib/clients";
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

  const workspace = await loadWorkspace(supabase, user.id);

  return (
    <StudioChrome
      email={user.email ?? ""}
      accountKind={workspace.kind}
      clients={workspace.clients}
      selectedClientId={workspace.clientId}
    >
      <TeamGate needsClient={workspace.isTeam && !workspace.clientId}>{children}</TeamGate>
    </StudioChrome>
  );
}
