"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

export function HomeViewportLock() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.documentElement;
    const media = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      root.classList.toggle("home-no-scroll", media.matches);
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      root.classList.remove("home-no-scroll");
    };
  }, [pathname]);

  return null;
}
