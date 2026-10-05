"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Landing");
  if (pathname !== "/") return null;
  return (
    <div className="flex shrink-0 flex-col justify-center bg-[#c5e3f3] px-4 py-3 text-center sm:py-5 lg:min-h-[13.75rem] lg:py-8 xl:min-h-[15.5rem] xl:py-10">
      <h2 className="text-[1.25rem] font-semibold tracking-tight text-[#1d1d1f] sm:text-[1.5rem] lg:text-[clamp(1.7rem,4vw,2.5rem)]">
        {t("kicker")}
      </h2>
      <div className="mx-auto mt-2 max-w-md lg:mt-3">
        <WaitlistForm compact tone="onSky" />
      </div>
    </div>
  );
}
