"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Landing");
  if (pathname !== "/") return null;
  return (
    <div className="posty-footer-signup-content">
      <div className="posty-footer-signup-copy">
        <h2 className="text-[clamp(0.88rem,2.2dvh,1.05rem)] font-semibold tracking-tight text-[#1d1d1f] sm:text-[1.2rem] lg:text-[1.3rem]">
          {t("kicker")}
        </h2>
        <p className="mt-1 text-center text-[11px] leading-4 text-[#6e6e73] sm:text-[13px] sm:leading-5">
          {t("waitlistLead")}
        </p>
      </div>
      <div className="posty-footer-signup-controls">
        <WaitlistForm compact hideLead />
      </div>
    </div>
  );
}
