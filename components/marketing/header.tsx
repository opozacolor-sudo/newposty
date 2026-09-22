"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./brand-logo";
import { FeaturesPanel } from "./features-menu";
import { MadeForPanel } from "./made-for-menu";
import { PlatformsPanel } from "./platforms-menu";
import { btnGhost, btnSolid } from "./styles";

function DesktopMenu({
  label,
  open,
  onOpen,
  onClose,
  children,
  wide,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="relative" ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={`${btnGhost} inline-flex items-center gap-1 whitespace-nowrap`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown size={14} className={open ? "rotate-180 transition" : "transition"} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 pt-3">
          <div
            className={`${wide ? "w-[min(36rem,calc(100vw-2rem))]" : "w-[min(32rem,calc(100vw-2rem))]"} rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-5`}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MarketingHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState<"features" | "platforms" | "madeFor" | null>(null);
  const [mobile, setMobile] = useState<"features" | "platforms" | "madeFor" | null>(null);

  const closeAll = () => {
    setOpen(false);
    setDesktop(null);
    setMobile(null);
  };

  return (
    <header className="relative z-50 shrink-0 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-3 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center justify-start gap-4 lg:gap-5">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className="hidden min-w-0 items-center gap-3 lg:flex xl:gap-5">
            <DesktopMenu
              label={t("features")}
              open={desktop === "features"}
              onOpen={() => setDesktop("features")}
              onClose={() => setDesktop((value) => (value === "features" ? null : value))}
            >
              <FeaturesPanel onNavigate={closeAll} />
            </DesktopMenu>
            <DesktopMenu
              label={t("platforms")}
              open={desktop === "platforms"}
              onOpen={() => setDesktop("platforms")}
              onClose={() => setDesktop((value) => (value === "platforms" ? null : value))}
              wide
            >
              <PlatformsPanel onNavigate={closeAll} />
            </DesktopMenu>
            <DesktopMenu
              label={t("madeFor")}
              open={desktop === "madeFor"}
              onOpen={() => setDesktop("madeFor")}
              onClose={() => setDesktop((value) => (value === "madeFor" ? null : value))}
            >
              <MadeForPanel onNavigate={closeAll} />
            </DesktopMenu>
            <Link href="/about" className={`${btnGhost} whitespace-nowrap`} onClick={closeAll}>
              {t("about")}
            </Link>
            <Link href="/contact" className={`${btnGhost} whitespace-nowrap`} onClick={closeAll}>
              {t("contact")}
            </Link>
          </nav>
        </div>

        <Link href="/" className="justify-self-center" onClick={closeAll}>
          <BrandLogo className="h-5 w-auto sm:h-8" width={97} height={20} />
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Link href="/login" className={`${btnGhost} hidden sm:inline`} onClick={closeAll}>
            {t("signIn")}
          </Link>
          <Link
            href={SIGNUPS_OPEN ? "/signup" : "/waitlist"}
            className={`${btnSolid} !px-2.5 !py-1.5 !text-xs sm:!px-4 sm:!py-2.5 sm:!text-sm`}
            onClick={closeAll}
          >
            {SIGNUPS_OPEN ? t("signUp") : t("notifyMe")}
          </Link>
        </div>
      </div>

      {open ? (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            <button
              type="button"
              className={`${btnGhost} inline-flex items-center justify-between text-left`}
              aria-expanded={mobile === "features"}
              onClick={() => setMobile((value) => (value === "features" ? null : "features"))}
            >
              {t("features")}
              <ChevronDown size={16} className={mobile === "features" ? "rotate-180 transition" : "transition"} />
            </button>
            {mobile === "features" ? (
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3">
                <FeaturesPanel onNavigate={closeAll} />
              </div>
            ) : null}
            <button
              type="button"
              className={`${btnGhost} inline-flex items-center justify-between text-left`}
              aria-expanded={mobile === "platforms"}
              onClick={() => setMobile((value) => (value === "platforms" ? null : "platforms"))}
            >
              {t("platforms")}
              <ChevronDown size={16} className={mobile === "platforms" ? "rotate-180 transition" : "transition"} />
            </button>
            {mobile === "platforms" ? (
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3">
                <PlatformsPanel onNavigate={closeAll} />
              </div>
            ) : null}
            <button
              type="button"
              className={`${btnGhost} inline-flex items-center justify-between text-left`}
              aria-expanded={mobile === "madeFor"}
              onClick={() => setMobile((value) => (value === "madeFor" ? null : "madeFor"))}
            >
              {t("madeFor")}
              <ChevronDown size={16} className={mobile === "madeFor" ? "rotate-180 transition" : "transition"} />
            </button>
            {mobile === "madeFor" ? (
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3">
                <MadeForPanel onNavigate={closeAll} />
              </div>
            ) : null}
            <Link href="/about" className={btnGhost} onClick={closeAll}>
              {t("about")}
            </Link>
            <Link href="/contact" className={btnGhost} onClick={closeAll}>
              {t("contact")}
            </Link>
            <Link href="/login" className={btnGhost} onClick={closeAll}>
              {t("signIn")}
            </Link>
            <Link
              href={SIGNUPS_OPEN ? "/signup" : "/waitlist"}
              className={btnSolid}
              onClick={closeAll}
            >
              {SIGNUPS_OPEN ? t("signUp") : t("notifyMe")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
