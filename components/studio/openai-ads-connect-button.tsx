"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function OpenAIAdsConnectButton({
  label,
}: {
  label: string;
}) {
  const t = useTranslations("Accounts");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/connect/openai-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? t("openaiFailed"));
        return;
      }
      setOpen(false);
      setApiKey("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("openaiFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full bg-[#FF4713] px-3 py-2 text-xs text-white shadow-sm transition duration-150 hover:scale-105 hover:bg-[#e03d0f] hover:shadow-md"
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t("blueskyCancel")}
            onClick={() => !pending && setOpen(false)}
          />
          <form
            onSubmit={(event) => void onSubmit(event)}
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold tracking-tight text-[#1A1A1A]">
              {t("openaiTitle")}
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">{t("openaiIntro")}</p>

            <label className="mt-4 block text-sm text-[#1A1A1A]">
              {t("openaiApiKey")}
              <input
                required
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]"
              />
            </label>
            <a
              href="https://ads.openai.com"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-[#FF4713] underline"
            >
              {t("openaiHelp")}
            </a>

            {error ? <p className="mt-3 text-sm text-[#FF4713]">{error}</p> : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#E5E5E5] px-4 py-2 text-xs text-[#1A1A1A]"
              >
                {t("blueskyCancel")}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-[#FF4713] px-4 py-2 text-xs text-white disabled:opacity-60"
              >
                {pending ? t("openaiConnecting") : t("connect")}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
