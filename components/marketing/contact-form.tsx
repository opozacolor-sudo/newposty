"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { btnSolid } from "./styles";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#FF4713]";

export function ContactForm() {
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
      <label className="block text-sm font-medium text-neutral-800">
        {t("name")}
        <input name="name" required maxLength={200} className={fieldClass} />
      </label>
      <label className="block text-sm font-medium text-neutral-800">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          maxLength={320}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-neutral-800">
        {t("message")}
        <textarea
          name="message"
          required
          rows={6}
          maxLength={8000}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <button type="submit" className={btnSolid} disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </button>
      {status === "success" ? (
        <p className="text-sm text-neutral-600">{t("success")}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-neutral-600">{t("error")}</p>
      ) : null}
      {status === "invalid" ? (
        <p className="text-sm text-neutral-600">{t("invalid")}</p>
      ) : null}
    </form>
  );
}
