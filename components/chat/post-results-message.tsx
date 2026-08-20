"use client";

import { useTranslations } from "next-intl";
import { platformLabel } from "@/lib/platforms";
import type { ResultsPayload } from "@/lib/chat-post/types";

export function PostResultsMessage({ payload }: { payload: ResultsPayload }) {
  const t = useTranslations("Chat");
  const anySuccess = payload.results.some((result) => result.status === "success");
  return (
    <section className="mt-3 space-y-2">
      {payload.allFailed ? (
        <p className="text-sm font-medium text-[#FF4713]">{t("allFailed")}</p>
      ) : payload.skippedConfirmation && anySuccess ? (
        <p className="text-xs text-[#6B7280]">{t("postedWithoutAsking")}</p>
      ) : null}
      <ul className="space-y-2">
        {payload.results.map((result) => (
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
                ⏳ {platformLabel(result.platform)} {result.handle}: {result.error_message_human ?? t("stillPublishing")}
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
