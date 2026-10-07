"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { btnClay } from "./styles";

const fieldClass =
  "posty-clay-field mt-2 w-full rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#6e6e73]";

export function ContactForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const t = useTranslations("Contact");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "invalid">(
    "idle",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email.includes("@") || message.length < 2) {
      setStatus("invalid");
      return;
    }

    setPending(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-xl space-y-5">
      <label className="block text-sm font-medium text-[#1d1d1f]">
        {t("name")}
        <input name="name" required maxLength={200} className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-[#1d1d1f]">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          maxLength={320}
          defaultValue={defaultEmail}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-[#1d1d1f]">
        {t("message")}
        <textarea
          name="message"
          required
          rows={6}
          maxLength={8000}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <button type="submit" className={btnClay} disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </button>
      {status === "success" ? (
        <p className="text-sm text-[#55514e]">{t("success")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-[#55514e]">{t("error")}</p>
      ) : null}
      {status === "invalid" ? (
        <p className="text-sm text-[#55514e]">{t("invalid")}</p>
      ) : null}
    </form>
  );
}
