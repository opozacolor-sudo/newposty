"use client";

import { Bell, Check, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link, usePathname as useAppPathname } from "@/i18n/navigation";
import type { PresaleView } from "@/lib/presale";

function PresaleViewportLock() {
  const pathname = useAppPathname();

  useEffect(() => {
    if (pathname !== "/presale") return;
    const root = document.documentElement;
    root.classList.add("home-no-scroll");
    return () => root.classList.remove("home-no-scroll");
  }, [pathname]);

  return null;
}

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

  const others = view.tranches.filter((row) => row.state !== "current");

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-3 py-2 sm:px-6 sm:py-3 lg:py-4">
      <PresaleViewportLock />
      <div className="grid min-h-0 flex-1 grid-cols-1 content-center gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] lg:items-center lg:gap-8">
        <div className="min-w-0 text-center lg:text-left">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#FF4713] sm:text-xs">
            {t("kicker")}
          </p>
          <h1 className="mt-1.5 text-[1.35rem] font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-[2.6rem] xl:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-1.5 max-w-xl text-[12px] leading-5 text-neutral-500 sm:mt-3 sm:text-sm sm:leading-6 lg:mx-0 lg:text-base">
            {t("subtitle")}
          </p>
          <ul className="mx-auto mt-3 max-w-xl space-y-1.5 lg:mx-0">
            {roadmap.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full sm:h-7 sm:w-7 ${
                    item.done ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <item.icon size={14} />
                </span>
                <span className="text-left text-[12px] font-medium text-neutral-800 sm:text-sm">{item.label}</span>
                {item.done ? (
                  <span className="ml-auto text-[10px] font-medium text-emerald-700 sm:text-xs">{t("done")}</span>
                ) : (
                  <span className="ml-auto text-[10px] text-neutral-400 sm:text-xs">{t("soon")}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-center lg:justify-start">
            <Link href="/demo" className={`${btnOutline} !px-3 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm`}>
              {t("whatItDoes")}
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          {view.soldOut || !current ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center">
              <p className="text-xl font-semibold text-neutral-950">{t("soldOut")}</p>
              <p className="mt-1 text-sm text-neutral-500">{t("soldOutBody")}</p>
            </div>
          ) : (
            <form onSubmit={onCheckout} className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-5">
              <p className="text-xs font-medium text-[#FF4713] sm:text-sm">{t("trancheLabel", { n: current.tranche })}</p>
              <p className="mt-0.5 font-serif text-4xl tracking-tight text-neutral-950 sm:text-5xl">
                {current.priceEur} EUR
              </p>
              <p className="text-[11px] text-neutral-500 sm:text-sm">{t("lifetime")}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-600 sm:text-sm">
                  <span>{t("remaining", { count: current.remaining, total: current.capacity })}</span>
                  <span>
                    {current.sold}/{current.capacity}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-[#FF4713]"
                    style={{ width: `${Math.min(100, (current.sold / current.capacity) * 100)}%` }}
                  />
                </div>
              </div>
              <label className="mt-3 block text-[12px] text-neutral-700 sm:text-sm">
                {t("email")}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF4713] sm:rounded-2xl sm:px-4 sm:py-2.5"
                />
              </label>
              {error ? <p className="mt-2 text-xs text-[#FF4713]">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className={`${btnSolid} mt-3 w-full !py-2.5 !text-sm disabled:opacity-60`}
              >
                {pending ? t("redirecting") : t("cta")}
              </button>
            </form>
          )}

          {others.length > 0 ? (
            <div className="mt-2 grid grid-cols-4 gap-1.5 sm:mt-3 sm:gap-2">
              {others.map((row) => (
                <article
                  key={row.tranche}
                  className={`rounded-xl border px-1.5 py-1.5 text-center sm:px-2 sm:py-2 ${
                    row.state === "sold_out"
                      ? "border-neutral-200 bg-neutral-50 text-neutral-400"
                      : "border-neutral-200 bg-white text-neutral-500"
                  }`}
                >
                  <p className="text-[9px] font-medium sm:text-[11px]">{t("trancheLabel", { n: row.tranche })}</p>
                  <p
                    className={`mt-0.5 text-[11px] font-semibold sm:text-sm ${
                      row.state === "sold_out" ? "" : "text-neutral-800"
                    }`}
                  >
                    {row.priceEur}€
                  </p>
                  <p className="text-[8px] uppercase tracking-wide sm:text-[10px]">
                    {row.state === "sold_out" ? t("soldOutBadge") : t("upcoming")}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
