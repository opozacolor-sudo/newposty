import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { clayLink, pageBody, pageTitle } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

export default async function DeleteAccountPage() {
  const t = await getTranslations("DeleteAccount");

  return (
    <MarketingPageFrame>
      <h1 className={pageTitle}>{t("title")}</h1>
      <p className={`mt-6 ${pageBody}`}>{t("body")}</p>
      <p className={`mt-4 ${pageBody}`}>{t("how")}</p>
      <Link href="/contact" className={`mt-8 inline-flex ${clayLink}`}>
        {t("contact")}
      </Link>
    </MarketingPageFrame>
  );
}
