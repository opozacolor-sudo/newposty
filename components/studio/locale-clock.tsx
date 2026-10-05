"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clockSnapshot } from "@/lib/locale-time";

export function LocaleClock({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = now ? clockSnapshot(locale, now) : null;

  return (
    <div className={compact ? "" : "px-1"} aria-label={t("localTime")}>
      {clock ? (
        compact ? (
          <p className="text-[11px] tabular-nums text-[#6e6e73]">
            <span className="text-[#1d1d1f]">{clock.timeLabel}</span>
            <span className="mx-1.5">·</span>
            <span className="capitalize">{clock.dateLabel}</span>
          </p>
        ) : (
          <>
            <p className="font-medium tabular-nums tracking-tight text-[#1A1A1A]">{clock.timeLabel}</p>
            <p className="mt-0.5 text-[11px] capitalize leading-4 text-[#6B7280]">{clock.dateLabel}</p>
          </>
        )
      ) : (
        <div className={compact ? "h-4" : "h-10"} />
      )}
    </div>
  );
}
