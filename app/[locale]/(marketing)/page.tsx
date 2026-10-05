import { getTranslations } from "next-intl/server";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center px-4 pb-2 pt-2 text-center sm:px-6">
      <HomeViewportLock />
      <h1 className="font-semibold tracking-tight text-neutral-950 text-[clamp(2.1rem,6vw,4.4rem)] leading-none">
        posty.now
      </h1>
      <p className="mt-2 max-w-xl text-[13px] leading-5 text-neutral-600 sm:mt-3 sm:text-lg sm:leading-7">
        {t("heroLine")}
      </p>
      <div className="mt-4 flex min-h-0 w-full flex-1 items-end justify-center sm:mt-6">
        <HeroPhones />
      </div>
    </section>
  );
}
