import { getLocale, getTranslations } from "next-intl/server";
import { DemoHubView } from "@/components/demo/demo-views";
import { MarketingPageFrame } from "@/components/marketing/page-frame";

export async function generateMetadata() {
  const t = await getTranslations("Demo");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function StudioDemoPage() {
  const locale = await getLocale();
  return (
    <main className="h-full min-h-0 overflow-y-auto">
      <MarketingPageFrame wide>
        <DemoHubView locale={locale} variant="studio" />
      </MarketingPageFrame>
    </main>
  );
}
