"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function AccountMenu({ email, lifetime = false }: { email: string; lifetime?: boolean }) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = (email.trim()[0] ?? "P").toUpperCase();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-[#6B7280]">{email}</p>
          <form action="/api/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
            >
              {t("signOut")}
            </button>
          </form>
          <button
            type="button"
            disabled
            title={t("comingSoon")}
            className="w-full cursor-not-allowed rounded-xl px-3 py-2 text-left text-sm text-[#9CA3AF]"
          >
            {t("deleteAccount")}
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-[#F5F5F5]"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF4713] text-sm font-medium text-white">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-[#1A1A1A]">{email}</span>
          {lifetime ? (
            <span className="text-[11px] font-medium text-[#FF4713]">{t("lifetime")}</span>
          ) : null}
        </span>
      </button>
    </div>
  );
}
