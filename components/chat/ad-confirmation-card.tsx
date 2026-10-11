"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { adSummaryLines } from "@/lib/chat-post/ads";
import type { AdConfirmationPayload } from "@/lib/chat-post/types";

export function AdConfirmationCard({
  payload,
  onDone,
}: {
  payload: AdConfirmationPayload;
  onDone: (next: { kind: "results" | "cancelled"; payload?: unknown }) => void;
}) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const ad = payload.resolved.ad;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!ad) return null;
  const lines = adSummaryLines(ad, locale);

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_id: payload.action_id, locale }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? t("adFailed"));
        setBusy(false);
        return;
      }
      onDone({
        kind: "results",
        payload: {
          type: "results",
          action_id: payload.action_id,
          results: body.results,
          allFailed: body.allFailed,
        },
      });
    } catch {
      setError(t("adFailed"));
      setBusy(false);
    }
  }

  async function cancel() {
    if (busy) return;
    setBusy(true);
    await fetch("/api/posts/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id: payload.action_id, cancel: true, locale }),
    });
    onDone({ kind: "cancelled" });
  }

  return (
    <div className="mt-3 space-y-3 rounded-2xl border border-[#E5E5E5] bg-white p-4">
      <p className="text-sm font-medium text-[#1A1A1A]">{t("adConfirmTitle")}</p>
      <p className="text-sm font-semibold text-[#9A3412]">{t("adConfirmSpend")}</p>
      <p className="text-sm text-[#1A1A1A]">{t("adConfirmHint")}</p>
      <ul className="space-y-1 text-sm leading-5 text-[#5c5652]">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {ad.caption ? <p className="whitespace-pre-wrap text-sm text-[#1A1A1A]">{ad.caption}</p> : null}
      {error ? <p className="text-sm text-[#9A3412]">{error}</p> : null}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void confirm()}
          className="w-full rounded-full bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {busy ? t("adWorking") : t("adConfirmButton")}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void cancel()}
          className="w-full rounded-full border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium text-[#1A1A1A] disabled:opacity-40"
        >
          {t("cancelPost")}
        </button>
      </div>
    </div>
  );
}
