import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaqJsonLd } from "@/components/marketing/faq-json-ld";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { clayLink, clayTile, pageH2, pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";
import { getFeature } from "@/lib/features";
import { getHowTo, HOW_TO_SLUGS, isHowToSlug } from "@/lib/how-to";
import { getPlatformLanding, PLATFORM_LANDING_SLUGS } from "@/lib/platform-pages";

export function generateStaticParams() {
  return HOW_TO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const copy = getHowTo(slug, locale);
  if (!copy) return {};
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function HowToPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isHowToSlug(slug)) notFound();
  const copy = getHowTo(slug, locale);
  if (!copy) notFound();

  const t = await getTranslations("Features");
  const publish = getFeature("publish");
  const publishCopy = publish ? (locale === "ro" ? publish.ro : publish.en) : null;
  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: copy.title,
    description: copy.metaDescription,
    step: copy.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  return (
    <MarketingPageFrame wide>
      <FaqJsonLd faqs={copy.faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }} />

      <header className="mx-auto max-w-2xl text-center">
        <p className={pageKicker}>{copy.kicker}</p>
        <h1 className={`mt-3 ${pageTitle}`}>{copy.title}</h1>
        <p className={pageLead}>{copy.subtitle}</p>
      </header>

      <div className="mx-auto mt-10 max-w-2xl space-y-5">
        {copy.intro.map((paragraph) => (
          <p key={paragraph} className="text-base leading-7 text-[#55514e]">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.stepsTitle}</h2>
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

      <section className="posty-clay-well mt-16 rounded-[1.4rem] px-6 py-10 sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#ddd8d3]">{copy.sayTitle}</p>
        <ul className="mt-4 max-w-2xl space-y-3">
          {copy.examples.map((example) => (
            <li key={example} className="text-base leading-7 text-[#f4f1ee]">
              “{example}”
            </li>
          ))}
        </ul>
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
        <h2 className={pageKicker}>{copy.relatedTitle}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_LANDING_SLUGS.map((item) => {
            const landing = getPlatformLanding(item, locale);
            if (!landing) return null;
            return (
              <li key={item}>
                <Link href={`/platforms/${item}`} className={`block ${clayTile}`}>
                  <span className="block text-sm font-semibold text-[#1d1d1f]">{landing.kicker}</span>
                  <span className="mt-1 block text-sm leading-5 text-[#55514e]">{landing.title}</span>
                </Link>
              </li>
            );
          })}
          {publishCopy ? (
            <li>
              <Link href="/features/publish" className={`block ${clayTile}`}>
                <span className="block text-sm font-semibold text-[#1d1d1f]">{publishCopy.navTitle}</span>
                <span className="mt-1 block text-sm leading-5 text-[#55514e]">{publishCopy.navBody}</span>
              </Link>
            </li>
          ) : null}
          <li>
            <Link href="/guide" className={`block ${clayTile}`}>
              <span className="block text-sm font-semibold text-[#1d1d1f]">{copy.readGuide}</span>
            </Link>
          </li>
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-xl border-t border-white/20 pt-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("ctaTitle")}</p>
        <WaitlistForm />
        <p className="mt-4">
          <a href="#waitlist" className={clayLink}>
            {t("cta")}
          </a>
        </p>
      </div>
    </MarketingPageFrame>
  );
}
