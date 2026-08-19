import { getTranslations } from "next-intl/server";
import { ComingSoon } from "@/components/studio/coming-soon";

export default async function AccountsAdsPage() {
  const t = await getTranslations("Nav");
  return <ComingSoon title={`${t("accounts")} · ${t("ads")}`} />;
}
