"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const CARDS = [
  { src: "/marketing/phone-card-1.png", kicker: "screenNetworksKicker", title: "screenNetworks" },
  { src: "/marketing/phone-card-2.png", kicker: "screenContentKicker", title: "screenContent" },
  { src: "/marketing/phone-card-3.png", kicker: "screenAdsKicker", title: "screenAds" },
  { src: "/marketing/phone-card-4.png", kicker: "screenChatKicker", title: "screenChat" },
  { src: "/marketing/phone-card-5.png", kicker: "screenLeadsKicker", title: "screenLeads" },
  { src: "/marketing/phone-card-1.png", kicker: "screenAnalyticsKicker", title: "screenAnalytics" },
] as const;

type Card = (typeof CARDS)[number];

export function HeroPhones() {
  const t = useTranslations("Landing");
  const titleId = useId();
  const [open, setOpen] = useState<Card | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ul className="mt-6 grid min-h-0 w-full flex-1 grid-cols-6 content-end gap-3 sm:gap-4 lg:gap-5">
        {CARDS.map((card) => (
          <li key={card.title} className="group min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.35rem] bg-[#1d1d1f] transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.03]">
              <Image
                src={card.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, 16vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/25" />
              <div className="absolute inset-x-0 top-0 p-2.5 sm:p-3.5">
                <p className="text-[10px] font-normal text-white/80 sm:text-[12px]">{t(card.kicker)}</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-white sm:text-[14px]">
                  {t(card.title)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(card)}
                className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-sm transition hover:scale-105 sm:h-9 sm:w-9"
                aria-label={t("screenOpen")}
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[80] overflow-y-auto bg-white" role="dialog" aria-modal aria-labelledby={titleId}>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-white sm:right-6 sm:top-6"
                aria-label={t("screenClose")}
              >
                <X size={18} />
              </button>
              <div className="mx-auto max-w-3xl px-6 pb-16 pt-16 sm:px-8 sm:pt-20">
                <p className="text-[15px] text-[#1d1d1f]">{t(open.kicker)}</p>
                <h2 id={titleId} className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-[#1d1d1f]">
                  {t(open.title)}
                </h2>
                <div className="mt-8 overflow-hidden rounded-[1.8rem] bg-[#f5f5f7] px-6 py-8 sm:px-12 sm:py-12">
                  <p className="text-[17px] leading-7 text-[#6e6e73] sm:text-[21px] sm:leading-8">
                    {t("screenBodySoon")}
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
