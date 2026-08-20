"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { platformLabel } from "@/lib/platforms";
import type { PlatformExecResult, ResultsPayload } from "@/lib/chat-post/types";

export function PostResultsMessage({ payload }: { payload: ResultsPayload }) {
  const t = useTranslations("Chat");
  const [results, setResults] = useState<PlatformExecResult[]>(payload.results);

  useEffect(() => {
    setResults(payload.results);
  }, [payload.results]);

  useEffect(() => {
    if (!payload.results.some((result) => result.status === "pending")) return;
    let cancelled = false;
    let interval = 0;
    async function tick() {
      const response = await fetch(`/api/posts/execute?action_id=${payload.action_id}&refresh=1`);
      if (!response.ok || cancelled) return;
      const body = (await response.json()) as { results?: PlatformExecResult[] };
      if (cancelled || !body.results) return;
      setResults(body.results);
      if (!body.results.some((result) => result.status === "pending")) {
        window.clearInterval(interval);
      }
    }
    interval = window.setInterval(() => {
      void tick();
    }, 2500);
    void tick();
    const timeout = window.setTimeout(() => window.clearInterval(interval), 120000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [payload.action_id, payload.results]);

  const anySuccess = results.some((result) => result.status === "success");
  const allFailed = results.length > 0 && results.every((result) => result.status === "error");

  return (
    <section className="mt-3 space-y-2">
      {allFailed ? (
        <p className="text-sm font-medium text-[#FF4713]">{t("allFailed")}</p>
      ) : payload.skippedConfirmation && anySuccess ? (
        <p className="text-xs text-[#6B7280]">{t("postedWithoutAsking")}</p>
      ) : null}
      <ul className="space-y-2">
        {results.map((result) => (
          <li
            key={`${result.platform}-${result.handle}`}
            className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm"
          >
            {result.status === "success" ? (
              <p>
                ✅ {platformLabel(result.platform)} {result.handle}{" "}
                {result.post_url ? (
                  <a href={result.post_url} className="text-[#FF4713] underline" target="_blank" rel="noreferrer">
                    {t("viewPost")}
                  </a>
                ) : null}
              </p>
            ) : result.status === "pending" ? (
              <p>
                ⏳ {platformLabel(result.platform)} {result.handle}: {t("stillPublishing")}
              </p>
            ) : (
              <p>
                ❌ {platformLabel(result.platform)} {result.handle}: {result.error_message_human}
              </p>
            )}
          </li>
        ))}
      </ul>
      {payload.excluded_by_validation && payload.excluded_by_validation.length > 0 ? (
        <div className="rounded-xl border border-[#F5D0A9] bg-[#FFF7ED] px-3 py-2 text-xs text-[#9A3412]">
          <p className="font-medium">{t("excludedTitle")}</p>
          <ul className="mt-1 space-y-1">
            {payload.excluded_by_validation.map((item) => (
              <li key={`${item.platform}-${item.reason}`}>
                {platformLabel(item.platform)}: {item.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
