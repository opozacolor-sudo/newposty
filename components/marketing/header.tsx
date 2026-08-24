"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { btnGhost, btnOutline } from "./styles";

export function MarketingHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);

  const leftLinks = (
    <>
      <Link href="/about" className={btnGhost} onClick={() => setOpen(false)}>
        {t("about")}
      </Link>
      <Link href="/guide" className={btnGhost} onClick={() => setOpen(false)}>
        {t("guide")}
      </Link>
      <Link href="/contact" className={btnGhost} onClick={() => setOpen(false)}>
        {t("contact")}
      </Link>
    </>
  );

  return (
    <header className="shrink-0 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-16 sm:px-6">
        <div className="flex items-center justify-start gap-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className="hidden items-center gap-6 md:flex">{leftLinks}</nav>
        </div>

        <Link href="/" className="justify-self-center" onClick={() => setOpen(false)}>
          <BrandLogo className="h-5 w-auto sm:h-8" width={97} height={20} />
        </Link>

        <div className="flex items-center justify-end">
          <Link
            href="/demo"
            className={`${btnOutline} !px-2.5 !py-1.5 !text-xs sm:!px-4 sm:!py-2.5 sm:!text-sm`}
            onClick={() => setOpen(false)}
          >
            {t("demo")}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">{leftLinks}</nav>
        </div>
      ) : null}
    </header>
  );
}
