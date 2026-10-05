"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch({
  className = "",
  variant = "codes",
}: {
  className?: string;
  variant?: "codes" | "names" | "onDark";
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
    <label className={`inline-flex items-center ${className}`}>
      <span className="sr-only">{t(locale)}</span>
      <select
        value={locale}
        onChange={(event) => router.replace(pathname, { locale: event.target.value })}
        className={
          variant === "onDark"
            ? "rounded-full border border-[#E4EEF0]/30 bg-transparent px-2 py-1 text-[10px] uppercase text-[#E4EEF0] sm:px-2.5 sm:text-xs"
            : "rounded-full border border-line bg-card px-2 py-1 text-[10px] uppercase text-ink sm:px-2.5 sm:text-xs"
        }
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
