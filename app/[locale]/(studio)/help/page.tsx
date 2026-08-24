import { getLocale, getTranslations } from "next-intl/server";
import { GuideArticle } from "@/components/guide/guide-article";
import { getGuide } from "@/lib/guide-content";

export async function generateMetadata() {
  const t = await getTranslations("Guide");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function StudioHelpPage() {
  const locale = await getLocale();
  return (
    <main className="h-full overflow-y-auto">
      <GuideArticle guide={getGuide(locale)} variant="studio" />
    </main>
  );
}
