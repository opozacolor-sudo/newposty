"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type BillingState = {
  connectedAccounts: number;
  canDelete: boolean;
  lifetime: boolean;
  refund: {
    amountEur: number;
    monthsConsumed: number;
    paidEur: number;
    fullWithdrawal: boolean;
  } | null;
  subscription: { id: string; cancelAtPeriodEnd: boolean } | null;
};

type DialogKind = "refund" | "cancel" | "delete" | null;

export function AccountMenu({ email, lifetime = false }: { email: string; lifetime?: boolean }) {
  const tNav = useTranslations("Nav");
  const t = useTranslations("Billing");
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
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

  async function runAction(kind: Exclude<DialogKind, null>, path: string) {
    setWorking(true);
    setError(null);
    try {
      const response = await fetch(path, { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        if (payload.error === "DISCONNECT_REQUIRED") {
          setError(t("deleteNeedDisconnect"));
        } else if (payload.error === "NO_SUBSCRIPTION") {
          setError(t("cancelNone"));
        } else if (payload.error === "NO_PURCHASE" || payload.error === "NO_PAYMENT") {
          setError(t("refundNeedPurchase"));
        } else {
          setError(t("error"));
        }
        return;
      }
      if (kind === "delete") {
        window.location.assign("/");
        return;
      }
      setDialog(null);
      if (kind === "refund") {
        setNotice(t("refundDone"));
        window.location.reload();
        return;
      }
      setNotice(tNav("cancelSubscription"));
      setOpen(false);
    } catch {
      setError(t("error"));
    } finally {
      setWorking(false);
    }
  }

  const canDelete = billing?.canDelete ?? false;
  const hasSubscription = Boolean(billing?.subscription);
  const refundAmount = billing?.refund?.amountEur ?? 0;
  const billingReady = billing !== null;

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-[#6B7280]">{email}</p>
          {notice ? <p className="px-3 pb-2 text-xs text-emerald-700">{notice}</p> : null}
          {billing?.lifetime || lifetime ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setDialog("refund");
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
            >
              {tNav("refund")}
            </button>
          ) : null}
          <button
            type="button"
            disabled={!hasSubscription}
            title={hasSubscription ? undefined : tNav("cancelUnavailable")}
            onClick={() => {
              if (!hasSubscription) return;
              setError(null);
              setDialog("cancel");
            }}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
              hasSubscription
                ? "text-[#1A1A1A] hover:bg-[#F5F5F5]"
                : "cursor-not-allowed text-[#9CA3AF]"
            }`}
          >
            {tNav("cancelSubscription")}
          </button>
          <form action="/api/logout" method="post">
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

          {dialog ? (
            <div className="mt-1 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3">
              {dialog === "refund" ? (
                <>
                  <p className="text-sm font-medium text-[#1A1A1A]">{t("refundTitle")}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">
                    {refundAmount > 0
                      ? t("refundBody", { amount: refundAmount })
                      : t("refundBodyZero")}
                  </p>
                </>
              ) : null}
              {dialog === "cancel" ? (
                <>
                  <p className="text-sm font-medium text-[#1A1A1A]">{t("cancelTitle")}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">{t("cancelBody")}</p>
                </>
              ) : null}
              {dialog === "delete" ? (
                <>
                  <p className="text-sm font-medium text-[#1A1A1A]">{t("deleteTitle")}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">{t("deleteBody")}</p>
                </>
              ) : null}
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
                  onClick={() => {
                    if (dialog === "refund") void runAction("refund", "/api/account/refund");
                    if (dialog === "cancel") {
                      void runAction("cancel", "/api/account/subscription/cancel");
                    }
                    if (dialog === "delete") void runAction("delete", "/api/account/delete");
                  }}
                  className="flex-1 rounded-xl bg-[#FF4713] px-2 py-1.5 text-xs text-white disabled:opacity-60"
                >
                  {working
                    ? dialog === "refund"
                      ? t("refundWorking")
                      : dialog === "cancel"
                        ? t("cancelWorking")
                        : t("deleteWorking")
                    : dialog === "refund"
                      ? t("refundConfirm")
                      : dialog === "cancel"
                        ? t("cancelConfirm")
                        : t("deleteConfirm")}
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
          {lifetime ? (
            <span className="text-[11px] font-medium text-[#FF4713]">{tNav("lifetime")}</span>
          ) : null}
        </span>
      </button>
    </div>
  );
}
