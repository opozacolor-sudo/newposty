"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-card p-0.5 text-xs">
      {routing.locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => router.replace(pathname, { locale: item })}
          className={`rounded-full px-2.5 py-1 ${
            locale === item ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
