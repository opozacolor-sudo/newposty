import { getTranslations } from "next-intl/server";
import { Unica_One } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

const unicaOne = Unica_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col">
      <HomeViewportLock />
      <div className="flex min-h-0 flex-1 flex-col lg:justify-center lg:[container-type:size]">
        <div className="posty-hero-intro flex shrink-0 flex-col items-center px-5 text-center">
          <h1 className={`${unicaOne.className} text-[clamp(1.4rem,4.4dvh,3rem)] font-normal leading-none tracking-[0.015em] text-[#1d1d1f]`}>
            posty.now
          </h1>
          <p className="mt-0.5 flex max-w-[20rem] items-center justify-center text-[clamp(0.65rem,1.35dvh,0.9rem)] leading-tight text-[#1d1d1f] lg:mt-1 lg:max-w-2xl">
            {t("heroLine")}
          </p>
          <Link
            href="/guide"
            className="posty-glow-btn posty-site-btn mt-1 inline-flex h-7 items-center rounded-full px-3.5 text-[12px] font-normal text-white transition hover:brightness-110 lg:mt-2 lg:h-8 lg:px-4 lg:text-[14px]"
          >
            {t("learnMore")}
          </Link>
        </div>
        <HeroPhones />
      </div>
    </section>
  );
}
