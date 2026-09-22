import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";
import { legalPage, type LegalPage } from "@/lib/legal";

export function legalMetadata(locale: string, id: LegalPage["id"]): Metadata {
  const page = legalPage(locale, id);
  return { title: page.title, description: page.description };
}

export function LegalScreen({ locale, id }: { locale: string; id: LegalPage["id"] }) {
  return <LegalDocument locale={locale} page={legalPage(locale, id)} />;
}
