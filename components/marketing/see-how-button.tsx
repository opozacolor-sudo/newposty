"use client";

import type { ReactNode } from "react";
import { useGoToHowTo } from "./how-to-nav";

export function SeeHowButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const goToHowTo = useGoToHowTo();

  return (
    <button type="button" className={className} onClick={goToHowTo}>
      {children}
    </button>
  );
}
