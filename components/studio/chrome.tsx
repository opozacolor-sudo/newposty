import type { ReactNode } from "react";
import { StudioSidebar } from "@/components/studio/sidebar";

export function StudioChrome({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#1A1A1A] lg:h-dvh lg:flex-row lg:overflow-hidden">
      <StudioSidebar email={email} />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:h-full lg:overflow-hidden">{children}</div>
    </div>
  );
}
