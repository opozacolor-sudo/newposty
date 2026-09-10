"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type DialogKind = "delete" | "upgrade" | null;

export function AccountMenu({
  email,
  accountKind = "individual",
}: {
  email: string;
  accountKind?: "individual" | "team";
}) {
  const tNav = useTranslations("Nav");
  const t = useTranslations("Billing");
  const tClients = useTranslations("Clients");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeName, setUpgradeName] = useState(email.split("@")[0] || "");
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

  function closeDialog() {
    if (working) return;
    setDialog(null);
    setError(null);
  }

  async function runSignOut() {
    await fetch("/api/logout", { method: "POST", credentials: "include", redirect: "manual" });
    window.location.assign(`/${locale}`);
  }

  async function runUpgrade() {
    setWorking(true);
    setError(null);
    try {
      const response = await fetch("/api/account/upgrade-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: upgradeName.trim() }),
      });
      if (!response.ok) {
        setError(tClients("error"));
        return;
      }
      window.location.reload();
    } catch {
      setError(tClients("error"));
    } finally {
      setWorking(false);
    }
  }

  async function runDelete() {
    setWorking(true);
    setError(null);
    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      if (!response.ok) {
        setError(t("error"));
        return;
      }
      window.location.assign(`/${locale}`);
    } catch {
      setError(t("error"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-2xl border border-[#E5E5E5] bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-xs text-[#6B7280]">{email}</p>
          {accountKind === "individual" ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setDialog("upgrade");
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
            >
              {tNav("switchToTeam")}
            </button>
          ) : null}
          <Link
            href="/contact"
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
            onClick={() => setOpen(false)}
          >
            {tNav("contact")}
          </Link>
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
            onClick={() => {
              setError(null);
              setDialog("delete");
            }}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
          >
            {tNav("deleteAccount")}
          </button>

          {dialog === "upgrade" ? (
            <div className="mt-1 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3">
              <p className="text-sm font-medium text-[#1A1A1A]">{tClients("upgradeTitle")}</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">{tClients("upgradeBody")}</p>
              <label className="mt-2 block text-xs text-[#6B7280]">
                {tClients("upgradeName")}
                <input
                  value={upgradeName}
                  onChange={(event) => setUpgradeName(event.target.value)}
                  maxLength={80}
                  className="mt-1 w-full rounded-lg border border-[#E5E5E5] bg-white px-2 py-1.5 text-sm text-[#1A1A1A]"
                />
              </label>
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
                  disabled={working || !upgradeName.trim()}
                  onClick={() => void runUpgrade()}
                  className="flex-1 rounded-xl bg-[#FF4713] px-2 py-1.5 text-xs text-white disabled:opacity-60"
                >
                  {tClients("upgradeConfirm")}
                </button>
              </div>
            </div>
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
