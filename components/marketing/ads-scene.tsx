import { PlatformIcon } from "@/components/studio/platform-icon";
import { adObjectivePlatforms, type AdObjectiveId } from "@/lib/ad-objectives";

export function AdsScene({ kind, label }: { kind: AdObjectiveId; label: string }) {
  const platforms = adObjectivePlatforms(kind);
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
