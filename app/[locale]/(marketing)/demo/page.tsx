import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DemoHubView } from "@/components/demo/demo-views";
import { MarketingPageFrame } from "@/components/marketing/page-frame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Demo" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <MarketingPageFrame wide>
      <DemoHubView locale={locale} variant="marketing" />
    </MarketingPageFrame>
  );
}
