"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

const KEY = "posty-scroll-how-to";

export function useGoToHowTo() {
  const pathname = usePathname();
  const router = useRouter();

  return () => {
    if (pathname === "/") {
      document.getElementById("how-to-use")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    sessionStorage.setItem(KEY, "1");
    router.push("/");
  };
}

export function HowToScrollOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem(KEY) !== "1") return;
    sessionStorage.removeItem(KEY);
    requestAnimationFrame(() => {
      document.getElementById("how-to-use")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [pathname]);

  return null;
}
