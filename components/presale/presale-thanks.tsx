"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function PresaleThanks() {
  const t = useTranslations("Presale");
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const [message, setMessage] = useState(t("thanksWait"));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError(t("thanksMissing"));
      return;
    }
    let cancelled = false;
    let attempts = 0;

    async function tick() {
      attempts += 1;
      try {
        const response = await fetch(`/api/presale/session?session_id=${encodeURIComponent(sessionId)}`);
        const payload = (await response.json()) as { status?: string; token?: string; email?: string };
        if (cancelled) return;
        if (payload.status === "registered") {
          const params = new URLSearchParams({ paid: "1" });
          if (payload.email) params.set("email", payload.email);
          router.replace(`/login?${params.toString()}`);
          return;
        }
        if (payload.status === "paid") {
          const minted = await fetch(
            `/api/presale/session?session_id=${encodeURIComponent(sessionId)}&mint=1`,
          );
          const mintedPayload = (await minted.json()) as { token?: string };
          if (mintedPayload.token) {
            router.replace(`/presale/register/${mintedPayload.token}`);
            return;
          }
        }
        if (attempts >= 15) {
          setMessage(t("thanksEmail"));
          return;
        }
        window.setTimeout(() => {
          void tick();
        }, 2000);
      } catch {
        if (!cancelled) setError(t("thanksError"));
      }
    }

    void tick();
    return () => {
      cancelled = true;
    };
  }, [router, sessionId, t]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-6 py-16 text-center">
      <h1 className="font-serif text-4xl">{t("thanksTitle")}</h1>
      <p className="mt-3 text-sm text-muted">{error ?? message}</p>
    </main>
  );
}
