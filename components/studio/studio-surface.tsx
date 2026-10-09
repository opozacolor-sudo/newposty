import type { ReactNode } from "react";

export function StudioPage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`h-full min-h-0 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4 ${className}`.trim()}>
      {children}
    </main>
  );
}

export function StudioGlass({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`posty-glass-3d relative overflow-hidden rounded-[1.4rem] ${className}`.trim()}>
      <div className="relative z-[3]">{children}</div>
    </div>
  );
}

export function StudioFillCard({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 pb-1 pt-1 sm:px-5 sm:pb-2 sm:pt-2">
      <div
        className={`posty-clay-card-wrap mx-auto flex min-h-0 w-full flex-1 flex-col ${
          wide ? "max-w-[min(72rem,100%)]" : "max-w-[min(54rem,100%)]"
        }`}
      >
        <div className="posty-clay-card relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
          <div className="relative z-[3] flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
