import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link } from "@/i18n/navigation";
import { btnGhost } from "./styles";

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="posty.now" className="h-6 w-auto" width={132} height={24} />
          <span className="text-sm text-neutral-500">{t("copyright")}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/privacy" className={btnGhost}>
            {t("privacy")}
          </Link>
          <Link href="/terms" className={btnGhost}>
            {t("terms")}
          </Link>
          <Link href="/contact" className={btnGhost}>
            {t("contact")}
          </Link>
          <LocaleSwitch />
        </nav>
      </div>
    </footer>
  );
}
