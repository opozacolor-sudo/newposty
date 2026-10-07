import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { ADS_PLATFORMS, isConnectDisabled, PLATFORMS } from "@/lib/platforms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PlatformsPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PlatformsPage() {
  const t = await getTranslations("PlatformsPage");
  const comingSoon = t("comingSoon");

  return (
    <MarketingPageFrame wide>
      <header className="mx-auto max-w-2xl text-center">
        <h1 className={pageTitle}>{t("title")}</h1>
        <p className={pageLead}>{t("subtitle")}</p>
      </header>

      <section className="mt-14">
        <h2 className={pageKicker}>{t("channels")}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const soon = isConnectDisabled(platform.id);
            return (
              <li key={platform.id} className="posty-clay-tile flex items-center gap-3 rounded-[1.15rem] px-3 py-3">
                <PlatformIcon platform={platform} connected={!soon} />
                <span className="text-sm font-medium text-[#1d1d1f]">{platform.label}</span>
                {soon ? <span className="ml-auto text-xs text-[#6e6e73]">{comingSoon}</span> : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className={pageKicker}>{t("ads")}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADS_PLATFORMS.map((platform) => {
            const soon = isConnectDisabled(platform.id);
            return (
              <li key={platform.id} className="posty-clay-tile flex items-center gap-3 rounded-[1.15rem] px-3 py-3">
                <PlatformIcon platform={platform} connected={!soon} />
                <span className="text-sm font-medium text-[#1d1d1f]">{platform.label}</span>
                {soon ? <span className="ml-auto text-xs text-[#6e6e73]">{comingSoon}</span> : null}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-xl border-t border-white/20 pt-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("ctaTitle")}</p>
        <WaitlistForm />
      </div>
    </MarketingPageFrame>
  );
}
