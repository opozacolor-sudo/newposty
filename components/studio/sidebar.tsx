"use client";

import {
  BarChart3,
  ChevronDown,
  FileText,
  Megaphone,
  Menu,
  MessageCircle,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { LocaleSwitch } from "@/components/locale-switch";
import { AccountMenu } from "@/components/studio/account-menu";

function itemClass(active: boolean) {
  return `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
    active
      ? "bg-[#FF4713]/10 font-medium text-[#FF4713]"
      : "text-[#1A1A1A] hover:bg-[#F5F5F5]"
  }`;
}

export function StudioSidebar({ email }: { email: string }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const inStats = pathname.startsWith("/dashboard");
  const inAccounts = pathname.startsWith("/accounts");
  const [statsOpen, setStatsOpen] = useState(inStats);
  const [accountsOpen, setAccountsOpen] = useState(inAccounts);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (inStats) setStatsOpen(true);
    if (inAccounts) setAccountsOpen(true);
  }, [inAccounts, inStats]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const nav = (
    <>
      <Link href="/chat" className="flex shrink-0 items-center px-2 py-1">
        <BrandLogo className="h-6 w-auto" width={97} height={20} />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
        <Link href="/chat" className={itemClass(pathname === "/chat" || pathname.startsWith("/chat/"))}>
          <MessageCircle size={18} />
          {t("assistant")}
        </Link>

        <div>
          <button
            type="button"
            onClick={() => setStatsOpen((value) => !value)}
            className={itemClass(inStats)}
            aria-expanded={statsOpen}
          >
            <BarChart3 size={18} />
            {t("stats")}
            <ChevronDown
              size={16}
              className={`ml-auto shrink-0 transition ${statsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {statsOpen ? (
            <div className="mt-1 space-y-1 pl-4">
              <Link
                href="/dashboard/posts"
                className={itemClass(pathname === "/dashboard/posts")}
              >
                <FileText size={16} />
                {t("posts")}
              </Link>
              <Link href="/dashboard/ads" className={itemClass(pathname === "/dashboard/ads")}>
                <Megaphone size={16} />
                {t("ads")}
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setAccountsOpen((value) => !value)}
            className={itemClass(inAccounts)}
            aria-expanded={accountsOpen}
          >
            <Users size={18} />
            {t("accounts")}
            <ChevronDown
              size={16}
              className={`ml-auto shrink-0 transition ${accountsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {accountsOpen ? (
            <div className="mt-1 space-y-1 pl-4">
              <Link
                href="/accounts/posts"
                className={itemClass(pathname === "/accounts/posts")}
              >
                <FileText size={16} />
                {t("posts")}
              </Link>
              <Link href="/accounts/ads" className={itemClass(pathname === "/accounts/ads")}>
                <Megaphone size={16} />
                {t("ads")}
              </Link>
            </div>
          ) : null}
        </div>
      </nav>

      <div className="mt-4 shrink-0 space-y-3 border-t border-[#E5E5E5] pt-4">
        <LocaleSwitch variant="names" />
        <AccountMenu email={email} />
      </div>
    </>
  );

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-[#E5E5E5] bg-white px-4 lg:hidden">
        <Link href="/chat" className="flex items-center">
          <BrandLogo className="h-5 w-auto" width={97} height={20} />
        </Link>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1A]"
          onClick={() => setMobileOpen(true)}
          aria-label={t("openMenu")}
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-label={t("closeMenu")}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r border-[#E5E5E5] bg-white px-4 py-5 transition-transform lg:static lg:h-full lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A]"
            onClick={() => setMobileOpen(false)}
            aria-label={t("closeMenu")}
          >
            <X size={18} />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
