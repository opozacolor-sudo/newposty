"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const resolved = payload.resolved;
  const [captions, setCaptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const action of resolved.actions) {
      for (const platform of action.platforms) {
        initial[platform.platform] = platform.caption;
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
      body: JSON.stringify({ action_id: payload.action_id, cancel: true }),
    });
    onDone({ kind: "cancelled" });
  }

  return (
    <section className="mt-3 space-y-3 rounded-2xl border border-[#E5E5E5] bg-white p-4">
      {resolved.kind === "manage" && resolved.manage ? (
        <ManageBlock resolved={resolved} />
      ) : (
        resolved.actions.map((action, index) => (
          <div key={`${action.mode}-${index}`} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
              {action.mode === "schedule" ? action.scheduled_label : t("postNow")}
            </p>
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
                  <li key={platform.accountId} className="rounded-xl border border-[#F3F4F6] p-3">
                    <div className="flex items-center gap-2">
                      {visual ? <PlatformIcon platform={visual} connected size="sm" /> : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1A1A1A]">
                          {platformLabel(platform.platform)}
                        </p>
                        <p className="truncate text-xs text-[#6B7280]">{platform.handle}</p>
                      </div>
                    </div>
                    <textarea
                      value={captions[platform.platform] ?? platform.caption}
                      onChange={(event) =>
                        setCaptions((current) => ({
                          ...current,
                          [platform.platform]: event.target.value,
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

      {resolved.excluded_by_validation.length > 0 ? (
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
          {t("confirmPost")}
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
