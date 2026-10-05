"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Landing");
  if (pathname !== "/") return null;
  return (
    <div className="bg-[#c5e3f3] px-4 py-5 text-center sm:py-6">
      <h2 className="text-[clamp(1.7rem,4vw,2.5rem)] font-semibold tracking-tight text-[#1d1d1f]">
        {t("kicker")}
      </h2>
      <div className="mx-auto mt-3 max-w-md">
        <WaitlistForm compact tone="onSky" />
      </div>
    </div>
  );
}
