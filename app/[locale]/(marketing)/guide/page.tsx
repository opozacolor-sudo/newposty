import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { GuideArticle } from "@/components/guide/guide-article";
import { getGuide } from "@/lib/guide-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Guide" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function GuidePage() {
  const locale = await getLocale();
  return <GuideArticle guide={getGuide(locale)} variant="marketing" />;
}
