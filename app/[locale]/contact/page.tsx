import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { MarketingShell } from "@/components/marketing/shell";
import { pageLead, pageTitle } from "@/components/marketing/styles";
import { StudioChrome } from "@/components/studio/chrome";
import { loadWorkspace } from "@/lib/clients";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: `${t("title")} | posty.now` };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const copy = (
    <>
      <h1 className={`max-w-xl ${pageTitle}`}>{t("title")}</h1>
      <p className={`max-w-lg ${pageLead}`}>{t("subtitle")}</p>
      <ContactForm defaultEmail={user?.email ?? ""} />
    </>
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
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">{copy}</section>
      </StudioChrome>
    );
  }

  return (
    <MarketingShell>
      <MarketingPageFrame>{copy}</MarketingPageFrame>
    </MarketingShell>
  );
}
