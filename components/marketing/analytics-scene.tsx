"use client";

import { useTranslations } from "next-intl";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { ADS_PLATFORMS, PLATFORMS } from "@/lib/platforms";

export type AnalyticsSceneKind = "pulse" | "when" | "formats" | "split" | "spend";

const HEAT = [
  [0, 0, 1, 1, 2, 3, 2, 1],
  [0, 1, 2, 2, 3, 4, 3, 1],
  [0, 1, 2, 3, 4, 4, 3, 2],
  [1, 1, 2, 3, 4, 3, 2, 1],
  [0, 1, 2, 2, 3, 4, 4, 2],
  [0, 0, 1, 2, 3, 3, 2, 1],
  [0, 0, 0, 1, 2, 2, 1, 0],
];

const HEAT_FILL = ["#F3F4F6", "#D1FAE5", "#6EE7B7", "#34D399", "#059669"];

export function AnalyticsScene({ kind, label }: { kind: AnalyticsSceneKind; label: string }) {
  const t = useTranslations("Landing");
  return (
    <div className="mt-10 px-5 pb-8 sm:mt-12 sm:px-10 sm:pb-12">
      <p className="text-center text-[12px] font-medium tracking-wide text-[#1d1d1f] sm:text-[13px]">{label}</p>
      {kind === "pulse" ? <Pulse /> : null}
      {kind === "when" ? <When /> : null}
      {kind === "formats" ? <Formats /> : null}
      {kind === "split" ? <Icons platforms={PLATFORMS} /> : null}
      {kind === "spend" ? <Spend /> : null}
    </div>
  );
}

function Pulse() {
  const t = useTranslations("Landing");
  const kpis = [
    ["screenAnalyticsKpiRate", "screenAnalyticsKpiRateValue"],
    ["screenAnalyticsKpiReach", "screenAnalyticsKpiReachValue"],
    ["screenAnalyticsKpiFollowers", "screenAnalyticsKpiFollowersValue"],
    ["screenAnalyticsKpiPosts", "screenAnalyticsKpiPostsValue"],
  ] as const;
  return (
    <div className="mx-auto mt-5 w-full max-w-[28rem] sm:mt-6">
      <div className="mb-3 flex justify-center gap-1.5">
        {(["screenAnalyticsRange7", "screenAnalyticsRange30", "screenAnalyticsRange90"] as const).map((key, index) => (
          <span
            key={key}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              index === 1 ? "bg-[#1d1d1f] text-white" : "bg-white text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            }`}
          >
            {t(key)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {kpis.map(([label, value]) => (
          <article key={label} className="rounded-[1.15rem] bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] text-[#6e6e73]">{t(label)}</p>
            <p className="mt-1 text-[18px] font-semibold tracking-tight text-[#1d1d1f]">{t(value)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function When() {
  const t = useTranslations("Landing");
  const days = t("screenAnalyticsHeatDays").split(" ");
  return (
    <div className="mx-auto mt-5 w-full max-w-[28rem] sm:mt-6">
      <div className="rounded-[1.15rem] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-[1.7rem_1fr] gap-1">
          <span />
          <div className="grid grid-cols-8 text-center text-[9px] text-[#86868b]">
            <span>8</span>
            <span>10</span>
            <span>12</span>
            <span>14</span>
            <span>16</span>
            <span>18</span>
            <span>20</span>
            <span>22</span>
          </div>
          {HEAT.map((row, day) => (
            <div key={days[day] ?? day} className="contents">
              <span className="self-center text-[10px] text-[#86868b]">{days[day]}</span>
              <div className="grid grid-cols-8 gap-0.5">
                {row.map((score, hour) => (
                  <span
                    key={`${day}-${hour}`}
                    className="aspect-square rounded-[2px]"
                    style={{ background: HEAT_FILL[score] }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[12px] font-medium text-[#059669]">{t("screenAnalyticsBestSlot")}</p>
      </div>
    </div>
  );
}

function Formats() {
  const t = useTranslations("Landing");
  const rows = [
    ["screenAnalyticsFormatReel", "screenAnalyticsFormatReelRate", true],
    ["screenAnalyticsFormatPhoto", "screenAnalyticsFormatPhotoRate", false],
    ["screenAnalyticsFormatCarousel", "screenAnalyticsFormatCarouselRate", false],
  ] as const;
  return (
    <div className="mx-auto mt-5 w-full max-w-[28rem] space-y-2 sm:mt-6">
      {rows.map(([name, rate, best]) => (
        <article
          key={name}
          className={`flex items-center justify-between rounded-[1.15rem] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ${
            best ? "bg-[#fff5f2]" : "bg-white"
          }`}
        >
          <div>
            <p className="text-[14px] font-medium text-[#1d1d1f]">
              {t(name)}
              {best ? (
                <span className="ml-2 rounded bg-[#FF4713] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {t("screenAnalyticsBestFormat")}
                </span>
              ) : null}
            </p>
          </div>
          <p className="text-[16px] font-semibold text-[#1d1d1f]">{t(rate)}</p>
        </article>
      ))}
    </div>
  );
}

function Icons({ platforms }: { platforms: ReadonlyArray<{ id: string; label: string }> }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
      {platforms.map((platform) => (
        <span key={platform.id} title={platform.label}>
          <PlatformIcon platform={platform} connected size="lg" />
          <span className="sr-only">{platform.label}</span>
        </span>
      ))}
    </div>
  );
}

function Spend() {
  const t = useTranslations("Landing");
  const kpis = [
    ["screenAnalyticsMoneySpend", "screenAnalyticsMoneySpendValue"],
    ["screenAnalyticsMoneyImpressions", "screenAnalyticsMoneyImpressionsValue"],
    ["screenAnalyticsMoneyCtr", "screenAnalyticsMoneyCtrValue"],
  ] as const;
  return (
    <div className="mx-auto mt-5 w-full max-w-[28rem] sm:mt-6">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(([label, value]) => (
          <article key={label} className="rounded-[1.15rem] bg-white px-2.5 py-3 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] text-[#6e6e73]">{t(label)}</p>
            <p className="mt-1 text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{t(value)}</p>
          </article>
        ))}
      </div>
      <Icons platforms={ADS_PLATFORMS} />
    </div>
  );
}
