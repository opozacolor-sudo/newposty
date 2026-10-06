"use client";

import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { useTranslations } from "next-intl";

export type ChatSceneKind = "voice" | "publish" | "month" | "create" | "manage";

const CHIPS: Record<Exclude<ChatSceneKind, "voice">, readonly string[]> = {
  publish: ["screenChatChipNow", "screenChatChipBestTime", "screenChatChipFormats"],
  month: ["screenChatChipSeries", "screenChatChipRemix", "screenChatChipCatalog"],
  create: ["screenChatChipImage", "screenChatChipVideo", "screenChatChipSite"],
  manage: ["screenChatChipManage", "screenChatChipVoice", "screenChatChipConfirm"],
};

export function ChatScene({ kind, label }: { kind: ChatSceneKind; label: string }) {
  const t = useTranslations("Landing");
  return (
    <div className="mt-10 px-5 pb-8 sm:mt-12 sm:px-10 sm:pb-12">
      <p className="text-center text-[12px] font-medium tracking-wide text-[#1d1d1f] sm:text-[13px]">{label}</p>
      {kind === "voice" ? (
        <Composer />
      ) : (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6">
          {CHIPS[kind].map((key) => (
            <span
              key={key}
              className="rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:text-[13px]"
            >
              {t(key)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Composer() {
  const t = useTranslations("Landing");
  const lines = t("screenChatComposerSample").split("\n");
  return (
    <div className="mx-auto mt-5 w-full max-w-[36rem] sm:mt-6">
      <div className="rounded-[1.35rem] border border-black/10 bg-white px-4 pb-3 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:px-5 sm:pb-3.5 sm:pt-5">
        <div className="min-h-[9.5rem] space-y-2 text-[14px] leading-6 text-[#1d1d1f] sm:min-h-[11rem] sm:text-[15px] sm:leading-7">
          {lines.map((line) => (
            <p key={line} className="text-[#3a3a3c]">
              {line}
            </p>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280]">
              <Paperclip size={17} />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF4713] px-3 py-1.5 text-white shadow-[0_6px_16px_rgba(255,71,19,0.28)]">
              <Mic size={16} />
              <span className="text-[12px] font-medium sm:text-[13px]">{t("screenChatDictate")}</span>
            </span>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4713] text-white">
            <ArrowUp size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
