import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="shrink-0 border-t border-neutral-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-1.5 overflow-hidden px-3 py-2 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <BrandLogo className="h-3.5 w-auto shrink-0 sm:h-6" width={117} height={24} />
          <span className="whitespace-nowrap text-[10px] text-neutral-500 sm:text-sm">
            {t("copyright")}
          </span>
        </div>
        <nav className="flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-5">
          <Link
            href="/privacy"
            className="whitespace-nowrap text-[10px] font-medium text-neutral-600 hover:text-neutral-900 sm:text-sm"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/terms"
            className="whitespace-nowrap text-[10px] font-medium text-neutral-600 hover:text-neutral-900 sm:text-sm"
          >
            {t("terms")}
          </Link>
          <LocaleSwitch className="shrink-0" />
        </nav>
      </div>
    </footer>
  );
}
