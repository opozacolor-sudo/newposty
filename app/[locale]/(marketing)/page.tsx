import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col pt-0 lg:pt-3">
      <HomeViewportLock />
      <div className="flex shrink-0 flex-col items-center px-5 text-center">
        <h1 className="text-[clamp(1.25rem,4dvh,3.25rem)] font-semibold leading-none tracking-tight text-[#1d1d1f]">
          posty.now
        </h1>
        <p className="mt-0.5 flex max-w-[20rem] items-center justify-center text-[clamp(0.72rem,1.9dvh,1.25rem)] leading-snug text-[#1d1d1f] lg:mt-2 lg:max-w-2xl lg:min-h-[2.6rem]">
          {t("heroLine")}
        </p>
        <Link
          href="/guide"
          className="mt-1 inline-flex h-7 items-center rounded-full bg-[#0071e3] px-3.5 text-[12px] font-normal text-white transition hover:bg-[#0077ed] lg:mt-3 lg:h-9 lg:px-4 lg:text-[14px]"
        >
          {t("learnMore")}
        </Link>
      </div>
      <HeroPhones />
    </section>
  );
}
