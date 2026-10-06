import { ADS_PLATFORMS, PLATFORMS } from "@/lib/platforms";

const SOCIAL_IDS = [
  "instagram",
  "tiktok",
  "facebook",
  "linkedin",
  "youtube",
  "threads",
  "pinterest",
] as const;

const ADS_IDS = ["metaads", "googleads", "tiktokads", "linkedinads", "pinterestads", "openaiads"] as const;

const SOCIAL = SOCIAL_IDS.map((id) => PLATFORMS.find((platform) => platform.id === id)).filter(
  (platform): platform is (typeof PLATFORMS)[number] => Boolean(platform),
);

const ADS = ADS_IDS.map((id) => ADS_PLATFORMS.find((platform) => platform.id === id)).filter(
  (platform): platform is (typeof ADS_PLATFORMS)[number] => Boolean(platform),
);

export function NetworkScene({ kind, label }: { kind: "social" | "ads"; label: string }) {
  const platforms = kind === "social" ? SOCIAL : ADS;
  return (
    <div className="mt-10 px-5 pb-8 sm:mt-12 sm:px-10 sm:pb-12">
      <p className="text-center text-[12px] font-medium tracking-wide text-[#1d1d1f] sm:text-[13px]">{label}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3.5">
        {platforms.map((platform) => (
          <span
            key={platform.id}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] shadow-[0_1px_2px_rgba(0,0,0,0.08)] sm:h-14 sm:w-14 sm:rounded-[1.1rem]"
            style={{ background: platform.iconBg }}
            title={platform.label}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white sm:h-6 sm:w-6" aria-hidden>
              <path d={platform.icon.path} />
            </svg>
            <span className="sr-only">{platform.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
