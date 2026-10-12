import { getTranslations } from "next-intl/server";
import { PlanBilling } from "@/components/studio/plan-billing";
import { StudioPage } from "@/components/studio/studio-surface";

export async function generateMetadata() {
  const t = await getTranslations("Billing");
  return { title: t("planTitle") };
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const params = await searchParams;
  return (
    <StudioPage>
      <PlanBilling notice={params.billing ?? null} />
    </StudioPage>
  );
}
