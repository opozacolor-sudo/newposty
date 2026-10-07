import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { clayTile, pageLead, pageTitle } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";
import { COMPANY, legalPages } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalIndex" });
  return { title: t("title"), description: COMPANY.name };
}

export default async function LegalIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("LegalIndex");
  const pages = legalPages(locale);

  return (
    <MarketingPageFrame>
      <h1 className={pageTitle}>{t("title")}</h1>
      <p className={pageLead}>{t("intro")}</p>
      <ul className="mt-10 grid gap-3">
        {pages.map((page) => (
          <li key={page.id}>
            <Link href={page.href} className={`block ${clayTile}`}>
              <span className="block text-lg font-semibold text-[#1d1d1f]">{page.title}</span>
              <span className="mt-1 block text-sm leading-6 text-[#55514e]">{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </MarketingPageFrame>
  );
}
