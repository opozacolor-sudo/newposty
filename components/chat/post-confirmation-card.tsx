"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { contentTypeLabel } from "@/lib/chat-post/copy";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { getPlatform, platformLabel } from "@/lib/platforms";
import type { ConfirmationPayload, ResolvedAction } from "@/lib/chat-post/types";

export function PostConfirmationCard({
  payload,
  onDone,
}: {
  payload: ConfirmationPayload;
  onDone: (next: { kind: "results" | "cancelled"; reply?: string; payload?: unknown }) => void;
}) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const resolved = payload.resolved;
  const [captions, setCaptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const action of resolved.actions) {
      for (const platform of action.platforms) {
        initial[platform.requestId] = platform.caption;
      }
    }
    return initial;
  });
  const [busy, setBusy] = useState(false);
  const [skipNext, setSkipNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/posts/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: payload.action_id,
          captions,
          skip_confirmation: skipNext,
          locale,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? t("publishFailed"));
        setBusy(false);
        return;
      }
      onDone({
        kind: "results",
        payload: {
          type: "results",
          action_id: payload.action_id,
          results: body.results,
          allFailed: body.allFailed,
          excluded_by_validation: payload.resolved.excluded_by_validation,
        },
      });
    } catch {
      setError(t("publishFailed"));
      setBusy(false);
    }
  }

  async function cancel() {
    if (busy) return;
    setBusy(true);
    await fetch("/api/posts/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_id: payload.action_id, cancel: true, locale }),
    });
    onDone({ kind: "cancelled" });
  }

  return (
    <section className="mt-3 space-y-3 rounded-2xl border border-[#E5E5E5] bg-white p-4">
      {resolved.kind === "manage" && resolved.manage ? (
        <ManageBlock resolved={resolved} />
      ) : resolved.series ? (
        <SeriesBlock resolved={resolved} />
      ) : (
        resolved.actions.map((action, index) => (
          <div key={`${action.mode}-${index}`} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
              {action.mode === "schedule" ? action.scheduled_label : t("postNow")}
            </p>
            {action.schedule_source === "best_time_research" ? (
              <p className="text-[11px] text-[#6B7280]">{t("bestTimeHint")}</p>
            ) : null}
            {action.media[0] ? (
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F5F5F5]">
                {action.media[0].type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={action.media[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <p className="flex h-full items-center justify-center px-2 text-center text-[10px] text-[#6B7280]">
                    video
                  </p>
                )}
              </div>
            ) : null}
            <ul className="space-y-2">
              {action.platforms.map((platform) => {
                const visual = getPlatform(platform.platform);
                return (
                  <li key={platform.requestId} className="rounded-xl border border-[#F3F4F6] p-3">
                    <div className="flex items-center gap-2">
                      {visual ? <PlatformIcon platform={visual} connected size="sm" /> : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1A1A1A]">
                          {platformLabel(platform.platform)}
                          {contentTypeLabel(platform.contentType)
                            ? ` · ${contentTypeLabel(platform.contentType)}`
                            : ""}
                        </p>
                        <p className="truncate text-xs text-[#6B7280]">{platform.handle}</p>
                      </div>
                    </div>
                    <textarea
                      value={captions[platform.requestId] ?? platform.caption}
                      onChange={(event) =>
                        setCaptions((current) => ({
                          ...current,
                          [platform.requestId]: event.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-2 w-full resize-none rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#FF4713]"
                    />
                    {platform.captionTruncated ? (
                      <p className="mt-1 text-[11px] text-[#B45309]">{t("captionTruncated")}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}

      {resolved.excluded_by_validation.length > 0 && !resolved.series ? (
        <div className="rounded-xl border border-[#F5D0A9] bg-[#FFF7ED] px-3 py-2 text-xs text-[#9A3412]">
          <p className="font-medium">{t("excludedTitle")}</p>
          <ul className="mt-1 space-y-1">
            {resolved.excluded_by_validation.map((item) => (
              <li key={`${item.platform}-${item.reason}`}>
                {platformLabel(item.platform)}: {item.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {resolved.warnings.length > 0 ? (
        <ul className="space-y-1 text-xs text-[#B45309]">
          {resolved.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <label className="flex items-center gap-2 text-xs text-[#6B7280]">
        <input
          type="checkbox"
          checked={skipNext}
          onChange={(event) => setSkipNext(event.target.checked)}
        />
        {t("dontAskAgain")}
      </label>

      {error ? <p className="text-sm text-[#FF4713]">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void confirm()}
          className="rounded-full bg-[#FF4713] px-4 py-2 text-xs text-white disabled:opacity-40"
        >
          {busy && resolved.series ? t("schedulingSeries") : t("confirmPost")}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void cancel()}
          className="rounded-full border border-[#E5E5E5] px-4 py-2 text-xs text-[#1A1A1A] disabled:opacity-40"
        >
          {t("cancelPost")}
        </button>
      </div>
    </section>
  );
}

function SeriesBlock({ resolved }: { resolved: ResolvedAction }) {
  const t = useTranslations("Chat");
  const networks = new Set<string>();
  const rows = new Map<
    number,
    {
      dayIndex: number;
      label: string;
      media: { url: string; type: string; name?: string | null } | null;
      platforms: { platform: string; handle: string; time: string | null }[];
      skipped: { platform: string; reason: string }[];
    }
  >();
  for (const action of resolved.actions) {
    const dayIndex = action.day_index ?? rows.size;
    const current = rows.get(dayIndex) ?? {
      dayIndex,
      label: action.scheduled_label ?? "",
      media: action.media[0] ?? null,
      platforms: [],
      skipped: action.skipped_platforms ?? [],
    };
    for (const platform of action.platforms) {
      networks.add(platform.platform);
      current.platforms.push({
        platform: platform.platform,
        handle: platform.handle,
        time: action.scheduled_label,
      });
    }
    if ((action.skipped_platforms ?? []).length > 0) current.skipped = action.skipped_platforms ?? [];
    if (!current.media && action.media[0]) current.media = action.media[0];
    rows.set(dayIndex, current);
  }
  const days = [...rows.values()].sort((left, right) => left.dayIndex - right.dayIndex);
  const usesResearch = resolved.actions.some((action) => action.schedule_source === "best_time_research");

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-[#1A1A1A]">
          {t("seriesTitle", { days: resolved.series?.total_days ?? days.length, networks: networks.size })}
        </p>
        <p className="text-xs text-[#6B7280]">{t("seriesHint")}</p>
        {usesResearch ? <p className="mt-1 text-[11px] text-[#6B7280]">{t("bestTimeHint")}</p> : null}
      </div>
      <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {days.map((day) => (
          <li key={day.dayIndex} className="flex gap-3 rounded-xl border border-[#F3F4F6] p-2">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#F5F5F5]">
              {day.media?.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={day.media.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <p className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#6B7280]">
                  {day.media?.name ?? "video"}
                </p>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#1A1A1A]">
                {t("seriesDay", { day: day.dayIndex + 1 })} · {day.label}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {day.platforms.map((platform, index) => {
                  const visual = getPlatform(platform.platform);
                  return (
                    <span
                      key={`${platform.platform}-${platform.handle}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[11px] text-[#1A1A1A]"
                    >
                      {visual ? <PlatformIcon platform={visual} connected size="sm" /> : null}
                      {platformLabel(platform.platform)}
                    </span>
                  );
                })}
              </div>
              {day.skipped.length > 0 ? (
                <p className="mt-1 text-[11px] text-[#9A3412]">
                  {day.skipped.map((item) => platformLabel(item.platform)).join(", ")} — {t("seriesSkipped")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManageBlock({ resolved }: { resolved: ResolvedAction }) {
  const t = useTranslations("Chat");
  const manage = resolved.manage;
  if (!manage) return null;
  const visual = getPlatform(manage.platform);
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
        {manage.action === "cancel"
          ? t("manageCancel")
          : manage.action === "reschedule"
            ? t("manageReschedule")
            : t("manageEdit")}
      </p>
      <div className="flex items-center gap-2">
        {visual ? <PlatformIcon platform={visual} connected size="sm" /> : null}
        <div>
          <p className="text-sm font-medium">{platformLabel(manage.platform)}</p>
          <p className="text-xs text-[#6B7280]">{manage.scheduled_label}</p>
        </div>
      </div>
      <p className="rounded-xl bg-[#FAFAFA] px-3 py-2 text-sm">{manage.new_value ?? manage.caption}</p>
    </div>
  );
}
