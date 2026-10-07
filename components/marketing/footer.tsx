import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { HomeWaitlistBand } from "@/components/marketing/home-waitlist-band";
import { MARKETING_SOCIAL } from "@/lib/marketing-social";

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="posty-footer-dock posty-clay-card relative mx-3 mb-3 mt-2 shrink-0 rounded-[2rem] sm:mx-5 sm:mb-4">
      <div className="relative z-[3] mx-auto grid max-w-[1180px] grid-cols-2 items-center gap-2 px-2.5 py-2 sm:gap-3 sm:px-3 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,1.45fr)_minmax(0,1fr)]">
        <div className="relative order-2 col-start-1 px-1 py-1 lg:order-1 lg:col-start-1">
          <ul className="relative z-[3] flex items-center justify-center gap-1">
            {MARKETING_SOCIAL.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="posty-footer-social-icon inline-flex size-8 items-center justify-center overflow-hidden rounded-[0.75rem] transition duration-200 hover:z-[1] hover:-translate-y-1 hover:scale-105 sm:size-10 sm:rounded-[0.9rem] lg:size-[3.75rem] lg:rounded-[1.1rem]"
                  aria-label={item.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/footer-social/${item.id}.${item.id === "youtube" ? "jpg" : "png"}`}
                    alt=""
                    className="h-full w-full scale-[1.28] object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="posty-footer-cta posty-footer-signup-card relative order-1 col-span-2 rounded-[1.8rem] empty:hidden lg:order-2 lg:col-span-1 lg:col-start-2">
          <HomeWaitlistBand />
        </div>

        <div className="relative order-3 col-start-2 px-1 py-1 lg:col-start-3">
          <div className="relative z-[3] flex flex-row-reverse items-center justify-start gap-1.5">
            <div className="posty-footer-meta-tile posty-footer-language-tile h-7 w-11 rounded-full transition duration-200 hover:-translate-y-0.5 sm:h-8 sm:w-12 lg:h-10 lg:w-14">
              <LocaleSwitch className="shrink-0" />
            </div>
            <div className="posty-footer-meta-tile h-7 w-14 rounded-full transition duration-200 hover:-translate-y-0.5 sm:h-8 sm:w-16 lg:h-10 lg:w-[4.5rem]">
              <span className="whitespace-nowrap text-[8px] font-medium text-[#55514e] sm:text-[9px] lg:text-[10px]">
                {t("copyright")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
