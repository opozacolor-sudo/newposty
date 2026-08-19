"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch({
  className = "",
  variant = "codes",
}: {
  className?: string;
  variant?: "codes" | "names";
}) {
  const locale = useLocale();
  const t = useTranslations("Locale");
  const router = useRouter();
  const pathname = usePathname();

  if (variant === "names") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {routing.locales.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => router.replace(pathname, { locale: item })}
            className={`rounded-full px-3 py-1.5 text-xs ${
              locale === item
                ? "bg-[#FF4713] text-white"
                : "border border-[#E5E5E5] bg-white text-[#6B7280] hover:text-[#1A1A1A]"
            }`}
          >
            {t(item)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-px rounded-full border border-line bg-card p-px text-[9px] sm:gap-1 sm:p-0.5 sm:text-xs ${className}`}
    >
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => router.replace(pathname, { locale: item })}
          className={`rounded-full px-1 py-px sm:px-2.5 sm:py-1 ${
            locale === item ? "bg-[#FF4713] text-white" : "text-muted hover:text-ink"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
