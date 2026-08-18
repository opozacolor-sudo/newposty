"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { btnGhost, btnOutline, btnSolid } from "./styles";

export function MarketingHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);

  const leftLinks = (
    <>
      <Link href="/about" className={btnGhost} onClick={() => setOpen(false)}>
        {t("about")}
      </Link>
      <Link href="/contact" className={btnGhost} onClick={() => setOpen(false)}>
        {t("contact")}
      </Link>
    </>
  );

  return (
    <header className="shrink-0 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <div className="flex items-center justify-start gap-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className="hidden items-center gap-6 md:flex">{leftLinks}</nav>
        </div>

        <Link href="/" className="justify-self-center" onClick={() => setOpen(false)}>
          <BrandLogo className="h-7 w-auto sm:h-8" width={156} height={32} />
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button type="button" className={`${btnOutline} hidden md:inline-flex`}>
            {t("demo")}
          </button>
          <Link href="/login" className={`${btnGhost} hidden md:inline-flex px-2`}>
            {t("signIn")}
          </Link>
          <Link href="/signup" className={btnSolid}>
            {t("signUp")}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {leftLinks}
            <button type="button" className={`${btnOutline} w-full`}>
              {t("demo")}
            </button>
            <Link
              href="/login"
              className={`${btnOutline} w-full`}
              onClick={() => setOpen(false)}
            >
              {t("signIn")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
