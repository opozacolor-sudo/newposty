"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const CARDS = [
  { kicker: "screenNetworksKicker", title: "screenNetworks", src: "/marketing/phone-networks-hud.png" },
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
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const scroller = useRef<HTMLUListElement>(null);

  function syncArrows() {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  function scrollByCard(direction: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 12;
    const width = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    syncArrows();
    el.addEventListener("scroll", syncArrows, { passive: true });
    window.addEventListener("resize", syncArrows);
    return () => {
      el.removeEventListener("scroll", syncArrows);
      window.removeEventListener("resize", syncArrows);
    };
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
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col lg:mt-8 lg:items-end lg:justify-center lg:overflow-hidden lg:pb-3">
        <ul
          ref={scroller}
          className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:mx-auto lg:grid lg:h-full lg:w-auto lg:max-w-[82%] lg:flex-none lg:grid-cols-6 lg:gap-[6px] lg:overflow-visible lg:px-0 lg:[aspect-ratio:54/16]"
        >
          {CARDS.map((card) => (
            <li
              key={card.title}
              className="h-full w-[min(22.5rem,calc(100vw-3.25rem))] shrink-0 snap-start lg:min-h-0 lg:w-auto lg:min-w-0"
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white lg:rounded-[1.4rem]">
                <div className="px-5 pt-5 lg:px-3 lg:pt-3.5 xl:px-4 xl:pt-4">
                  <p className="text-[13px] font-normal text-[#1d1d1f] lg:text-[10px] xl:text-[12px]">{t(card.kicker)}</p>
                  <p className="mt-1 max-w-[16rem] text-[21px] font-semibold leading-[1.12] tracking-tight text-[#1d1d1f] lg:mt-1 lg:max-w-none lg:text-[12px] xl:text-[15px]">
                    {t(card.title)}
                  </p>
                </div>
                <div className="relative mx-4 mb-3 mt-3 min-h-0 flex-1 overflow-hidden rounded-[1.2rem] lg:mx-2.5 lg:mb-11 lg:mt-2 lg:rounded-[1rem] xl:mx-3">
                  <Image
                    src={card.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 12vw, 85vw"
                    className="object-cover object-center transition-transform duration-300 ease-out will-change-transform motion-safe:group-hover:scale-[1.06]"
                    priority
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(card)}
                  className="absolute bottom-4 right-4 z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-[0_2px_10px_rgba(0,0,0,0.22)] lg:bottom-2.5 lg:right-2.5 lg:h-8 lg:w-8 lg:shadow-none"
                  aria-label={t("screenOpen")}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex shrink-0 justify-end gap-3 px-5 pb-2 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition disabled:opacity-35"
            aria-label={t("screenPrev")}
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition disabled:opacity-35"
            aria-label={t("screenNext")}
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>
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
