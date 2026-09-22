import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
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
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-neutral-500 sm:text-lg">{t("subtitle")}</p>
      </header>

      <section className="mt-14">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
          {t("channels")}
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const soon = isConnectDisabled(platform.id);
            return (
              <li
                key={platform.id}
                className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-3"
              >
                <PlatformIcon platform={platform} connected={!soon} />
                <span className="text-sm font-medium text-neutral-900">{platform.label}</span>
                {soon ? <span className="ml-auto text-xs text-neutral-400">{comingSoon}</span> : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{t("ads")}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADS_PLATFORMS.map((platform) => {
            const soon = isConnectDisabled(platform.id);
            return (
              <li
                key={platform.id}
                className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-3 py-3"
              >
                <PlatformIcon platform={platform} connected={!soon} />
                <span className="text-sm font-medium text-neutral-900">{platform.label}</span>
                {soon ? <span className="ml-auto text-xs text-neutral-400">{comingSoon}</span> : null}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-xl border-t border-neutral-100 pt-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-neutral-950">{t("ctaTitle")}</p>
        <WaitlistForm />
      </div>
    </div>
  );
}
