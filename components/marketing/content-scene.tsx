"use client";

import { Globe, ImageIcon, Link2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const MONTH_DAYS = 30;
const LEADING_BLANKS = 3;

export function ContentScene({ kind, label }: { kind: "make" | "plan"; label: string }) {
  const t = useTranslations("Landing");
  return (
    <div className="mt-10 px-5 pb-8 sm:mt-12 sm:px-10 sm:pb-12">
      <p className="text-center text-[12px] font-medium tracking-wide text-[#1d1d1f] sm:text-[13px]">{label}</p>
      {kind === "make" ? (
        <div className="mx-auto mt-5 max-w-[28rem] sm:mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip icon={<Globe size={14} strokeWidth={2} />} text={t("screenContentChipSite")} />
            <Chip icon={<Package size={14} strokeWidth={2} />} text={t("screenContentChipProduct")} />
            <Chip icon={<Link2 size={14} strokeWidth={2} />} text={t("screenContentChipRefs")} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
            <ResultTile kind="image" caption={t("screenContentResultImage")} />
            <ResultTile kind="video" caption={t("screenContentResultVideo")} />
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-5 max-w-[22rem] sm:mt-6">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: LEADING_BLANKS }, (_, index) => (
              <span key={`blank-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: MONTH_DAYS }, (_, index) => {
              const day = index + 1;
              const heavy = day % 3 !== 0;
              return (
                <span
                  key={day}
                  className="flex aspect-square flex-col items-center justify-center rounded-[0.55rem] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                >
                  <span className="text-[10px] font-medium text-[#1d1d1f] sm:text-[11px]">{day}</span>
                  <span className="mt-0.5 flex gap-0.5">
                    <i className="block h-1.5 w-1.5 rounded-full bg-[#FF4713]" />
                    {heavy ? <i className="block h-1.5 w-1.5 rounded-full bg-[#1d1d1f]" /> : null}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:text-[13px]">
      <span className="text-[#86868b]">{icon}</span>
      {text}
    </span>
  );
}

function ResultTile({ kind, caption }: { kind: "image" | "video"; caption: string }) {
  const src = kind === "image" ? "/marketing/content-result-image.jpg" : "/marketing/content-result-video.jpg";
  return (
    <div className="overflow-hidden rounded-[1.1rem] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="relative aspect-[4/3] bg-[#ececef]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {kind === "video" ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm">
              <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#1d1d1f]" />
            </span>
          </span>
        ) : null}
      </div>
      <p className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[#1d1d1f]">
        <ImageIcon size={13} strokeWidth={2} className="text-[#86868b]" />
        {caption}
      </p>
    </div>
  );
}
