import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { btnClay, clayLink, clayTile, pageLead, pageTitle } from "@/components/marketing/styles";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { DEMO_PAGES, demoCopy } from "@/lib/demo";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Demo" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Demo");

  return (
    <MarketingPageFrame wide>
      <header className="mx-auto max-w-2xl text-center">
        <h1 className={pageTitle}>{t("title")}</h1>
        <p className={pageLead}>{t("subtitle")}</p>
      </header>

      <ol className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_PAGES.map((page, index) => {
          const copy = demoCopy(page, locale);
          return (
            <li key={page.slug}>
              <Link href={`/demo/${page.slug}`} className={`block h-full ${clayTile}`}>
                <p className="text-sm font-medium text-[#6b5348]">{String(index + 1).padStart(2, "0")}</p>
                <span className="mt-2 block text-base font-semibold text-[#1d1d1f]">{copy.navTitle}</span>
                <span className="mt-1 block text-sm leading-5 text-[#55514e]">{copy.navBody}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-20 border-t border-white/20 py-16 text-center sm:mt-24">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("ctaTitle")}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={SIGNUPS_OPEN ? "/signup" : "/waitlist"} className={`${btnClay} px-6 py-3`}>
            {t("ctaButton")}
          </Link>
          <Link href="/guide" className={clayLink}>
            {t("readGuide")}
          </Link>
        </div>
      </div>
    </MarketingPageFrame>
  );
}
