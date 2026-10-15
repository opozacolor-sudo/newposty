"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { btnSolid } from "@/components/marketing/styles";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  const t = useTranslations("Footer");
  if (pathname === "/join") return null;
  return (
    <div className="posty-footer-signup-content">
      <div className="posty-footer-signup-controls flex justify-center">
        <Link href="/join" className={`${btnSolid} posty-site-btn min-w-[10rem] px-6 py-2.5`}>
          {t("register")}
        </Link>
      </div>
    </div>
  );
}
