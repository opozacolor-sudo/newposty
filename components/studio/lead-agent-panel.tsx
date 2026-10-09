"use client";

import { ArrowUp } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

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
    already: string;
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
  const [isTrained, setIsTrained] = useState(trained);

  useEffect(() => {
    setIsTrained(trained);
  }, [trained]);

  useEffect(() => {
    setTurns(coach);
  }, [coach]);

  return (
    <section className="posty-glass-3d relative mt-6 overflow-hidden rounded-[1.5rem] p-4 sm:p-5">
      <div className="relative z-[3]">
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
          setIsTrained(true);
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
            className="posty-clay-field mt-1 block w-full rounded-full px-3 py-1.5 text-sm text-[#1d1d1f]"
          />
        </label>
        <button
          type="submit"
          disabled={busy !== null}
          className="posty-site-btn px-3 py-1.5 text-sm disabled:opacity-60"
        >
          {busy === "train" ? labels.training : isTrained ? labels.already : labels.train}
        </button>
      </form>

      <div className="mt-5">
        <p className="text-sm font-medium">{labels.chatTitle}</p>
        <p className="mt-1 text-sm text-neutral-500">{labels.chatHint}</p>
        <div className="posty-chat-history mt-3 max-h-56 space-y-2 overflow-y-auto rounded-[1.25rem] p-3">
          {turns.length === 0 ? (
            <p className="text-sm text-[#5c5652]">{labels.chatHint}</p>
          ) : (
            turns.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                  turn.role === "user" ? "posty-clay-well ml-auto" : "posty-clay-tile text-[#1d1d1f]"
                }`}
              >
                {turn.text}
              </p>
            ))
          )}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
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
          <div className="posty-chat-composer flex min-w-0 flex-1 items-center rounded-full p-1 sm:p-1.5">
            <textarea
              name="brief"
              rows={1}
              placeholder={labels.chatPlaceholder}
              className="posty-chat-input min-w-0 flex-1 resize-none bg-transparent px-3 text-sm text-[#1d1d1f] outline-none placeholder:text-[#8a8682]"
            />
          </div>
          <button
            type="submit"
            disabled={busy !== null}
            className="posty-site-btn posty-chat-send disabled:opacity-60"
            aria-label={busy === "chat" ? labels.sending : labels.chatSend}
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>

      <p className="mt-3 text-sm text-neutral-600">{labels.addon}</p>
      {isTrained ? (
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
        disabled={!isTrained || busy !== null}
        className={`posty-site-btn mt-3 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
          enabled ? "opacity-80" : ""
        }`}
        onClick={async () => {
          if (!isTrained) return;
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
      {error ? <p className="mt-2 text-sm text-[#8b3a2a]">{error}</p> : null}
      </div>
    </section>
  );
}
