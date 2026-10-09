import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/marketing/faq-json-ld";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { clayLink, clayTile, pageH2, pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { Link } from "@/i18n/navigation";
import {
  getPlatformLanding,
  isPlatformLandingSlug,
  PLATFORM_LANDING_SLUGS,
} from "@/lib/platform-pages";
import { PLATFORMS } from "@/lib/platforms";

export function generateStaticParams() {
  return PLATFORM_LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const copy = getPlatformLanding(slug, locale);
  if (!copy) return {};
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function PlatformLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isPlatformLandingSlug(slug)) notFound();
  const copy = getPlatformLanding(slug, locale);
  if (!copy) notFound();

  const t = await getTranslations("Features");
  const platforms = await getTranslations("PlatformsPage");
  const guide = await getTranslations("Guide");
  const platform = PLATFORMS.find((item) => item.id === slug);
  const others = PLATFORM_LANDING_SLUGS.filter((item) => item !== slug);

  return (
    <MarketingPageFrame wide>
      <FaqJsonLd faqs={copy.faqs} />
      <header className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className={pageKicker}>{copy.kicker}</p>
          <h1 className={`mt-3 ${pageTitle}`}>{copy.title}</h1>
          <p className={pageLead}>{copy.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#waitlist" className={clayLink}>
              {t("cta")}
            </a>
            <Link href="/guide/one-message" className={clayLink}>
              {guide("featuredArticle")}
            </Link>
          </div>
        </div>
        {platform ? (
          <div className="posty-clay-tile flex aspect-[16/9] items-center justify-center rounded-[1.35rem]">
            <span className="scale-[2.4]">
              <PlatformIcon platform={platform} connected size="lg" />
            </span>
          </div>
        ) : null}
      </header>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {copy.features.map((feature) => (
          <div key={feature.title} className={clayTile}>
            <h2 className="text-base font-semibold text-[#1d1d1f]">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#55514e]">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.batchTitle}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[#55514e]">{copy.batchBody}</p>
      </section>

      <section className="posty-clay-well mt-16 rounded-[1.4rem] px-6 py-10 sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#ddd8d3]">{copy.examplesTitle}</p>
        <ul className="mt-4 max-w-2xl space-y-3">
          {copy.examples.map((example) => (
            <li key={example} className="text-base leading-7 text-[#f4f1ee]">
              “{example}”
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{t("howTitle")}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {copy.steps.map((step, index) => (
            <li key={step.title} className={clayTile}>
              <p className="text-sm font-medium text-[#6b5348]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-base font-semibold text-[#1d1d1f]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#55514e]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{t("faqTitle")}</h2>
        <div className="mt-6 divide-y divide-white/20 border-y border-white/20">
          {copy.faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-medium text-[#1d1d1f]">{item.q}</summary>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#55514e]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className={pageKicker}>{platforms("alsoTitle")}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((item) => {
            const other = getPlatformLanding(item, locale);
            if (!other) return null;
            const otherPlatform = PLATFORMS.find((row) => row.id === item);
            return (
              <li key={item}>
                <Link href={`/platforms/${item}`} className={`block ${clayTile}`}>
                  {otherPlatform ? (
                    <PlatformIcon platform={otherPlatform} connected size="sm" />
                  ) : null}
                  <span className="mt-3 block text-sm font-semibold text-[#1d1d1f]">{other.title}</span>
                </Link>
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
