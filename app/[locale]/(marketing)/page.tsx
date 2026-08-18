import { getTranslations } from "next-intl/server";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const nav = await getTranslations("Header");

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 overflow-x-hidden px-4 py-8 sm:px-6 lg:min-h-0 lg:grid-cols-2 lg:gap-10 lg:overflow-hidden lg:py-0">
      <HomeViewportLock />
      <div className="max-w-xl text-center lg:text-left">
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-950 sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 text-base leading-7 text-neutral-500 sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
          <Link href="/login" className={`${btnOutline} px-5 py-3`}>
            {nav("signIn")}
          </Link>
          <Link href="/signup" className={`${btnSolid} px-5 py-3`}>
            {nav("signUp")}
          </Link>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}
