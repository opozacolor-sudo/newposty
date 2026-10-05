export function BrandLogo({
  className,
  width,
  height,
  light = false,
}: {
  className?: string;
  width: number;
  height: number;
  light?: boolean;
}) {
  if (light) {
    return (
      <span className={`inline-block font-extrabold tracking-tight text-[#E4EEF0] ${className ?? ""}`}>
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
