import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqJsonLd } from "@/components/marketing/faq-json-ld";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { PricingCards, PricingPacks } from "@/components/marketing/pricing-cards";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { clayTile, pageH2, pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { pricingCopy } from "@/lib/pricing-copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PricingPage() {
  const locale = await getLocale();
  const t = await getTranslations("Pricing");
  const copy = pricingCopy(locale);

  return (
    <MarketingPageFrame wide>
      <FaqJsonLd faqs={copy.faqs} />
      <p className={pageKicker}>{copy.kicker}</p>
      <h1 className={`mt-3 ${pageTitle}`}>{copy.title}</h1>
      <p className={`max-w-2xl ${pageLead}`}>{copy.lead}</p>

      <div className="mt-10">
        <PricingCards copy={copy} locale={locale} />
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-[#5c5652]">{copy.vat}</p>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.packsTitle}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#55514e]">{copy.packsLead}</p>
        <PricingPacks copy={copy} locale={locale} />
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.gainsTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {copy.gains.map((item) => (
            <div key={item.title} className={clayTile}>
              <h3 className="text-base font-semibold text-[#1d1d1f]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#55514e]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.compareTitle}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {copy.compare.map((item) => (
            <div key={item.title} className={clayTile}>
              <h3 className="text-base font-semibold text-[#1d1d1f]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#55514e]">{item.body}</p>
            </div>
          ))}
        </div>
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

      <div id="waitlist" className="mx-auto mt-16 max-w-xl scroll-mt-24 border-t border-white/20 pt-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{copy.launch}</p>
        <WaitlistForm />
      </div>
    </MarketingPageFrame>
  );
}
