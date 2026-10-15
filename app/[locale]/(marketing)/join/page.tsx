import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JoinForm } from "@/components/marketing/join-form";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { PricingCards, PricingPacks } from "@/components/marketing/pricing-cards";
import { clayTile, pageH2, pageKicker, pageLead, pageTitle } from "@/components/marketing/styles";
import { INVITE_SIGNUP } from "@/lib/flags";
import { joinCopy } from "@/lib/join-copy";
import { pricingCopy } from "@/lib/pricing-copy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = joinCopy(locale);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: `https://posty.now/${locale}/join` },
  };
}

export default async function JoinPage() {
  if (!INVITE_SIGNUP) notFound();
  const locale = await getLocale();
  const copy = joinCopy(locale);
  const pricing = pricingCopy(locale);

  return (
    <MarketingPageFrame wide>
      <p className={pageKicker}>{copy.kicker}</p>
      <h1 className={`mt-3 ${pageTitle}`}>{copy.title}</h1>
      <p className={`max-w-2xl ${pageLead}`}>{copy.lead}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <div className={clayTile}>
          <JoinForm />
        </div>
        <div className={clayTile}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
            {copy.promoTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#55514e]">{copy.promoLead}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <p className="text-lg font-semibold tracking-tight text-[#1d1d1f]">{copy.photos}</p>
            <p className="text-lg font-semibold tracking-tight text-[#1d1d1f]">{copy.videos}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#5c5652]">{copy.profileLater}</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.nowTitle}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#55514e]">{copy.nowLead}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <article
              key={plan.id}
              className={`${clayTile} flex flex-col ${
                plan.featured ? "ring-2 ring-[#1d1d1f]/15 lg:-translate-y-1" : ""
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
                {copy.included}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#1d1d1f]">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#6b5348]">{plan.tag}</p>
              <p className="mt-4 text-sm leading-6 text-[#1d1d1f]">{plan.gain}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#55514e]">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className={pageH2}>{copy.laterTitle}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#55514e]">{copy.laterLead}</p>
        <div className="mt-8">
          <PricingCards copy={pricing} locale={locale} cta={{ href: "#signup", label: copy.laterCta }} />
        </div>
        <p className="mt-4 text-center text-xs leading-5 text-[#5c5652]">{pricing.vat}</p>
        <h3 className={`mt-12 ${pageH2}`}>{pricing.packsTitle}</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#55514e]">{pricing.packsLead}</p>
        <PricingPacks copy={pricing} locale={locale} />
      </section>
    </MarketingPageFrame>
  );
}
