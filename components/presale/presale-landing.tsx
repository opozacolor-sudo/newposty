"use client";

import { Bell, Check, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useMemo, useState } from "react";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";
import type { PresaleView } from "@/lib/presale";

export function PresaleLanding({ initial }: { initial: PresaleView }) {
  const t = useTranslations("Presale");
  const locale = useLocale();
  const [view, setView] = useState(initial);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const current = view.current;

  const roadmap = useMemo(
    () => [
      { icon: Check, done: true, label: t("roadmapLive") },
      { icon: Clock, done: false, label: t("roadmapApps") },
      { icon: Bell, done: false, label: t("roadmapEmail") },
    ],
    [t],
  );

  async function onCheckout(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const status = await fetch("/api/presale/status").then((response) => response.json());
      if (status.soldOut) {
        setView(status);
        return;
      }
      const response = await fetch("/api/presale/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        if (payload.error === "PRESALE_SOLD_OUT") {
          const latest = await fetch("/api/presale/status").then((item) => item.json());
          setView(latest);
          return;
        }
        setError(payload.error === "email is required" ? t("emailInvalid") : t("checkoutError"));
        return;
      }
      window.location.href = payload.url;
    } catch {
      setError(t("checkoutError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4713]">{t("kicker")}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
          {t("subtitle")}
        </p>
      </header>

      <ul className="mx-auto mt-10 max-w-lg space-y-3">
        {roadmap.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                item.done ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              <item.icon size={18} />
            </span>
            <span className="text-sm font-medium text-neutral-800">{item.label}</span>
            {item.done ? (
              <span className="ml-auto text-xs font-medium text-emerald-700">{t("done")}</span>
            ) : (
              <span className="ml-auto text-xs text-neutral-400">{t("soon")}</span>
            )}
          </li>
        ))}
      </ul>

      {view.soldOut || !current ? (
        <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-2xl font-semibold text-neutral-950">{t("soldOut")}</p>
          <p className="mt-2 text-sm text-neutral-500">{t("soldOutBody")}</p>
        </div>
      ) : (
        <form
          onSubmit={onCheckout}
          className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <p className="text-sm font-medium text-[#FF4713]">{t("trancheLabel", { n: current.tranche })}</p>
          <p className="mt-2 font-serif text-5xl tracking-tight text-neutral-950 sm:text-6xl">
            {current.priceEur} EUR
          </p>
          <p className="mt-1 text-sm text-neutral-500">{t("lifetime")}</p>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-neutral-600">
              <span>{t("remaining", { count: current.remaining, total: current.capacity })}</span>
              <span>
                {current.sold}/{current.capacity}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-[#FF4713]"
                style={{ width: `${Math.min(100, (current.sold / current.capacity) * 100)}%` }}
              />
            </div>
          </div>
          <label className="mt-6 block text-sm text-neutral-700">
            {t("email")}
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-[#FF4713]"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-[#FF4713]">{error}</p> : null}
          <button type="submit" disabled={pending} className={`${btnSolid} mt-5 w-full !py-3 disabled:opacity-60`}>
            {pending ? t("redirecting") : t("cta")}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {view.tranches
          .filter((row) => row.state !== "current")
          .map((row) => (
            <article
              key={row.tranche}
              className={`rounded-2xl border px-4 py-4 ${
                row.state === "sold_out"
                  ? "border-neutral-200 bg-neutral-50 text-neutral-400"
                  : "border-neutral-200 bg-white text-neutral-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t("trancheLabel", { n: row.tranche })}</p>
                {row.state === "sold_out" ? (
                  <span className="text-xs font-semibold tracking-wide">{t("soldOutBadge")}</span>
                ) : (
                  <span className="text-xs uppercase tracking-wide">{t("upcoming")}</span>
                )}
              </div>
              <p className={`mt-2 text-2xl font-semibold ${row.state === "sold_out" ? "" : "text-neutral-800"}`}>
                {row.priceEur} EUR
              </p>
            </article>
          ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/demo" className={btnOutline}>
          {t("whatItDoes")}
        </Link>
      </div>
    </div>
  );
}
