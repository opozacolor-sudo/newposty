import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/marketing/faq-json-ld";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { clayLink, clayTile, pageH2, pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { Link } from "@/i18n/navigation";
import { FEATURES, getFeature, isFeatureSlug, type FeatureSlug } from "@/lib/features";
import { getFeatureMeta } from "@/lib/seo-meta";
import { ADS_PLATFORMS, isConnectDisabled, PLATFORMS } from "@/lib/platforms";

export function generateStaticParams() {
  return FEATURES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isFeatureSlug(slug)) return {};
  return getFeatureMeta(slug as FeatureSlug, locale);
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isFeatureSlug(slug)) notFound();
  const page = getFeature(slug);
  if (!page) notFound();

  const copy = locale === "ro" ? page.ro : page.en;
  const t = await getTranslations("Features");
  const others = FEATURES.filter((item) => item.slug !== page.slug);
  const rail = page.rail === "ads" ? ADS_PLATFORMS : page.rail === "posts" ? PLATFORMS : null;

  return (
    <MarketingPageFrame wide>
      <FaqJsonLd faqs={copy.faqs} />
      <header className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className={pageKicker}>{copy.kicker}</p>
          <h1 className={`mt-3 ${pageTitle}`}>{copy.title}</h1>
          <p className={pageLead}>{copy.subtitle}</p>
          <a href="#waitlist" className={`mt-6 inline-flex ${clayLink}`}>
            {t("cta")}
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.hero} alt="" className="aspect-[16/9] w-full rounded-[1.35rem] object-cover" />
      </header>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {copy.features.map((feature) => (
          <div key={feature.title} className={clayTile}>
            <h2 className="text-base font-semibold text-[#1d1d1f]">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#55514e]">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.detail} alt="" className="aspect-[4/3] w-full rounded-[1.35rem] object-cover" />
        <div>
          <h2 className={pageH2}>{copy.batchTitle}</h2>
          <p className="mt-3 text-base leading-7 text-[#55514e]">{copy.batchBody}</p>
        </div>
      </section>

      {rail ? (
        <section className="mt-16">
          <h2 className={pageKicker}>{page.rail === "ads" ? t("ads") : t("channels")}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {rail.map((platform) => (
              <li
                key={platform.id}
                className="posty-clay-tile inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3"
              >
                <PlatformIcon platform={platform} connected={!isConnectDisabled(platform.id)} size="sm" />
                <span className="text-sm font-medium text-[#1d1d1f]">{platform.label}</span>
                {isConnectDisabled(platform.id) ? (
                  <span className="text-[11px] text-[#6e6e73]">{t("soon")}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
        <h2 className={pageKicker}>{t("alsoTitle")}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => {
            const other = locale === "ro" ? item.ro : item.en;
            return (
              <li key={item.slug}>
                <Link href={`/features/${item.slug}`} className={`block ${clayTile}`}>
                  <span className="block text-sm font-semibold text-[#1d1d1f]">{other.navTitle}</span>
                  <span className="mt-1 block text-sm leading-5 text-[#55514e]">{other.navBody}</span>
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
