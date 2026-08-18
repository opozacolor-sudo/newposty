import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DemoReveal, DemoVideoPlaceholder } from "@/components/marketing/demo-media";
import { btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

const STEP_IDS = [
  "connect",
  "chat",
  "caption",
  "timing",
  "publish",
  "analytics",
] as const;

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

export default async function DemoPage() {
  const t = await getTranslations("Demo");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-neutral-500 sm:text-lg">{t("subtitle")}</p>
      </header>

      <div className="mt-14 flex flex-col gap-16 sm:mt-20 sm:gap-24">
        {STEP_IDS.map((id, index) => {
          const reverse = index % 2 === 1;
          return (
            <DemoReveal key={id}>
              <section className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                <div className={reverse ? "md:order-2" : undefined}>
                  <p className="text-sm font-medium text-[#FF4713]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                    {t(`steps.${id}.title`)}
                  </h2>
                  <p className="mt-3 max-w-md text-base leading-7 text-neutral-500">
                    {t(`steps.${id}.body`)}
                  </p>
                </div>
                <div className={reverse ? "md:order-1" : undefined}>
                  <DemoVideoPlaceholder label={t("videoSoon")} />
                </div>
              </section>
            </DemoReveal>
          );
        })}
      </div>

      <div className="mt-20 border-t border-neutral-100 py-16 text-center sm:mt-24">
        <p className="text-2xl font-semibold tracking-tight text-neutral-950">
          {t("ctaTitle")}
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/login" className={`${btnSolid} px-6 py-3`}>
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
