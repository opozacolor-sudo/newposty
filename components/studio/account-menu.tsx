"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type BillingState = {
  canDelete: boolean;
};

type DialogKind = "delete" | null;

export function AccountMenu({ email }: { email: string }) {
  const tNav = useTranslations("Nav");
  const t = useTranslations("Billing");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = (email.trim()[0] ?? "P").toUpperCase();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setDialog(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/account/billing")
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as BillingState;
      })
      .then((payload) => {
        if (!cancelled && payload) setBilling(payload);
      })
      .catch(() => {
        if (!cancelled) setBilling(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function closeDialog() {
    if (working) return;
    setDialog(null);
    setError(null);
  }

  async function runSignOut() {
    await fetch("/api/logout", { method: "POST", credentials: "include", redirect: "manual" });
    window.location.assign(`/${locale}`);
  }

  async function runDelete() {
    setWorking(true);
    setError(null);
    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        if (payload.error === "DISCONNECT_REQUIRED") {
          setError(t("deleteNeedDisconnect"));
        } else {
          setError(t("error"));
        }
        return;
      }
      window.location.assign(`/${locale}`);
    } catch {
      setError(t("error"));
    } finally {
      setWorking(false);
    }
  }

  const canDelete = billing?.canDelete ?? false;
  const billingReady = billing !== null;

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-[#6B7280]">{email}</p>
          <form
            action="/api/logout"
            method="post"
            onSubmit={(event) => {
              event.preventDefault();
              void runSignOut();
            }}
          >
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
            >
              {tNav("signOut")}
            </button>
          </form>
          <button
            type="button"
            disabled={!billingReady || !canDelete}
            title={canDelete ? undefined : t("deleteNeedDisconnect")}
            onClick={() => {
              if (!canDelete) return;
              setError(null);
              setDialog("delete");
            }}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
              canDelete ? "text-[#1A1A1A] hover:bg-[#F5F5F5]" : "cursor-not-allowed text-[#9CA3AF]"
            }`}
          >
            {tNav("deleteAccount")}
          </button>
          {billingReady && !canDelete ? (
            <p className="px-3 pb-2 text-[11px] leading-4 text-[#6B7280]">
              {t("deleteNeedDisconnect")}{" "}
              <Link href="/accounts/posts" className="text-[#FF4713]">
                {t("deleteAccounts")}
              </Link>
            </p>
          ) : null}

          {dialog === "delete" ? (
            <div className="mt-1 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3">
              <p className="text-sm font-medium text-[#1A1A1A]">{t("deleteTitle")}</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">{t("deleteBody")}</p>
              {error ? <p className="mt-2 text-xs text-[#FF4713]">{error}</p> : null}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={working}
                  onClick={closeDialog}
                  className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-2 py-1.5 text-xs text-[#1A1A1A]"
                >
                  {t("cancelAction")}
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => void runDelete()}
                  className="flex-1 rounded-xl bg-[#FF4713] px-2 py-1.5 text-xs text-white disabled:opacity-60"
                >
                  {working ? t("deleteWorking") : t("deleteConfirm")}
                </button>
              </div>
            </div>
          ) : null}
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
        </span>
      </button>
    </div>
  );
}
