export function BrandLogo({
  className,
  width,
  height,
}: {
  className?: string;
  width: number;
  height: number;
}) {
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
