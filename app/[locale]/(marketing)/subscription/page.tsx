import type { Metadata } from "next";
import { LegalScreen, legalMetadata } from "@/components/marketing/legal-screen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return legalMetadata(locale, "subscription");
}

export default async function SubscriptionTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalScreen locale={locale} id="subscription" />;
}
