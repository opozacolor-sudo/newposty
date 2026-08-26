import { getTranslations } from "next-intl/server";
import { LegalDoc } from "@/components/marketing/legal-doc";

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
  const sections = t.raw("sections") as { heading: string; body: string[] }[];

  return (
    <LegalDoc
      title={t("title")}
      updated={t("updated")}
      operator={t("operator")}
      sections={Array.isArray(sections) ? sections : []}
    />
  );
}
