"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Landing");
  if (pathname !== "/") return null;
  return (
    <div className="flex shrink-0 flex-col justify-center bg-[#c5e3f3] px-4 py-1 text-center sm:py-3 lg:min-h-0 lg:py-2.5 xl:py-3 [@media(min-height:1100px)]:lg:min-h-[13.75rem] [@media(min-height:1100px)]:lg:py-8 [@media(min-height:1100px)]:xl:min-h-[15.5rem] [@media(min-height:1100px)]:xl:py-10">
      <h2 className="text-[clamp(0.88rem,2.2dvh,1.05rem)] font-semibold tracking-tight text-[#1d1d1f] sm:text-[1.25rem] lg:text-[1.35rem] [@media(min-height:1100px)]:lg:text-[clamp(1.7rem,4vw,2.5rem)]">
        {t("kicker")}
      </h2>
      <div className="mx-auto mt-0.5 w-full max-w-[20rem] lg:mt-1.5 lg:max-w-md">
        <WaitlistForm compact tone="onSky" />
      </div>
    </div>
  );
}
