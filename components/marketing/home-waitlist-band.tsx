"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Landing");
  if (pathname !== "/") return null;
  return (
    <div className="flex shrink-0 flex-col justify-center bg-[#c5e3f3] px-4 py-2.5 text-center sm:py-4 lg:min-h-[13.75rem] lg:py-8 xl:min-h-[15.5rem] xl:py-10 [@media(max-height:920px)]:lg:min-h-0 [@media(max-height:920px)]:lg:py-3 [@media(max-height:920px)]:xl:min-h-0 [@media(max-height:920px)]:xl:py-4">
      <h2 className="text-[1.15rem] font-semibold tracking-tight text-[#1d1d1f] sm:text-[1.4rem] lg:text-[clamp(1.7rem,4vw,2.5rem)] [@media(max-height:920px)]:lg:text-[1.4rem]">
        {t("kicker")}
      </h2>
      <div className="mx-auto mt-1 w-full max-w-[16.5rem] lg:mt-3 lg:max-w-md">
        <WaitlistForm compact tone="onSky" />
      </div>
    </div>
  );
}
