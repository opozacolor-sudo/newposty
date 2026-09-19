"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useId, useState } from "react";
import { btnSolid } from "@/components/marketing/styles";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
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

  if (status === "success") {
    return (
      <p
        className={
          compact
            ? "mt-4 text-[13px] font-medium leading-5 text-emerald-700 sm:text-sm"
            : "mt-6 text-sm font-medium text-emerald-700"
        }
      >
        {t("waitlistSuccess")}
      </p>
    );
  }

  return (
    <div id="waitlist" className={compact ? "mt-4 sm:mt-8" : "mt-8"}>
      <p
        className={
          compact
            ? "text-[12px] leading-5 text-neutral-500 sm:text-sm sm:leading-6"
            : "text-sm leading-6 text-neutral-500"
        }
      >
        {t("waitlistLead")}
      </p>
      <form
        onSubmit={onSubmit}
        className={
          compact
            ? "mt-2.5 flex w-full flex-col gap-1.5 sm:mt-3 sm:flex-row sm:items-stretch"
            : "mt-4 flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
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
            compact
              ? "h-9 min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-3 text-[12px] outline-none focus:border-[#FF4713] sm:h-auto sm:px-4 sm:py-3 sm:text-sm"
              : "min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#FF4713]"
          }
        />
        <button
          type="submit"
          disabled={pending}
          className={
            compact
              ? `${btnSolid} h-9 shrink-0 !px-3 !py-1.5 !text-[11px] sm:h-auto sm:!px-5 sm:!py-3 sm:!text-sm disabled:opacity-60`
              : `${btnSolid} shrink-0 px-5 py-3 disabled:opacity-60`
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
