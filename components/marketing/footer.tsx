import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { HomeWaitlistBand } from "@/components/marketing/home-waitlist-band";
import { MARKETING_SOCIAL } from "@/lib/marketing-social";

const ANPC_SAL_HREF = "https://reclamatiisal.anpc.ro/";

function AnpcBadge({ className = "", label }: { className?: string; label: string }) {
  return (
    <a
      href={ANPC_SAL_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`posty-footer-anpc-badge ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/marketing/anpc-sal.png"
        alt=""
        width={971}
        height={434}
        draggable={false}
      />
    </a>
  );
}

export async function MarketingFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="posty-footer-dock posty-clay-card relative mx-3 mb-3 mt-1 shrink-0 overflow-hidden rounded-[1.6rem] sm:mx-5 sm:mb-4 sm:mt-2 sm:rounded-[2rem]">
      <div className="relative z-[3] grid w-full grid-cols-1 items-center gap-2 px-3 py-2 pb-[max(0.65rem,env(safe-area-inset-bottom,0px))] sm:gap-3 sm:px-4 sm:py-3 sm:pb-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4 lg:px-6">
        <div className="posty-footer-cta posty-footer-signup-card relative order-1 self-center justify-self-center rounded-[1.8rem] empty:hidden lg:order-2 lg:col-start-2 lg:w-full lg:max-w-[34rem]">
          <HomeWaitlistBand />
        </div>

        <div className="relative order-2 flex min-w-0 items-center justify-between gap-1.5 lg:contents">
          <div className="relative min-w-0 self-center lg:order-1 lg:col-start-1 lg:justify-self-start">
            <ul className="relative z-[3] flex items-center justify-start gap-0.5 sm:gap-1.5">
              {MARKETING_SOCIAL.map((item) => (
                <li key={item.id} className="shrink-0">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="posty-footer-social-icon inline-flex size-7 items-center justify-center overflow-hidden rounded-[0.55rem] transition duration-200 sm:size-9 sm:rounded-[0.7rem] lg:size-[3.75rem] lg:rounded-[1.15rem] lg:hover:z-[1] lg:hover:-translate-y-1 lg:hover:scale-105"
                    aria-label={item.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/footer-social/${item.id}.jpg`}
                      alt=""
                      className="h-full w-full object-cover lg:scale-[1.06]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <AnpcBadge className="posty-footer-anpc-mobile" label={t("anpcAria")} />

          <div className="relative z-[3] flex shrink-0 items-center justify-end gap-1 self-center lg:order-3 lg:col-start-3 lg:flex-col lg:items-end lg:gap-1.5 lg:justify-self-end">
            <div className="flex flex-row-reverse items-center gap-1">
              <div className="posty-footer-meta-tile posty-footer-language-tile h-6 w-10 rounded-full transition duration-200 hover:-translate-y-0.5 sm:h-6 sm:w-10 lg:h-8 lg:w-12">
                <LocaleSwitch className="shrink-0" />
              </div>
              <div className="posty-footer-meta-tile h-6 w-12 rounded-full transition duration-200 hover:-translate-y-0.5 sm:h-6 sm:w-12 lg:h-8 lg:w-[4.5rem]">
                <span className="whitespace-nowrap text-[8px] font-semibold tracking-wide text-[#3f3b38] lg:text-[10px]">
                  {t("copyright")}
                </span>
              </div>
            </div>
            <AnpcBadge className="posty-footer-anpc-desktop" label={t("anpcAria")} />
          </div>
        </div>
      </div>
    </footer>
  );
}
