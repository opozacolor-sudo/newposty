import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });
  return {
    title: t("waitlistPageTitle"),
    description: t("waitlistPageSubtitle"),
  };
}

export default async function WaitlistPage() {
  const t = await getTranslations("Landing");

  return (
    <MarketingPageFrame>
      <p className={pageKicker}>{t("kicker")}</p>
      <h1 className={`mt-3 ${pageTitle}`}>{t("waitlistPageTitle")}</h1>
      <p className={pageLead}>{t("waitlistPageSubtitle")}</p>
      <WaitlistForm />
    </MarketingPageFrame>
  );
}
