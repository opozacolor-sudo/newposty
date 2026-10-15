"use client";

import { useMemo, useState } from "react";
import { btnClay, clayTile } from "@/components/marketing/styles";
import { annualSaveCents, priceLabel, type PricingPageCopy } from "@/lib/pricing-copy";

function includesLabel(template: string, plan: string) {
  return template.replace("{plan}", plan);
}

function saveLabel(template: string, amount: string) {
  return template.replace("{amount}", amount);
}

export function PricingCards({
  copy,
  locale,
  cta,
}: {
  copy: PricingPageCopy;
  locale: string;
  cta?: { href: string; label: string } | null;
}) {
  const [yearly, setYearly] = useState(false);
  const plans = copy.plans;

  const previousName = useMemo(() => {
    const map: Record<string, string> = {};
    for (let i = 1; i < plans.length; i += 1) {
      map[plans[i].id] = plans[i - 1].name;
    }
    return map;
  }, [plans]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="posty-clay-tile inline-flex rounded-full p-1">
          <button
            type="button"
            aria-pressed={!yearly}
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              yearly ? "text-[#5c5652]" : "bg-white/70 text-[#1d1d1f]"
            }`}
          >
            {copy.monthly}
          </button>
          <button
            type="button"
            aria-pressed={yearly}
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              yearly ? "bg-white/70 text-[#1d1d1f]" : "text-[#5c5652]"
            }`}
          >
            {copy.annual}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const cents = yearly ? plan.annualCents : plan.monthlyCents;
          const save = yearly ? annualSaveCents(plan) : 0;
          const included = previousName[plan.id];
          return (
            <article
              key={plan.id}
              className={`${clayTile} flex flex-col ${
                plan.featured ? "ring-2 ring-[#1d1d1f]/15 lg:-translate-y-1" : ""
              }`}
            >
              {plan.featured ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5348]">
                  {copy.featured}
                </p>
              ) : null}
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1d1d1f]">{plan.name}</h2>
              <p className="mt-1 text-sm text-[#6b5348]">{plan.tag}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                {priceLabel(cents, locale)}
                <span className="ml-1 text-base font-medium text-[#5c5652]">
                  {yearly ? copy.perYear : copy.perMonth}
                </span>
              </p>
              {save > 0 ? (
                <p className="mt-1 text-xs font-medium text-[#6b5348]">
                  {saveLabel(copy.saveYear, priceLabel(save, locale))}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-6 text-[#1d1d1f]">{plan.gain}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm leading-6 text-[#55514e]">
                {included ? (
                  <li className="font-medium text-[#1d1d1f]">{includesLabel(copy.includes, included)}</li>
                ) : null}
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {cta === null ? null : (
                <a href={cta?.href ?? "#waitlist"} className={`mt-6 text-center ${btnClay}`}>
                  {cta?.label ?? copy.waitlist}
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function PricingPacks({ copy, locale }: { copy: PricingPageCopy; locale: string }) {
  return (
    <div className="mt-6 grid gap-4 sm:max-w-3xl sm:grid-cols-2">
      {copy.packs.map((pack) => (
        <article key={pack.id} className={clayTile}>
          <h3 className="text-base font-semibold text-[#1d1d1f]">{pack.name}</h3>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {priceLabel(pack.priceCents, locale)}
          </p>
          {pack.note ? <p className="mt-1 text-xs font-medium text-[#6b5348]">{pack.note}</p> : null}
          <p className="mt-3 text-sm leading-6 text-[#55514e]">{pack.body}</p>
        </article>
      ))}
    </div>
  );
}
