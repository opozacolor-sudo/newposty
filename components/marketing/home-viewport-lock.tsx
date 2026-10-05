"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

export function HomeViewportLock() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.documentElement;
    root.classList.add("home-no-scroll");
    return () => {
      root.classList.remove("home-no-scroll");
    };
  }, [pathname]);

  return null;
}
