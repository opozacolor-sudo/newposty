import { platformIconSrc } from "@/lib/platforms";

const SIZES = {
  xs: "h-5 w-5 rounded-[5px]",
  sm: "h-9 w-9 rounded-[0.7rem]",
  md: "h-10 w-10 rounded-[0.85rem]",
  lg: "h-11 w-11 rounded-[0.9rem] sm:h-14 sm:w-14 sm:rounded-[1.1rem]",
} as const;

export function PlatformIcon({
  platform,
  connected,
  size = "md",
}: {
  platform: {
    id?: string;
    label: string;
    iconSrc?: string;
    iconBg?: string;
    icon?: { path: string };
  };
  connected: boolean;
  size?: keyof typeof SIZES;
}) {
  const src = platform.iconSrc ?? (platform.id ? platformIconSrc(platform.id) : undefined);
  const box = SIZES[size];

  if (src) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden bg-[#f5f5f7] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-200 ${box} ${
          connected ? "opacity-100" : "opacity-55"
        }`}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full origin-center scale-[1.08] object-cover" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center transition duration-200 ${box} ${
        connected ? "opacity-100" : "opacity-70 saturate-[0.7]"
      }`}
      style={{ background: platform.iconBg }}
      aria-hidden
    >
      {platform.icon ? (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 fill-white">
          <path d={platform.icon.path} />
        </svg>
      ) : null}
    </span>
  );
}
