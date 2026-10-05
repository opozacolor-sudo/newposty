import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col pt-1 lg:pt-3">
      <HomeViewportLock />
      <div className="flex shrink-0 flex-col items-center px-5 text-center">
        <h1 className="text-[clamp(1.7rem,7vw,3.25rem)] font-semibold leading-none tracking-tight text-[#1d1d1f]">
          posty.now
        </h1>
        <p className="mt-1.5 flex min-h-[2.1rem] max-w-2xl items-center justify-center text-[clamp(0.92rem,3.4vw,1.25rem)] leading-snug text-[#1d1d1f] lg:mt-2 lg:min-h-[2.6rem]">
          {t("heroLine")}
        </p>
        <Link
          href="/guide"
          className="mt-2 inline-flex h-8 items-center rounded-full bg-[#0071e3] px-4 text-[13px] font-normal text-white transition hover:bg-[#0077ed] lg:mt-3 lg:h-9 lg:text-[14px]"
        >
          {t("learnMore")}
        </Link>
      </div>
      <HeroPhones />
    </section>
  );
}
