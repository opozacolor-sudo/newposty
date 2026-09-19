import { getTranslations } from "next-intl/server";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { btnOutline } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const nav = await getTranslations("Header");

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-4 px-3 py-3 sm:gap-8 sm:px-6 sm:py-8 lg:min-h-0 lg:grid-cols-2 lg:gap-10 lg:overflow-hidden lg:py-0">
      <HomeViewportLock />
      <div className="w-full max-w-xl text-center lg:text-left">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF4713] sm:text-xs">
          {t("kicker")}
        </p>
        <h1 className="mt-1.5 text-[1.375rem] font-semibold leading-snug tracking-tight break-words text-neutral-950 sm:mt-3 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem] xl:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-2.5 text-[13px] leading-5 text-neutral-500 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
          {t("subtitle")}
        </p>
        <WaitlistForm compact />
        <div className="mt-3 sm:mt-4">
          <Link
            href="/login"
            className={`${btnOutline} hidden h-9 !px-3 !py-1.5 !text-[11px] sm:inline-flex sm:h-auto sm:!px-5 sm:!py-3 sm:!text-sm`}
          >
            {nav("signIn")}
          </Link>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}
