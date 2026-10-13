"use client";

import { MessageCircle, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

type Turn = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "posty-help-thread";

function isStudioPath(path: string) {
  return /\/(chat|connections|leads|help|accounts|plan|profile|dashboard|ads|analytics|posts|inbox)(\/|$)/.test(
    path,
  );
}

export function HelpWidget() {
  const t = useTranslations("Help");
  const locale = useLocale();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [handoffStatus, setHandoffStatus] = useState<"idle" | "success" | "error" | "invalid">("idle");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { turns?: Turn[] };
      if (Array.isArray(parsed.turns)) setTurns(parsed.turns.slice(-20));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ turns }));
    } catch {
      /* ignore */
    }
  }, [turns]);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/help")
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { email?: string | null } | null) => {
        if (body?.email) setEmail(body.email);
      })
      .catch(() => undefined);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [turns, pending, open, handoff]);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const next = [...turns, { role: "user" as const, content: text }];
    setTurns(next);
    setInput("");
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-posty-locale": locale },
        body: JSON.stringify({ messages: next, path }),
      });
      if (response.status === 429) {
        setError(t("tooMany"));
        return;
      }
      const body = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !body.reply) {
        setError(t("failed"));
        return;
      }
      setTurns([...next, { role: "assistant", content: body.reply }]);
    } catch {
      setError(t("failed"));
    } finally {
      setPending(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  async function sendHandoff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const mail = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !mail.includes("@") || message.length < 2) {
      setHandoffStatus("invalid");
      return;
    }
    setHandoffStatus("idle");
    setPending(true);
    try {
      const lines = [
        "[Help widget]",
        phone ? `Phone: ${phone}` : null,
        path ? `Page: ${path}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n");
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: mail, message: lines }),
      });
      if (!response.ok) {
        setHandoffStatus("error");
        return;
      }
      form.reset();
      setHandoffStatus("success");
    } catch {
      setHandoffStatus("error");
    } finally {
      setPending(false);
    }
  }

  const studio = isStudioPath(path);
  const anchor = studio ? "bottom-36 sm:bottom-40" : "bottom-24 sm:bottom-28";

  return (
    <div className={`fixed z-[80] right-3 flex flex-col items-end sm:right-4 ${anchor}`}>
      {open ? (
        <section
          className="mb-3 flex h-[min(26rem,calc(100dvh-9rem))] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)]"
          role="dialog"
          aria-label={t("title")}
        >
          <header className="flex items-center justify-between gap-2 border-b border-[#EFEFEF] px-3 py-2.5">
            <p className="text-sm font-semibold text-[#1A1A1A]">{t("title")}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-full px-2 py-1 text-[11px] font-medium text-[#FF4713] hover:bg-[#FFF4F0]"
                onClick={() => {
                  setHandoff((value) => !value);
                  setHandoffStatus("idle");
                }}
              >
                {handoff ? t("backToChat") : t("leaveMessage")}
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5F5F5]"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
              >
                <X size={16} />
              </button>
            </div>
          </header>
          {handoff ? (
            <form onSubmit={(event) => void sendHandoff(event)} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
              <label className="block text-xs font-medium text-[#1A1A1A]">
                {t("name")}
                <input name="name" required maxLength={200} className="mt-1 w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm outline-none" />
              </label>
              <label className="block text-xs font-medium text-[#1A1A1A]">
                {t("email")}
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  defaultValue={email}
                  className="mt-1 w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-[#1A1A1A]">
                {t("phone")}
                <input name="phone" maxLength={40} className="mt-1 w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm outline-none" />
              </label>
              <label className="block text-xs font-medium text-[#1A1A1A]">
                {t("message")}
                <textarea
                  name="message"
                  required
                  rows={4}
                  maxLength={4000}
                  className="mt-1 w-full resize-none rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={pending}
                className="mt-auto rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                {pending ? t("sending") : t("submit")}
              </button>
              {handoffStatus === "success" ? <p className="text-xs text-[#166534]">{t("success")}</p> : null}
              {handoffStatus === "error" ? <p className="text-xs text-[#9A3412]">{t("error")}</p> : null}
              {handoffStatus === "invalid" ? <p className="text-xs text-[#9A3412]">{t("invalid")}</p> : null}
            </form>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
                {turns.length === 0 ? <p className="text-sm leading-5 text-[#5c5652]">{t("empty")}</p> : null}
                {turns.map((turn, index) => (
                  <p
                    key={`${turn.role}-${index}`}
                    className={
                      turn.role === "user"
                        ? "ml-6 rounded-2xl bg-[#1A1A1A] px-3 py-2 text-sm text-white"
                        : "mr-6 whitespace-pre-wrap rounded-2xl bg-[#F5F5F5] px-3 py-2 text-sm text-[#1A1A1A]"
                    }
                  >
                    {turn.content}
                  </p>
                ))}
                {pending ? <p className="text-sm text-[#5c5652]">{t("thinking")}</p> : null}
                {error ? <p className="text-sm text-[#9A3412]">{error}</p> : null}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={(event) => void send(event)} className="border-t border-[#EFEFEF] p-2.5">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={onKeyDown}
                    rows={2}
                    placeholder={t("placeholder")}
                    className="min-w-0 flex-1 resize-none rounded-xl bg-[#F7F7F7] px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    disabled={pending || !input.trim()}
                    className="rounded-full bg-[#1A1A1A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {t("send")}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF4713] text-white shadow-[0_8px_24px_rgba(255,71,19,0.45)] hover:bg-[#e03d0f]"
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
