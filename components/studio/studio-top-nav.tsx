"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { AccountMenu } from "@/components/studio/account-menu";
import { Link, usePathname } from "@/i18n/navigation";
import type { ClientRow } from "@/lib/clients";

const navLink =
  "apple-link whitespace-nowrap text-[12px] font-normal leading-none text-[#1d1d1f] transition hover:text-black";

export function StudioTopNav({
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
  const [inboxOpen, setInboxOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setInboxOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!inboxOpen) return;
    function onDown(event: PointerEvent) {
      if (inboxRef.current?.contains(event.target as Node)) return;
      setInboxOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [inboxOpen]);

  const items = [
    { href: "/chat", label: t("assistant"), active: pathname === "/chat" || pathname.startsWith("/chat/") },
    {
      href: "/connections",
      label: t("connections"),
      active: pathname.startsWith("/connections") || pathname.startsWith("/accounts"),
    },
    {
      href: "/posts",
      label: t("posts"),
      active: pathname.startsWith("/posts") || pathname.startsWith("/dashboard/posts"),
    },
    { href: "/analytics", label: t("analytics"), active: pathname.startsWith("/analytics") },
    { href: "/leads", label: t("leads"), active: pathname.startsWith("/leads") },
    {
      href: "/ads",
      label: t("ads"),
      active: pathname === "/ads" || pathname.startsWith("/ads/") || pathname.startsWith("/dashboard/ads"),
    },
    { href: "/help", label: t("guide"), active: pathname === "/help" || pathname.startsWith("/help/") },
  ] as const;

  function itemClass(active: boolean) {
    return `${navLink} ${active ? "font-medium text-black" : ""}`.trim();
  }

  return (
    <header className="sticky top-0 z-50 shrink-0">
      <div className="mx-auto flex h-10 w-full max-w-[1400px] items-center px-4 lg:grid lg:h-11 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <button
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#1d1d1f] lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/chat" className={`${navLink} posty-header-button shrink-0`}>
            <BrandLogo wordmark className="text-[12px] font-normal leading-none text-[#1d1d1f]" width={97} height={16} />
          </Link>
        </div>

        <nav className="posty-header-nav-island hidden items-center lg:flex">
          {items.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className={itemClass(item.active)}>
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={inboxRef} onMouseEnter={() => setInboxOpen(true)} onMouseLeave={() => setInboxOpen(false)}>
            <button
              type="button"
              className={itemClass(inInbox)}
              aria-expanded={inboxOpen}
              onClick={() => setInboxOpen((value) => !value)}
            >
              {t("messages")}
            </button>
            {inboxOpen ? (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                <div className="posty-header-popover w-52 rounded-2xl p-2 text-[#1d1d1f]">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link
                        href="/inbox?tab=messages"
                        className={`block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1d1d1f] ${
                          inInbox && !commentsOpen ? "font-medium" : ""
                        }`}
                      >
                        {t("messages")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/inbox?tab=comments"
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1d1d1f]"
                      >
                        {t("commentsNav")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
          {items.slice(4).map((item) => (
            <Link key={item.href} href={item.href} className={itemClass(item.active)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center justify-self-end lg:ml-0">
          <AccountMenu
            email={email}
            accountKind={accountKind}
            variant="header"
            clients={clients}
            selectedClientId={selectedClientId}
          />
        </div>
      </div>

      {mobileOpen ? (
        <div className="px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-3">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={`${navLink} text-left text-[15px]`}>
                {item.label}
              </Link>
            ))}
            <Link href="/inbox?tab=messages" className={`${navLink} text-left text-[15px]`}>
              {t("messages")}
            </Link>
            <Link href="/inbox?tab=comments" className={`${navLink} text-left text-[15px]`}>
              {t("commentsNav")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
