"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useId, useState } from "react";
import { btnSolid } from "@/components/marketing/styles";

export function WaitlistForm({
  compact = false,
  tone = "light",
  hideLead = false,
}: {
  compact?: boolean;
  tone?: "light" | "onDark" | "onSky";
  hideLead?: boolean;
}) {
  const t = useTranslations("Landing");
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

  const dark = tone === "onDark";
  const sky = tone === "onSky";

  if (status === "success") {
    return (
      <p
        className={
          dark || sky
            ? "text-sm font-medium text-emerald-200"
            : "mt-4 text-[13px] font-medium leading-5 text-emerald-800 sm:text-sm"
        }
      >
        {t("waitlistSuccess")}
      </p>
    );
  }

  return (
    <div id="waitlist" className={compact || dark || sky ? "mt-0" : "mt-8"}>
      {hideLead ? null : (
        <p
          className={
            dark
              ? "text-center text-[13px] leading-5 text-[#E4EEF0] sm:text-sm sm:leading-6"
              : sky
                ? "mx-auto text-center text-[clamp(0.65rem,1.55dvh,0.78rem)] leading-4 text-white/80 sm:text-[14px] sm:leading-5 lg:flex lg:max-w-xl lg:items-center lg:justify-center lg:text-[15px] [@media(min-height:1100px)]:lg:min-h-[3rem] [@media(min-height:1100px)]:lg:text-base"
                  : compact
                    ? "text-center text-[12px] leading-5 text-[#55514e] sm:text-sm sm:leading-6"
                    : "text-sm leading-6 text-[#55514e]"
          }
        >
          {t("waitlistLead")}
        </p>
      )}
      <form
        onSubmit={onSubmit}
        className={
          sky
            ? "mt-1 flex w-full flex-row items-stretch justify-center gap-1.5 sm:mt-2 sm:gap-2"
            : compact
              ? "mt-2 flex w-full flex-row items-stretch justify-center gap-1.5"
              : "mt-2 flex w-full flex-col gap-2 sm:mt-3 sm:flex-row sm:items-stretch sm:justify-center"
        }
      >
        <label className="sr-only" htmlFor={emailId}>
          {t("emailPlaceholder")}
        </label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          className={
            dark
              ? "h-10 min-w-0 flex-1 rounded-full border border-[#E4EEF0]/25 bg-[#3F000F] px-4 text-sm text-[#E4EEF0] outline-none placeholder:text-[#E4EEF0]/50 focus:border-[#FF5B04]"
              : sky
                ? "h-8 min-w-0 flex-1 rounded-full border-0 bg-white px-3 text-[12px] text-[#1d1d1f] outline-none placeholder:text-[#6e6e73] focus:ring-2 focus:ring-white/50 sm:h-10 sm:px-4 sm:text-sm"
                : compact
                  ? "h-9 min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-3 text-[12px] outline-none focus:border-[#FF4713] sm:h-auto sm:px-4 sm:py-3 sm:text-sm"
                  : "posty-clay-field min-w-0 flex-1 rounded-full px-4 py-3 text-sm outline-none"
          }
        />
        <button
          type="submit"
          disabled={pending}
          className={
            dark
              ? "h-10 shrink-0 rounded-full bg-[#FF5B04] px-5 text-sm font-medium text-[#E4EEF0] disabled:opacity-60"
              : sky
                ? `posty-glow-btn h-8 shrink-0 rounded-full px-3 text-[12px] font-normal text-white transition hover:brightness-110 disabled:opacity-60 sm:h-10 sm:px-5 sm:text-sm`
                : compact
                  ? `${btnSolid} posty-site-btn h-9 shrink-0 !px-3 !py-1.5 !text-[11px] sm:h-auto sm:!px-5 sm:!py-3 sm:!text-sm disabled:opacity-60`
                  : `${btnSolid} posty-site-btn shrink-0 px-5 py-3 disabled:opacity-60`
          }
        >
          {pending ? t("waitlistSending") : t("waitlistCta")}
        </button>
      </form>
      {status === "invalid" ? (
        <p className="mt-2 text-[12px] text-[#FF4713]">{t("waitlistInvalid")}</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-[12px] text-[#FF4713]">{t("waitlistError")}</p>
      ) : null}
    </div>
  );
}
