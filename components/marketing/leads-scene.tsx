"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { adObjectivePlatforms } from "@/lib/ad-objectives";

export type LeadsSceneKind = "intent" | "train" | "qualify" | "inbox" | "paid";

export function LeadsScene({ kind, label }: { kind: LeadsSceneKind; label: string }) {
  const t = useTranslations("Landing");
  return (
    <div className="mt-10 px-5 pb-8 sm:mt-12 sm:px-10 sm:pb-12">
      <p className="text-center text-[12px] font-medium tracking-wide text-[#1d1d1f] sm:text-[13px]">{label}</p>
      {kind === "intent" ? (
        <Thread
          lines={[
            { role: "them", text: t("screenLeadsIntentThem") },
            { role: "us", text: t("screenLeadsIntentUs") },
          ]}
        />
      ) : null}
      {kind === "train" ? <Coach sample={t("screenLeadsTrainSample")} /> : null}
      {kind === "qualify" ? (
        <Thread
          lines={[
            { role: "them", text: t("screenLeadsQualifyThem1") },
            { role: "us", text: t("screenLeadsQualifyUs1") },
            { role: "them", text: t("screenLeadsQualifyThem2") },
            { role: "us", text: t("screenLeadsQualifyUs2") },
          ]}
        />
      ) : null}
      {kind === "inbox" ? (
        <div className="mx-auto mt-5 w-full max-w-[28rem] space-y-2 sm:mt-6">
          {(
            [
              ["screenLeadsCardAName", "screenLeadsCardAStatus", "screenLeadsCardAMeta"],
              ["screenLeadsCardBName", "screenLeadsCardBStatus", "screenLeadsCardBMeta"],
              ["screenLeadsCardCName", "screenLeadsCardCStatus", "screenLeadsCardCMeta"],
            ] as const
          ).map(([name, status, meta]) => (
            <article key={name} className="rounded-[1.15rem] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[14px] font-medium text-[#1d1d1f]">{t(name)}</p>
                <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[11px] font-medium text-[#1d1d1f]">
                  {t(status)}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#6e6e73]">{t(meta)}</p>
            </article>
          ))}
        </div>
      ) : null}
      {kind === "paid" ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3.5">
          {adObjectivePlatforms("leads").map((platform) => (
            <span key={platform.id} title={platform.label}>
              <PlatformIcon platform={platform} connected size="lg" />
              <span className="sr-only">{platform.label}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Thread({ lines }: { lines: Array<{ role: "them" | "us"; text: string }> }) {
  return (
    <div className="mx-auto mt-5 w-full max-w-[28rem] space-y-2 sm:mt-6">
      {lines.map((line) => (
        <p
          key={`${line.role}-${line.text}`}
          className={`max-w-[88%] rounded-[1.15rem] px-3.5 py-2.5 text-[13px] leading-5 sm:text-[14px] sm:leading-6 ${
            line.role === "them"
              ? "bg-white text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "ml-auto bg-[#FF4713]/10 text-[#1d1d1f]"
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

function Coach({ sample }: { sample: string }) {
  return (
    <div className="mx-auto mt-5 w-full max-w-[36rem] sm:mt-6">
      <div className="rounded-[1.35rem] border border-black/10 bg-white px-4 pb-3 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:px-5 sm:pb-3.5 sm:pt-5">
        <p className="min-h-[6.5rem] text-[14px] leading-6 text-[#3a3a3c] sm:min-h-[7.5rem] sm:text-[15px] sm:leading-7">
          {sample}
        </p>
        <div className="mt-4 flex justify-end">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4713] text-white">
            <ArrowUp size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
