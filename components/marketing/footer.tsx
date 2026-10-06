import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { HomeWaitlistBand } from "@/components/marketing/home-waitlist-band";
import { MARKETING_SOCIAL } from "@/lib/marketing-social";

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="shrink-0">
      <HomeWaitlistBand />
      <div className="bg-[#f5f5f7] px-4 py-1 sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-[980px] items-center justify-between gap-2 sm:gap-3">
          <ul className="flex items-center gap-2 sm:gap-4">
            {MARKETING_SOCIAL.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-[clamp(1.15rem,3.1dvh,1.75rem)] items-center justify-center overflow-hidden rounded-[0.45rem] transition hover:opacity-80 sm:size-8 sm:rounded-[0.55rem]"
                  aria-label={item.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand-icons/${item.id}.jpg`} alt="" className="h-full w-full object-cover" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleSwitch className="shrink-0" />
            <span className="whitespace-nowrap text-[10px] text-[#6e6e73] sm:text-xs">{t("copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
