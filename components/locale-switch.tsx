"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-line bg-card p-px text-[10px] sm:gap-1 sm:p-0.5 sm:text-xs ${className}`}
    >
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => router.replace(pathname, { locale: item })}
          className={`rounded-full px-1.5 py-0.5 sm:px-2.5 sm:py-1 ${
            locale === item ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
