"use client";

import {
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  Inbox,
  Link2,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { LocaleSwitch } from "@/components/locale-switch";
import { AccountMenu } from "@/components/studio/account-menu";
import { ClientSwitcher } from "@/components/studio/client-switcher";
import { LocaleClock } from "@/components/studio/locale-clock";
import type { ClientRow } from "@/lib/clients";

function itemClass(active: boolean) {
  return `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
    active
      ? "bg-[#FF4713]/10 font-medium text-[#FF4713]"
      : "text-[#1A1A1A] hover:bg-[#F5F5F5]"
  }`;
}

export function StudioSidebar({
  email,
  accountKind = "individual",
  clients = [],
  selectedClientId = null,
}: {
  email: string;
  accountKind?: "individual" | "team";
  clients?: ClientRow[];
  selectedClientId?: string | null;
}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inInbox = pathname.startsWith("/inbox");
  const commentsOpen = inInbox && searchParams.get("tab") === "comments";
  const [inboxOpen, setInboxOpen] = useState(inInbox);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (inInbox) setInboxOpen(true);
  }, [inInbox]);

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
        <Link href="/connections" className={itemClass(pathname.startsWith("/connections") || pathname.startsWith("/accounts"))}>
          <Link2 size={18} />
          {t("connections")}
        </Link>
        <Link href="/posts" className={itemClass(pathname.startsWith("/posts") || pathname.startsWith("/dashboard/posts"))}>
          <FileText size={18} />
          {t("posts")}
        </Link>
        <Link href="/analytics" className={itemClass(pathname.startsWith("/analytics"))}>
          <BarChart3 size={18} />
          {t("analytics")}
        </Link>
        <div>
          <button
            type="button"
            onClick={() => setInboxOpen((value) => !value)}
            className={itemClass(inInbox)}
            aria-expanded={inboxOpen}
          >
            <Inbox size={18} />
            {t("messages")}
            <ChevronDown size={16} className={`ml-auto shrink-0 transition ${inboxOpen ? "rotate-180" : ""}`} />
          </button>
          {inboxOpen ? (
            <div className="mt-1 space-y-1 pl-4">
              <Link href="/inbox?tab=messages" className={itemClass(inInbox && !commentsOpen)}>
                <Mail size={16} />
                {t("messages")}
              </Link>
              <Link href="/inbox?tab=comments" className={itemClass(commentsOpen)}>
                <MessageCircle size={16} />
                {t("commentsNav")}
              </Link>
            </div>
          ) : null}
        </div>
        <Link href="/ads" className={itemClass(pathname === "/ads" || pathname.startsWith("/ads/") || pathname.startsWith("/dashboard/ads"))}>
          <Megaphone size={18} />
          {t("ads")}
        </Link>

        <Link href="/help" className={itemClass(pathname === "/help" || pathname.startsWith("/help/"))}>
          <BookOpen size={18} />
          {t("guide")}
        </Link>
        <Link href="/contact" className={itemClass(pathname === "/contact")}>
          <Mail size={18} />
          {t("contact")}
        </Link>

      </nav>

      <div className="mt-4 shrink-0 space-y-3 border-t border-[#E5E5E5] pt-4">
        {accountKind === "team" ? (
          <ClientSwitcher clients={clients} selectedId={selectedClientId} />
        ) : null}
        <LocaleClock />
        <LocaleSwitch variant="names" />
        <AccountMenu email={email} accountKind={accountKind} />
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
