import type { ReactNode } from "react";

export function MarketingPageFrame({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-3">
      <div className={`posty-clay-card-wrap mx-auto w-full ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
        <div className="posty-clay-card relative overflow-hidden rounded-[1.6rem] px-5 py-8 sm:rounded-[2rem] sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="relative z-[3] min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
