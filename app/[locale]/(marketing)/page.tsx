import { getTranslations } from "next-intl/server";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const nav = await getTranslations("Header");

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-5 overflow-x-hidden px-4 py-4 sm:gap-8 sm:px-6 sm:py-8 lg:min-h-0 lg:grid-cols-2 lg:gap-10 lg:overflow-hidden lg:py-0">
      <HomeViewportLock />
      <div className="max-w-xl text-center lg:text-left">
        <h1 className="text-[clamp(1.5rem,6.2vw,2.25rem)] font-semibold leading-[1.15] tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem] xl:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-5 flex flex-row items-center gap-2 sm:mt-8 sm:gap-3 lg:justify-start">
          <Link
            href="/login"
            className={`${btnOutline} h-10 min-w-0 flex-1 !px-3 !py-2 !text-xs sm:h-auto sm:flex-none sm:!px-5 sm:!py-3 sm:!text-sm`}
          >
            {nav("signIn")}
          </Link>
          <Link
            href="/signup"
            className={`${btnSolid} h-10 min-w-0 flex-1 !px-3 !py-2 !text-xs sm:h-auto sm:flex-none sm:!px-5 sm:!py-3 sm:!text-sm`}
          >
            {nav("signUp")}
          </Link>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}
