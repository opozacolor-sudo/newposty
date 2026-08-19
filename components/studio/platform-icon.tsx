export function PlatformIcon({
  platform,
  connected,
}: {
  platform: { label: string; iconBg: string; icon: { path: string } };
  connected: boolean;
}) {
  return (
    <span
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-200 ${
        connected ? "opacity-100" : "opacity-70 saturate-[0.7]"
      }`}
      style={{ background: platform.iconBg }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
        <path d={platform.icon.path} />
      </svg>
    </span>
  );
}
