import { getTranslations } from "next-intl/server";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF5B04] sm:text-xs">
        {t("kicker")}
      </p>
      <h1 className="mt-3 max-w-3xl text-[1.75rem] font-semibold leading-tight tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem]">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-6 text-neutral-600 sm:mt-5 sm:text-lg sm:leading-8">
        {t("subtitle")}
      </p>
      <div className="w-full max-w-xl">
        <WaitlistForm compact />
      </div>
      <div className="mt-10 w-full sm:mt-14">
        <HeroVisual />
      </div>
    </section>
  );
}
