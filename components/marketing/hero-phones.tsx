"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const TILE = "/marketing/phone-tile.png";

const CARDS = [
  { kicker: "screenNetworksKicker", title: "screenNetworks" },
  { kicker: "screenContentKicker", title: "screenContent" },
  { kicker: "screenAdsKicker", title: "screenAds" },
  { kicker: "screenChatKicker", title: "screenChat" },
  { kicker: "screenLeadsKicker", title: "screenLeads" },
  { kicker: "screenAnalyticsKicker", title: "screenAnalytics" },
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
      <div className="mt-5 flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
        <ul className="grid w-full max-w-[70rem] grid-cols-6 gap-2 sm:gap-2.5">
          {CARDS.map((card) => (
            <li key={card.title} className="group min-w-0">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-black">
                <Image
                  src={TILE}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 11vw, 16vw"
                  className="object-cover object-top transition-transform duration-300 ease-out will-change-transform motion-safe:group-hover:scale-[1.06]"
                  priority
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 p-3 sm:p-4">
                  <p className="text-[10px] font-normal text-white/90 sm:text-[12px]">{t(card.kicker)}</p>
                  <p className="mt-1.5 text-[12px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[15px]">
                    {t(card.title)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(card)}
                  className="absolute bottom-1.5 right-1.5 z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1d1d1f] sm:bottom-2 sm:right-2 sm:h-8 sm:w-8"
                  aria-label={t("screenOpen")}
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
