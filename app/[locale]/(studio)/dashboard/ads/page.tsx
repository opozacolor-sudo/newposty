import { getTranslations } from "next-intl/server";
import { ComingSoon } from "@/components/studio/coming-soon";

export default async function DashboardAdsPage() {
  const t = await getTranslations("Nav");
  return <ComingSoon title={`${t("stats")} · ${t("ads")}`} />;
}
