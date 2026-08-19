export function PlatformIcon({
  platform,
  connected,
  size = "md",
}: {
  platform: { label: string; iconBg: string; icon: { path: string } };
  connected: boolean;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center transition duration-200 ${box} ${
        connected ? "opacity-100" : "opacity-70 saturate-[0.7]"
      }`}
      style={{ background: platform.iconBg }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className={`${icon} fill-white`}>
        <path d={platform.icon.path} />
      </svg>
    </span>
  );
}
