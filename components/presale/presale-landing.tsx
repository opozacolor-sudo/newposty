"use client";

import { Bell, Check, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link, usePathname as useAppPathname } from "@/i18n/navigation";
import type { PresaleView } from "@/lib/presale";

function WaitlistCapture() {
  const t = useTranslations("Presale");
  const locale = useLocale();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "invalid">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim().includes("@")) {
      setStatus("invalid");
      return;
    }
    setPending(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/presale/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/90 px-3 py-3 sm:px-4">
      <p className="text-[13px] font-medium text-neutral-800">{t("waitlistTitle")}</p>
      <p className="mt-0.5 text-[12px] leading-5 text-neutral-500">{t("waitlistBody")}</p>
      {status === "success" ? (
        <p className="mt-2 text-[12px] font-medium text-emerald-700">{t("waitlistSuccess")}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor={emailId}>
            {t("email")}
          </label>
          <input
            id={emailId}
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("email")}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF4713] sm:flex-1"
          />
          <button
            type="submit"
            disabled={pending}
            className={`${btnOutline} w-full shrink-0 !px-3 !py-2 !text-xs sm:w-auto disabled:opacity-60`}
          >
            {pending ? t("waitlistSending") : t("waitlistCta")}
          </button>
        </form>
      )}
      {status === "invalid" ? <p className="mt-1 text-[12px] text-[#FF4713]">{t("emailInvalid")}</p> : null}
      {status === "error" ? <p className="mt-1 text-[12px] text-[#FF4713]">{t("waitlistError")}</p> : null}
    </div>
  );
}

function PresaleViewportLock() {
  const pathname = useAppPathname();

  useEffect(() => {
    if (pathname !== "/presale") return;
    const root = document.documentElement;
    const media = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      root.classList.toggle("home-no-scroll", media.matches);
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      root.classList.remove("home-no-scroll");
    };
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

  const roadmapList = (
    <ul className="mx-auto max-w-xl space-y-2 lg:mx-0">
      {roadmap.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2"
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              item.done ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <item.icon size={14} />
          </span>
          <span className="text-left text-[13px] font-medium text-neutral-800 sm:text-sm">{item.label}</span>
          {item.done ? (
            <span className="ml-auto text-[11px] font-medium text-emerald-700 sm:text-xs">{t("done")}</span>
          ) : (
            <span className="ml-auto text-[11px] text-neutral-400 sm:text-xs">{t("soon")}</span>
          )}
        </li>
      ))}
    </ul>
  );

  const otherTranches =
    others.length > 0 ? (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {others.map((row) => (
          <article
            key={row.tranche}
            className={`rounded-xl border px-2 py-2 text-center ${
              row.state === "sold_out"
                ? "border-neutral-200 bg-neutral-50 text-neutral-400"
                : "border-neutral-200 bg-white text-neutral-500"
            }`}
          >
            <p className="text-[11px] font-medium">{t("trancheLabel", { n: row.tranche })}</p>
            <p
              className={`mt-0.5 text-sm font-semibold ${
                row.state === "sold_out" ? "" : "text-neutral-800"
              }`}
            >
              {row.priceEur}€
            </p>
            <p className="text-[10px] uppercase tracking-wide">
              {row.state === "sold_out" ? t("soldOutBadge") : t("upcoming")}
            </p>
          </article>
        ))}
      </div>
    ) : null;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-3 sm:px-6 sm:py-5 lg:min-h-0 lg:overflow-hidden lg:py-4">
      <PresaleViewportLock />
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] lg:content-center lg:items-center lg:gap-8">
        <div className="min-w-0 text-center lg:text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#FF4713] sm:text-xs">
            {t("kicker")}
          </p>
          <h1 className="mt-1.5 text-[1.7rem] font-semibold leading-[1.15] tracking-tight text-neutral-950 sm:text-4xl lg:hidden">
            {t("hook")}
          </h1>
          <h1 className="mt-2 hidden font-semibold leading-tight tracking-tight text-neutral-950 lg:block lg:text-[2.6rem] xl:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-[15px] font-medium leading-6 text-neutral-800 lg:hidden">
            {t("hookBody")}
          </p>
          <p className="mx-auto mt-3 hidden max-w-xl text-sm leading-6 text-neutral-500 lg:mx-0 lg:mt-3 lg:block lg:text-base">
            {t("subtitle")}
          </p>
          <div className="mt-4 hidden lg:block">{roadmapList}</div>
          <div className="mt-4 hidden justify-start lg:flex">
            <Link href="/demo" className={`${btnOutline} !px-4 !py-2 !text-sm`}>
              {t("whatItDoes")}
            </Link>
          </div>
          <div className="mt-4 hidden lg:block">
            <WaitlistCapture />
          </div>
        </div>

        <div className="min-w-0">
          {view.soldOut || !current ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center">
              <p className="text-xl font-semibold text-neutral-950">{t("soldOut")}</p>
              <p className="mt-1 text-sm text-neutral-500">{t("soldOutBody")}</p>
            </div>
          ) : (
            <form onSubmit={onCheckout} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-medium text-[#FF4713] sm:text-sm">{t("trancheLabel", { n: current.tranche })}</p>
              <p className="mt-0.5 font-serif text-[2.35rem] leading-none tracking-tight text-neutral-950 sm:text-5xl">
                {current.priceEur} EUR
              </p>
              <p className="mt-1 text-sm text-neutral-500">{t("lifetime")}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-emerald-700">
                <Check size={14} className="shrink-0" />
                {t("immediate")}
              </p>
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
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FF4713] sm:rounded-2xl sm:px-4"
                />
              </label>
              {error ? <p className="mt-2 text-xs text-[#FF4713]">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className={`${btnSolid} mt-3 w-full !py-3 !text-sm disabled:opacity-60`}
              >
                {pending ? t("redirecting") : t("cta")}
              </button>
            </form>
          )}

          <div className="mt-3 lg:hidden">
            <WaitlistCapture />
          </div>
          <div className="mt-3 hidden lg:block">{otherTranches}</div>
        </div>

        <div className="space-y-4 lg:hidden">
          {otherTranches}
          {roadmapList}
          <div className="flex justify-center">
            <Link href="/demo" className={`${btnOutline} !px-4 !py-2 !text-sm`}>
              {t("whatItDoes")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
