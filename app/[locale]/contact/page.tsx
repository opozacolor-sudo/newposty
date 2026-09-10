import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingShell } from "@/components/marketing/shell";
import { StudioChrome } from "@/components/studio/chrome";
import { loadWorkspace } from "@/lib/clients";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const content = (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500">
        {t("subtitle")}
      </p>
      <ContactForm defaultEmail={user?.email ?? ""} />
    </section>
  );

  if (user) {
    const workspace = await loadWorkspace(supabase, user.id);
    return (
      <StudioChrome
        email={user.email ?? ""}
        accountKind={workspace.kind}
        clients={workspace.clients}
        selectedClientId={workspace.clientId}
      >
        {content}
      </StudioChrome>
    );
  }

  return <MarketingShell>{content}</MarketingShell>;
}
