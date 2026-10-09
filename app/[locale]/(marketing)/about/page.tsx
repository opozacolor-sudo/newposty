import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { pageBody, pageH2, pageTitle } from "@/components/marketing/styles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: `${t("title")} | posty.now` };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <MarketingPageFrame>
      <h1 className={pageTitle}>{t("title")}</h1>
      <p className={`mt-6 ${pageBody}`}>{t("p1")}</p>
      <h2 className={`mt-10 ${pageH2}`}>{t("bulkTitle")}</h2>
      <p className={`mt-3 ${pageBody}`}>{t("bulkBody")}</p>
      <h2 className={`mt-10 ${pageH2}`}>{t("timeTitle")}</h2>
      <p className={`mt-3 ${pageBody}`}>{t("timeBody")}</p>
      <h2 className={`mt-10 ${pageH2}`}>{t("studioTitle")}</h2>
      <p className={`mt-3 ${pageBody}`}>{t("studioBody")}</p>
      <p className="mt-10 text-lg font-medium leading-8 text-[#1d1d1f]">{t("close")}</p>
    </MarketingPageFrame>
  );
}
