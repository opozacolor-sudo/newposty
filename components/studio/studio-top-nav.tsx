"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

const navLink = "whitespace-nowrap text-[#1d1d1f] transition hover:text-black";
const desktopLink = `${navLink} studio-nav-link`;

function desktopClass(active: boolean) {
  return `${desktopLink} ${active ? "font-medium text-black" : ""}`.trim();
}

function mobileClass(active: boolean) {
  return `${navLink} text-[15px] ${active ? "font-medium text-black" : ""}`.trim();
}

export function StudioTopNav() {
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

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-11 w-full max-w-[1100px] items-center gap-3 px-4">
        <button
          type="button"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#1d1d1f] lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link href="/chat" className={`${desktopLink} shrink-0`}>
          posty.now
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-evenly lg:flex">
          {items.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className={desktopClass(item.active)}>
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={inboxRef}>
            <button
              type="button"
              className={`${desktopClass(inInbox)} inline-flex items-center gap-0.5 bg-transparent p-0`}
              aria-expanded={inboxOpen}
              onClick={() => setInboxOpen((value) => !value)}
            >
              {t("messages")}
              <ChevronDown size={12} className={inboxOpen ? "rotate-180" : ""} />
            </button>
            {inboxOpen ? (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-44 -translate-x-1/2 rounded-2xl border border-black/5 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                <Link
                  href="/inbox?tab=messages"
                  className={`block rounded-xl px-3 py-2 text-[13px] ${inInbox && !commentsOpen ? "bg-[#f5f5f7] font-medium" : "hover:bg-[#f5f5f7]"}`}
                >
                  {t("messages")}
                </Link>
                <Link
                  href="/inbox?tab=comments"
                  className={`block rounded-xl px-3 py-2 text-[13px] ${commentsOpen ? "bg-[#f5f5f7] font-medium" : "hover:bg-[#f5f5f7]"}`}
                >
                  {t("commentsNav")}
                </Link>
              </div>
            ) : null}
          </div>
          {items.slice(4).map((item) => (
            <Link key={item.href} href={item.href} className={desktopClass(item.active)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen ? (
        <div className="border-t border-black/5 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-3">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={mobileClass(item.active)}>
                {item.label}
              </Link>
            ))}
            <Link href="/inbox?tab=messages" className={mobileClass(inInbox && !commentsOpen)}>
              {t("messages")}
            </Link>
            <Link href="/inbox?tab=comments" className={mobileClass(!!commentsOpen)}>
              {t("commentsNav")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
