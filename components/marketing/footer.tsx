import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { btnGhost } from "./styles";

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="shrink-0 border-t border-neutral-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-6 w-auto" width={117} height={24} />
          <span className="text-sm text-neutral-500">{t("copyright")}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/privacy" className={btnGhost}>
            {t("privacy")}
          </Link>
          <Link href="/terms" className={btnGhost}>
            {t("terms")}
          </Link>
          <LocaleSwitch />
        </nav>
      </div>
    </footer>
  );
}
