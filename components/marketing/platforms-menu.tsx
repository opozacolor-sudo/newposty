"use client";

import { useTranslations } from "next-intl";
import { isPlatformLandingSlug } from "@/lib/platform-pages";
import { ADS_PLATFORMS, isConnectDisabled, PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { Link } from "@/i18n/navigation";

function PlatformRow({
  platform,
  comingSoon,
  onNavigate,
}: {
  platform: { id: string; label: string; iconBg: string; icon: { path: string } };
  comingSoon: string;
  onNavigate?: () => void;
}) {
  const soon = isConnectDisabled(platform.id);
  const landing = isPlatformLandingSlug(platform.id);
  const inner = (
    <>
      <PlatformIcon platform={platform} connected={!soon} size="sm" />
      <span className="text-sm font-medium text-neutral-800">{platform.label}</span>
      {soon ? <span className="text-[11px] text-neutral-400">{comingSoon}</span> : null}
    </>
  );
  return (
    <li>
      {landing ? (
        <Link
          href={`/platforms/${platform.id}`}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-white/40"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">{inner}</div>
      )}
    </li>
  );
}

export function PlatformsPanel({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Header");
  const comingSoon = t("comingSoon");

  return (
    <div className="grid gap-6 sm:grid-cols-[1.15fr_0.85fr] sm:gap-8">
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f4b48]">
          {t("channels")}
        </p>
        <ul className="mt-2 grid grid-cols-1 min-[380px]:grid-cols-2">
          {PLATFORMS.map((platform) => (
            <PlatformRow
              key={platform.id}
              platform={platform}
              comingSoon={comingSoon}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </div>
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4f4b48]">
          {t("ads")}
        </p>
        <ul className="mt-2">
          {ADS_PLATFORMS.map((platform) => (
            <PlatformRow key={platform.id} platform={platform} comingSoon={comingSoon} />
          ))}
        </ul>
        <Link
          href="/platforms"
          onClick={onNavigate}
          className="mt-3 inline-flex px-2 text-sm font-medium text-[#1d1d1f] underline-offset-4 hover:underline"
        >
          {t("seeAllPlatforms")}
        </Link>
      </div>
    </div>
  );
}
