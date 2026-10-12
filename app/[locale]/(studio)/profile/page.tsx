import { getTranslations } from "next-intl/server";
import { PlanBilling } from "@/components/studio/plan-billing";
import { ProfileForm } from "@/components/studio/profile-form";
import { StudioPage } from "@/components/studio/studio-surface";
import { requireUser } from "@/lib/data";
import { profileDetailsFromRow } from "@/lib/profile-details";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return { title: t("title") };
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const t = await getTranslations("Profile");
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("profiles")
    .select(
      "display_name, company_site, contact_email, contact_phone, billing_name, billing_tax_id, billing_address, billing_city, billing_postal_code, billing_country",
    )
    .eq("id", user.id)
    .maybeSingle();

  return (
    <StudioPage>
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5c5652]">{t("lead")}</p>
      <ProfileForm initial={profileDetailsFromRow(data, user.email)} />
      <PlanBilling notice={params.billing ?? null} />
    </StudioPage>
  );
}
