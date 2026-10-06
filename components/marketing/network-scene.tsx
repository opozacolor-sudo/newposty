import { PlatformIcon } from "@/components/studio/platform-icon";
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
          <span key={platform.id} title={platform.label}>
            <PlatformIcon platform={platform} connected size="lg" />
            <span className="sr-only">{platform.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
