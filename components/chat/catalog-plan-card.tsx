"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CatalogPlanPayload, ConfirmationPayload } from "@/lib/chat-post/types";

export function CatalogPlanCard({
  payload,
  conversationId,
  onReady,
}: {
  payload: CatalogPlanPayload;
  conversationId: string;
  onReady: (next: ConfirmationPayload) => void;
}) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (busy || !payload.generation_ready) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, plan: payload, locale }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? t("catalogFailed"));
        setBusy(false);
        return;
      }
      onReady({ type: "confirmation", action_id: body.action_id, resolved: body.resolved });
    } catch {
      setError(t("catalogFailed"));
      setBusy(false);
    }
  }

  return (
    <section className="mt-3 space-y-3 rounded-2xl border border-[#E5E5E5] bg-white p-4">
      <div>
        <p className="text-sm font-medium text-[#1A1A1A]">{t("catalogTitle", { count: payload.count })}</p>
        <p className="text-xs text-[#6B7280]">
          {payload.generation_ready ? t("catalogHint") : t("catalogHintNoCredit")}
        </p>
        <p className="mt-1 truncate text-[11px] text-[#6B7280]">{payload.site_url}</p>
      </div>
      <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {payload.products.map((product) => (
          <li key={product.url} className="flex gap-2 rounded-xl border border-[#F3F4F6] p-2">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5]">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#1A1A1A]">{product.name}</p>
              <p className="truncate text-[11px] text-[#6B7280]">{product.price || product.url}</p>
            </div>
          </li>
        ))}
      </ul>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <button
        type="button"
        disabled={busy || !payload.generation_ready}
        onClick={() => void confirm()}
        className="rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {busy ? t("catalogWorking") : t("catalogConfirm")}
      </button>
    </section>
  );
}
