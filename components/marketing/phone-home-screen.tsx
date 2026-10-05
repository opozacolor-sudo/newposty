"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PLATFORMS } from "@/lib/platforms";

const HERO_APPS = [
  "tiktok",
  "facebook",
  "instagram",
  "youtube",
  "googlebusiness",
  "pinterest",
  "twitter",
  "bluesky",
  "linkedin",
  "threads",
] as const;

export function PhoneHomeScreen() {
  const t = useTranslations("Landing");
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col px-[8%] pb-[8%] pt-[15%] text-white">
      <p
        className={`text-center text-[clamp(8px,1.35vw,12px)] font-semibold leading-[1.2] tracking-tight ${
          reduce ? "" : "phone-title-in"
        }`}
      >
        {t("phoneAllNetworks")}
      </p>
      <ul className="mt-[8%] grid grid-cols-4 gap-x-[8%] gap-y-[9%]">
        {HERO_APPS.map((id, index) => {
          const platform = PLATFORMS.find((item) => item.id === id);
          if (!platform) return null;
          return (
            <li
              key={id}
              className={`min-w-0 ${index === 8 ? "col-start-2" : ""} ${reduce ? "" : "phone-app-in"}`}
              style={reduce ? undefined : { animationDelay: `${0.55 + index * 0.08}s` }}
            >
              <span
                className="flex aspect-square w-full items-center justify-center rounded-[23%] shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
                style={{ background: platform.iconBg }}
                title={platform.label}
              >
                <svg viewBox="0 0 24 24" className="h-[54%] w-[54%] fill-white" aria-hidden>
                  <path d={platform.icon.path} />
                </svg>
              </span>
            </li>
          );
        })}
      </ul>
      <span className="mx-auto mt-auto h-[3px] w-[30%] rounded-full bg-white/30" />
    </div>
  );
}
