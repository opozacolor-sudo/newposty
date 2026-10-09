import type { ReactNode } from "react";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link } from "@/i18n/navigation";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="posty-clay-card-wrap w-full max-w-[22.5rem]">
        <div className="posty-clay-card relative overflow-hidden rounded-[2rem] px-7 py-9 sm:rounded-[2.4rem] sm:px-8 sm:py-11">
          <div className="relative z-[3]">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="min-w-0">
                <BrandLogo
                  wordmark
                  width={97}
                  height={16}
                  className="text-[15px] font-medium leading-none tracking-tight text-[#1d1d1f]"
                />
              </Link>
              <LocaleSwitch className="posty-auth-locale" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export const authField =
  "posty-clay-field mt-1.5 w-full rounded-full px-5 py-3 text-sm text-[#1d1d1f] outline-none placeholder:text-[#8a8682]";

export const authLabel = "block text-[13px] font-medium text-[#5c5652]";
