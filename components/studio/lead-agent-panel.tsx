"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

type CoachTurn = { role: "user" | "agent"; text: string };

export function LeadAgentPanel({
  siteUrl,
  trained,
  enabled,
  business,
  products,
  coach,
  labels,
}: {
  siteUrl: string;
  trained: boolean;
  enabled: boolean;
  business: string;
  products: number;
  coach: CoachTurn[];
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
    chatTitle: string;
    chatHint: string;
    chatPlaceholder: string;
    chatSend: string;
    sending: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"train" | "enable" | "chat" | null>(null);
  const [error, setError] = useState("");
  const [turns, setTurns] = useState(coach);

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

      <div className="mt-5">
        <p className="text-sm font-medium">{labels.chatTitle}</p>
        <p className="mt-1 text-sm text-neutral-500">{labels.chatHint}</p>
        <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl bg-neutral-50 p-3">
          {turns.length === 0 ? (
            <p className="text-sm text-neutral-400">{labels.chatHint}</p>
          ) : (
            turns.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                  turn.role === "user" ? "ml-auto bg-white" : "bg-[#FF4713]/10 text-neutral-800"
                }`}
              >
                {turn.text}
              </p>
            ))
          )}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const box = form.elements.namedItem("brief") as HTMLTextAreaElement;
            const message = box.value.trim();
            if (!message) return;
            setBusy("chat");
            setError("");
            setTurns((current) => [...current, { role: "user", text: message }]);
            box.value = "";
            const response = await fetch("/api/leads/coach", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message }),
            });
            setBusy(null);
            if (!response.ok) {
              setError(labels.failed);
              return;
            }
            const body = (await response.json()) as { reply?: string; coach?: CoachTurn[] };
            if (body.coach?.length) setTurns(body.coach);
            else if (body.reply) setTurns((current) => [...current, { role: "agent", text: body.reply as string }]);
            router.refresh();
          }}
        >
          <textarea
            name="brief"
            rows={3}
            placeholder={labels.chatPlaceholder}
            className="min-h-[4.5rem] flex-1 resize-y rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900"
          />
          <button
            type="submit"
            disabled={busy !== null}
            className="self-end rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy === "chat" ? labels.sending : labels.chatSend}
          </button>
        </form>
      </div>

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
