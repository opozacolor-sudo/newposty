"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { contentTypeLabel } from "@/lib/chat-post/copy";
import { needsLiveUrlRefresh } from "@/lib/chat-post/publish-status";
import { platformLabel, platformProfileUrl } from "@/lib/platforms";
import type { PlatformExecResult, ResultsPayload } from "@/lib/chat-post/types";

function resultTitle(result: PlatformExecResult) {
  const format =
    contentTypeLabel(result.contentType) ||
    (result.platform === "instagram" && result.mode === "schedule" ? "Reel" : "");
  const when = result.mode === "schedule" && result.scheduled_label ? result.scheduled_label : null;
  return [platformLabel(result.platform), format, result.handle, when ? `· ${when}` : ""]
    .filter(Boolean)
    .join(" ");
}

function openUrl(result: PlatformExecResult) {
  return result.post_url || platformProfileUrl(result.platform, result.handle);
}

function OpenLink({ href }: { href: string }) {
  const t = useTranslations("Chat");
  return (
    <a
      href={href}
      className="inline-flex shrink-0 items-center rounded-full border border-[#FF4713] px-2.5 py-0.5 text-[11px] font-medium text-[#FF4713] hover:bg-[#FF4713] hover:text-white"
      target="_blank"
      rel="noreferrer"
    >
      {t("viewPost")}
    </a>
  );
}

function ResultRow({ result }: { result: PlatformExecResult }) {
  const t = useTranslations("Chat");
  const href = openUrl(result);
  const title = resultTitle(result);
  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm">
      <div className="min-w-0">
        {result.status === "success" ? (
          <p>
            ✅ {title}
          </p>
        ) : result.status === "pending" ? (
          <p>
            ⏳ {title}: {result.platform === "tiktok" ? t("stillPublishingTikTok") : t("stillPublishing")}
          </p>
        ) : (
          <p>
            ❌ {title}: {result.error_message_human}
          </p>
        )}
      </div>
      {href && result.status !== "error" ? <OpenLink href={href} /> : null}
    </li>
  );
}

export function PostResultsMessage({ payload }: { payload: ResultsPayload }) {
  const t = useTranslations("Chat");
  const [results, setResults] = useState<PlatformExecResult[]>(payload.results);

  useEffect(() => {
    setResults(payload.results);
  }, [payload.results]);

  useEffect(() => {
    if (!payload.results.some((result) => needsLiveUrlRefresh(result))) return;
    let cancelled = false;
    let interval = 0;
    async function tick() {
      const response = await fetch(`/api/posts/execute?action_id=${payload.action_id}&refresh=1`);
      if (!response.ok || cancelled) return;
      const body = (await response.json()) as { results?: PlatformExecResult[] };
      if (cancelled || !body.results) return;
      setResults(body.results);
      if (!body.results.some((result) => needsLiveUrlRefresh(result))) {
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
        {results.map((result, index) => (
          <ResultRow
            key={`${result.platform}-${result.contentType ?? ""}-${result.mode ?? ""}-${result.handle}-${index}`}
            result={result}
          />
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
