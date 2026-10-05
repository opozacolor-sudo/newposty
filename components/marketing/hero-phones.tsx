"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const CARDS = [
  { kicker: "screenNetworksKicker", title: "screenNetworks", src: "/marketing/phone-networks-hud.png", ink: "dark" },
  { kicker: "screenContentKicker", title: "screenContent", src: "/marketing/phone-front-2.png" },
  { kicker: "screenAdsKicker", title: "screenAds", src: "/marketing/phone-front-3.png" },
  { kicker: "screenChatKicker", title: "screenChat", src: "/marketing/phone-front-4.png" },
  { kicker: "screenLeadsKicker", title: "screenLeads", src: "/marketing/phone-front-5.png" },
  { kicker: "screenAnalyticsKicker", title: "screenAnalytics", src: "/marketing/phone-front-6.png" },
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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="mt-8 flex min-h-0 w-full flex-1 items-end justify-center overflow-hidden pb-3">
        <ul className="mx-auto grid h-full w-auto max-w-[82%] grid-cols-6 gap-[6px] [aspect-ratio:54/16]">
          {CARDS.map((card) => {
            const darkInk = "ink" in card && card.ink === "dark";
            return (
            <li key={card.title} className="group min-h-0 min-w-0">
              <div className="relative h-full overflow-hidden rounded-[1.4rem] bg-black">
                <Image
                  src={card.src}
                  alt=""
                  fill
                  sizes="12vw"
                  className="object-cover object-center transition-transform duration-300 ease-out will-change-transform motion-safe:group-hover:scale-[1.06]"
                  priority
                />
                <div
                  className={
                    darkInk
                      ? "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-white/45 via-white/10 to-transparent p-3 sm:p-4"
                      : "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent p-3 sm:p-4"
                  }
                >
                  <p
                    className={
                      darkInk
                        ? "text-[10px] font-medium tracking-wide text-[#1d1d1f]/75 sm:text-[12px]"
                        : "text-[10px] font-normal text-white/90 sm:text-[12px]"
                    }
                  >
                    {t(card.kicker)}
                  </p>
                  <p
                    className={
                      darkInk
                        ? "mt-1.5 text-[12px] font-semibold leading-[1.15] tracking-tight text-[#1d1d1f] [text-shadow:0_1px_10px_rgba(255,255,255,0.55)] sm:text-[15px]"
                        : "mt-1.5 text-[12px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[15px]"
                    }
                  >
                    {t(card.title)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(card)}
                  className="absolute bottom-2 right-2 z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1d1d1f]"
                  aria-label={t("screenOpen")}
                >
                  <Plus size={15} strokeWidth={2.5} />
                </button>
              </div>
            </li>
            );
          })}
        </ul>
      </div>
      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] overflow-y-auto bg-black/45"
              onClick={() => setOpen(null)}
            >
              <div className="flex min-h-full items-start justify-center px-4 py-8 sm:px-8 sm:py-12">
                <div
                  role="dialog"
                  aria-modal
                  aria-labelledby={titleId}
                  className="relative w-full max-w-[52rem] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="absolute right-4 top-4 z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1d1f] text-white sm:right-5 sm:top-5"
                    aria-label={t("screenClose")}
                  >
                    <X size={16} />
                  </button>
                  <div className="px-8 pt-10 sm:px-14 sm:pt-12">
                    <p className="text-[13px] text-[#1d1d1f] sm:text-[15px]">{t(open.kicker)}</p>
                    <h2
                      id={titleId}
                      className="mt-2 max-w-[36rem] text-[clamp(1.65rem,3.4vw,2.35rem)] font-semibold leading-[1.15] tracking-tight text-[#1d1d1f]"
                    >
                      {t(open.title)}
                    </h2>
                  </div>
                  <div className="mx-6 mt-6 overflow-hidden rounded-[1.5rem] bg-[#f5f5f7] sm:mx-10 sm:mt-8">
                    <p className="mx-auto max-w-[34rem] px-6 pt-10 text-center text-[16px] leading-7 text-[#6e6e73] sm:px-10 sm:pt-12 sm:text-[19px] sm:leading-8">
                      {t("screenBodySoon")}
                    </p>
                    <div className="relative mx-auto mt-8 h-[min(42vw,20rem)] w-full max-w-[36rem]">
                      <Image src={open.src} alt="" fill className="object-contain object-bottom" />
                    </div>
                  </div>
                  <div className="h-6 sm:h-8" />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
