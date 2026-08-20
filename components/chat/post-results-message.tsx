"use client";

import { useTranslations } from "next-intl";
import { platformLabel } from "@/lib/platforms";
import type { ResultsPayload } from "@/lib/chat-post/types";

export function PostResultsMessage({ payload }: { payload: ResultsPayload }) {
  const t = useTranslations("Chat");
  return (
    <section className="mt-3 space-y-2">
      {payload.allFailed ? (
        <p className="text-sm font-medium text-[#FF4713]">{t("allFailed")}</p>
      ) : payload.skippedConfirmation ? (
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
            ) : (
              <p>
                ❌ {platformLabel(result.platform)} {result.handle}: {result.error_message_human}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
