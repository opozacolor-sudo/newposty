export function BrandLogo({
  className,
  width,
  height,
  light = false,
  wordmark = false,
}: {
  className?: string;
  width: number;
  height: number;
  light?: boolean;
  wordmark?: boolean;
}) {
  if (wordmark || light) {
    return (
      <span
        className={`inline-block tracking-tight ${light ? "text-[#E4EEF0]" : "text-[#1d1d1f]"} ${className ?? ""}`}
      >
        posty.now
      </span>
    );
  }

  return (
    <img
      src="/logo.png?v=3"
      alt="posty.now"
      className={className}
      width={width}
      height={height}
    />
  );
}
