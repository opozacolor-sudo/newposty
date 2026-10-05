"use client";

import { usePathname } from "@/i18n/navigation";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HomeWaitlistBand() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 text-center sm:py-12">
      <WaitlistForm compact tone="onDark" />
    </div>
  );
}
