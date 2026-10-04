"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function LeadAgentPanel({
  siteUrl,
  trained,
  enabled,
  business,
  products,
  labels,
}: {
  siteUrl: string;
  trained: boolean;
  enabled: boolean;
  business: string;
  products: number;
  labels: {
    site: string;
    train: string;
    training: string;
    trained: string;
    enable: string;
    disable: string;
    locked: string;
    addon: string;
    products: string;
    failed: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"train" | "enable" | null>(null);
  const [error, setError] = useState("");

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 p-4">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setBusy("train");
          setError("");
          const response = await fetch("/api/leads/train", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ site_url: form.get("site_url") }),
          });
          setBusy(null);
          if (!response.ok) {
            setError(labels.failed);
            return;
          }
          router.refresh();
        }}
      >
        <label className="min-w-[16rem] flex-1 text-xs text-neutral-500">
          {labels.site}
          <input
            name="site_url"
            type="url"
            required
            defaultValue={siteUrl}
            placeholder="https://"
            className="mt-1 block w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900"
          />
        </label>
        <button
          type="submit"
          disabled={busy !== null}
          className="rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy === "train" ? labels.training : labels.train}
        </button>
      </form>
      <p className="mt-3 text-sm text-neutral-600">{labels.addon}</p>
      {trained ? (
        <p className="mt-2 text-sm text-neutral-700">
          {labels.trained}
          {business ? ` · ${business}` : ""}
          {products ? ` · ${products} ${labels.products}` : ""}
        </p>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">{labels.locked}</p>
      )}
      <button
        type="button"
        disabled={!trained || busy !== null}
        className={`mt-3 rounded-lg px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
          enabled ? "bg-neutral-200 text-neutral-800" : "bg-[#FF4713] text-white"
        }`}
        onClick={async () => {
          if (!trained) return;
          setBusy("enable");
          setError("");
          const response = await fetch("/api/leads/enable", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: !enabled }),
          });
          setBusy(null);
          if (!response.ok) {
            setError(labels.failed);
            return;
          }
          router.refresh();
        }}
      >
        {enabled ? labels.disable : labels.enable}
      </button>
      {error ? <p className="mt-2 text-sm text-[#FF4713]">{error}</p> : null}
    </section>
  );
}
