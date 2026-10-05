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

const navLink =
  "whitespace-nowrap text-[11px] font-medium text-[#E4EEF0] transition hover:text-white xl:text-[12px]";

function DesktopMenu({
  label,
  open,
  onOpen,
  onClose,
  children,
  wide,
  narrow,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  narrow?: boolean;
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
        className={`${navLink} inline-flex items-center gap-0.5`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown size={12} className={open ? "rotate-180 transition" : "transition"} />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div
            className={`${
              narrow
                ? "w-52 p-2"
                : wide
                  ? "w-[min(36rem,calc(100vw-2rem))] p-4 sm:p-5"
                  : "w-[min(32rem,calc(100vw-2rem))] p-4 sm:p-5"
            } rounded-2xl border border-neutral-100 bg-white text-neutral-900 shadow-[0_18px_50px_rgba(0,0,0,0.12)]`}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MoreLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Header");
  const items = [
    { href: "/specialist", label: t("specialist") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-50"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MarketingHeader() {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState<"features" | "platforms" | "madeFor" | "more" | null>(null);
  const [mobile, setMobile] = useState<"features" | "platforms" | "madeFor" | "more" | null>(null);

  const closeAll = () => {
    setOpen(false);
    setDesktop(null);
    setMobile(null);
  };

  const legalLinks = [
    { href: "/demo", label: t("demo") },
    { href: "/guide", label: t("guide") },
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/legal", label: t("legal") },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <header
        className={`pointer-events-auto mx-auto max-w-6xl bg-[#FF5B04] shadow-[0_8px_28px_rgba(255,91,4,0.28)] ${
          open ? "rounded-[1.4rem]" : "rounded-full"
        }`}
      >
        <div className="flex h-9 items-center gap-2 px-3 sm:h-10 sm:gap-3 sm:px-4">
          <button
            type="button"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#E4EEF0] lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link href="/" className="shrink-0 leading-none" onClick={closeAll}>
            <BrandLogo light className="text-[15px] leading-none sm:text-[16px]" width={97} height={16} />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-2.5 overflow-x-auto lg:flex xl:gap-3">
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
            <DesktopMenu
              label={t("more")}
              open={desktop === "more"}
              onOpen={() => setDesktop("more")}
              onClose={() => setDesktop((value) => (value === "more" ? null : value))}
              narrow
            >
              <MoreLinks onNavigate={closeAll} />
            </DesktopMenu>
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className={navLink} onClick={closeAll}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/login" className={`${navLink} hidden sm:inline`} onClick={closeAll}>
              {t("signIn")}
            </Link>
            <Link
              href={SIGNUPS_OPEN ? "/signup" : "/waitlist"}
              className="inline-flex items-center rounded-full border border-[#E4EEF0]/70 px-2.5 py-0.5 text-[11px] font-medium text-[#E4EEF0] transition hover:bg-[#E4EEF0]/10"
              onClick={closeAll}
            >
              {SIGNUPS_OPEN ? t("signUp") : t("notifyMe")}
            </Link>
          </div>
        </div>

        {open ? (
          <div className="border-t border-white/15 px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-2.5">
              <button
                type="button"
                className={`${navLink} inline-flex items-center justify-between text-left`}
                aria-expanded={mobile === "features"}
                onClick={() => setMobile((value) => (value === "features" ? null : "features"))}
              >
                {t("features")}
                <ChevronDown size={14} className={mobile === "features" ? "rotate-180 transition" : "transition"} />
              </button>
              {mobile === "features" ? (
                <div className="rounded-2xl bg-white p-3 text-neutral-900">
                  <FeaturesPanel onNavigate={closeAll} />
                </div>
              ) : null}
              <button
                type="button"
                className={`${navLink} inline-flex items-center justify-between text-left`}
                aria-expanded={mobile === "platforms"}
                onClick={() => setMobile((value) => (value === "platforms" ? null : "platforms"))}
              >
                {t("platforms")}
                <ChevronDown size={14} className={mobile === "platforms" ? "rotate-180 transition" : "transition"} />
              </button>
              {mobile === "platforms" ? (
                <div className="rounded-2xl bg-white p-3 text-neutral-900">
                  <PlatformsPanel onNavigate={closeAll} />
                </div>
              ) : null}
              <button
                type="button"
                className={`${navLink} inline-flex items-center justify-between text-left`}
                aria-expanded={mobile === "madeFor"}
                onClick={() => setMobile((value) => (value === "madeFor" ? null : "madeFor"))}
              >
                {t("madeFor")}
                <ChevronDown size={14} className={mobile === "madeFor" ? "rotate-180 transition" : "transition"} />
              </button>
              {mobile === "madeFor" ? (
                <div className="rounded-2xl bg-white p-3 text-neutral-900">
                  <MadeForPanel onNavigate={closeAll} />
                </div>
              ) : null}
              <button
                type="button"
                className={`${navLink} inline-flex items-center justify-between text-left`}
                aria-expanded={mobile === "more"}
                onClick={() => setMobile((value) => (value === "more" ? null : "more"))}
              >
                {t("more")}
                <ChevronDown size={14} className={mobile === "more" ? "rotate-180 transition" : "transition"} />
              </button>
              {mobile === "more" ? (
                <div className="rounded-2xl bg-white p-2 text-neutral-900">
                  <MoreLinks onNavigate={closeAll} />
                </div>
              ) : null}
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className={navLink} onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className={navLink} onClick={closeAll}>
                {t("signIn")}
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
    </div>
  );
}
