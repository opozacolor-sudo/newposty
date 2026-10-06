"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { AdsScene } from "@/components/marketing/ads-scene";
import { AnalyticsScene } from "@/components/marketing/analytics-scene";
import { ChatScene } from "@/components/marketing/chat-scene";
import { ContentScene } from "@/components/marketing/content-scene";
import { LeadsScene } from "@/components/marketing/leads-scene";
import { NetworkScene } from "@/components/marketing/network-scene";

const CARDS = [
  {
    kicker: "screenNetworksKicker",
    title: "screenNetworks",
    src: "/marketing/phone-networks-hud.png",
    popupTitle: "screenNetworksPopupTitle",
    sections: [
      { body: "screenNetworksSocial", scene: "social", label: "screenNetworksSocialLabel" },
      { body: "screenNetworksAds", scene: "ads", label: "screenNetworksAdsLabel" },
    ],
    closer: "screenNetworksCloser",
  },
  {
    kicker: "screenContentKicker",
    title: "screenContent",
    src: "/marketing/phone-content-hud.png",
    popupTitle: "screenContentPopupTitle",
    sections: [
      { body: "screenContentMake", scene: "make", label: "screenContentMakeLabel" },
      { body: "screenContentPlan", scene: "plan", label: "screenContentPlanLabel" },
    ],
    closer: "screenContentCloser",
  },
  {
    kicker: "screenAdsKicker",
    title: "screenAds",
    src: "/marketing/phone-ads-hud.png",
    popupTitle: "screenAdsPopupTitle",
    sections: [
      { body: "screenAdsViews", scene: "views", label: "screenAdsViewsLabel" },
      { body: "screenAdsTraffic", scene: "traffic", label: "screenAdsTrafficLabel" },
      { body: "screenAdsLeads", scene: "leads", label: "screenAdsLeadsLabel" },
    ],
    closer: "screenAdsCloser",
  },
  {
    kicker: "screenChatKicker",
    title: "screenChat",
    src: "/marketing/phone-chat-hud.png",
    popupTitle: "screenChatPopupTitle",
    sections: [
      { body: "screenChatVoice", scene: "voice", label: "screenChatVoiceLabel" },
      { body: "screenChatPublish", scene: "publish", label: "screenChatPublishLabel" },
      { body: "screenChatMonth", scene: "month", label: "screenChatMonthLabel" },
      { body: "screenChatCreate", scene: "create", label: "screenChatCreateLabel" },
      { body: "screenChatManage", scene: "manage", label: "screenChatManageLabel" },
    ],
    closer: "screenChatCloser",
  },
  {
    kicker: "screenLeadsKicker",
    title: "screenLeads",
    src: "/marketing/phone-leads-hud.png",
    popupTitle: "screenLeadsPopupTitle",
    sections: [
      { body: "screenLeadsIntent", scene: "intent", label: "screenLeadsIntentLabel" },
      { body: "screenLeadsTrain", scene: "train", label: "screenLeadsTrainLabel" },
      { body: "screenLeadsQualify", scene: "qualify", label: "screenLeadsQualifyLabel" },
      { body: "screenLeadsInbox", scene: "inbox", label: "screenLeadsInboxLabel" },
      { body: "screenLeadsPaid", scene: "paid", label: "screenLeadsPaidLabel" },
    ],
    closer: "screenLeadsCloser",
  },
  {
    kicker: "screenAnalyticsKicker",
    title: "screenAnalytics",
    src: "/marketing/phone-analytics-hud.png",
    popupTitle: "screenAnalyticsPopupTitle",
    sections: [
      { body: "screenAnalyticsPulse", scene: "pulse", label: "screenAnalyticsPulseLabel" },
      { body: "screenAnalyticsWhen", scene: "when", label: "screenAnalyticsWhenLabel" },
      { body: "screenAnalyticsFormats", scene: "formats", label: "screenAnalyticsFormatsLabel" },
      { body: "screenAnalyticsSplit", scene: "split", label: "screenAnalyticsSplitLabel" },
      { body: "screenAnalyticsMoney", scene: "spend", label: "screenAnalyticsMoneyLabel" },
    ],
    closer: "screenAnalyticsCloser",
  },
] as const;

type Card = (typeof CARDS)[number];

function popupOf(card: Card) {
  return { title: card.popupTitle, sections: card.sections, closer: card.closer };
}

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

  const popup = open ? popupOf(open) : null;

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
                <div className="shrink-0 px-5 pt-5 lg:px-3 lg:pt-3 xl:px-3.5 xl:pt-3.5">
                  <p className="text-[13px] font-normal text-[#1d1d1f] lg:text-[10px] xl:text-[12px]">{t(card.kicker)}</p>
                  <p className="mt-1 line-clamp-2 max-w-[16rem] text-[21px] font-semibold leading-[1.12] tracking-tight text-[#1d1d1f] lg:mt-0.5 lg:max-w-none lg:text-[12px] xl:text-[15px]">
                    {t(card.title)}
                  </p>
                </div>
                <div className="relative mx-2 mb-2 mt-1.5 min-h-0 flex-1 basis-0 overflow-hidden rounded-[1.25rem] lg:mx-1 lg:mb-1 lg:mt-1 lg:rounded-[1.05rem] xl:mx-1.5 xl:mb-1.5">
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
                  className="absolute bottom-5 right-5 z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-[0_2px_10px_rgba(0,0,0,0.22)] lg:bottom-3 lg:right-3 lg:h-8 lg:w-8"
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
                  className="relative w-full max-w-[56rem] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="absolute right-4 top-4 z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-[#1d1d1f] text-white sm:right-6 sm:top-6"
                    aria-label={t("screenClose")}
                  >
                    <X size={16} />
                  </button>
                  <div className="px-8 pt-12 sm:px-16 sm:pt-16">
                    <p className="text-[13px] text-[#1d1d1f] sm:text-[15px]">{t(open.kicker)}</p>
                    <h2
                      id={titleId}
                      className="mt-3 max-w-[34rem] text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.12] tracking-tight text-[#1d1d1f]"
                    >
                      {t(popup!.title)}
                    </h2>
                  </div>
                  <div className="mt-8 flex flex-col gap-4 px-4 pb-4 sm:mt-10 sm:gap-5 sm:px-6 sm:pb-6">
                    {popup!.sections.map((section) => (
                      <div key={section.body} className="overflow-hidden rounded-[1.75rem] bg-[#f5f5f7] sm:rounded-[2rem]">
                        <p className="mx-auto max-w-[38rem] px-7 pt-10 text-[16px] leading-7 tracking-normal text-[#6e6e73] sm:px-16 sm:pt-14 sm:text-[19px] sm:leading-[1.47]">
                          {t(section.body)}
                        </p>
                        {section.scene === "social" || section.scene === "ads" ? (
                          <NetworkScene kind={section.scene} label={t(section.label)} />
                        ) : section.scene === "make" || section.scene === "plan" ? (
                          <ContentScene kind={section.scene} label={t(section.label)} />
                        ) : section.scene === "voice" ||
                          section.scene === "publish" ||
                          section.scene === "month" ||
                          section.scene === "create" ||
                          section.scene === "manage" ? (
                          <ChatScene kind={section.scene} label={t(section.label)} />
                        ) : section.scene === "intent" ||
                          section.scene === "train" ||
                          section.scene === "qualify" ||
                          section.scene === "inbox" ||
                          section.scene === "paid" ? (
                          <LeadsScene kind={section.scene} label={t(section.label)} />
                        ) : section.scene === "pulse" ||
                          section.scene === "when" ||
                          section.scene === "formats" ||
                          section.scene === "split" ||
                          section.scene === "spend" ? (
                          <AnalyticsScene kind={section.scene} label={t(section.label)} />
                        ) : (
                          <AdsScene kind={section.scene} label={t(section.label)} />
                        )}
                      </div>
                    ))}
                    {popup!.closer ? (
                      <p className="mx-auto max-w-[38rem] px-7 py-6 text-center text-[16px] leading-7 text-[#1d1d1f] sm:px-16 sm:py-8 sm:text-[19px] sm:leading-[1.47]">
                        {t(popup!.closer)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
