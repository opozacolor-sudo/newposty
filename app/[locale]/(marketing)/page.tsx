import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-[88rem] flex-1 flex-col px-5 pt-6 sm:px-8 sm:pt-8">
      <HomeViewportLock />
      <div className="flex flex-col items-center text-center">
        <h1 className="font-semibold tracking-tight text-[#1d1d1f] text-[clamp(2.4rem,6.5vw,3.5rem)] leading-none">
          posty.now
        </h1>
        <p className="mt-3 max-w-2xl text-[clamp(1.05rem,2.1vw,1.35rem)] leading-snug text-[#1d1d1f]">
          {t("heroLine")}
        </p>
        <Link
          href="/guide"
          className="mt-4 inline-flex h-9 items-center rounded-full bg-[#0071e3] px-4 text-[14px] font-normal text-white transition hover:bg-[#0077ed]"
        >
          {t("learnMore")}
        </Link>
      </div>
      <HeroPhones />
    </section>
  );
}
