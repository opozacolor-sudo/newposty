import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PresaleLanding } from "@/components/presale/presale-landing";
import { buildPresaleView } from "@/lib/presale";
import { fetchPresaleView } from "@/lib/presale-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Presale" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function PresalePage() {
  let initial = buildPresaleView(0);
  try {
    initial = await fetchPresaleView();
  } catch {
    initial = buildPresaleView(0);
  }
  return <PresaleLanding initial={initial} />;
}
