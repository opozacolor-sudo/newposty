import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col">
      <HomeViewportLock />
      <div className="flex min-h-0 flex-1 flex-col lg:justify-center lg:[container-type:size]">
        <div className="posty-hero-intro flex shrink-0 flex-col items-center px-5 text-center">
          <h1 className="m-0">
            <Image
              src="/marketing/hero-wordmark.png"
              alt="posty.now"
              width={996}
              height={206}
              priority
              className="posty-hero-wordmark h-[clamp(1.7rem,5.6dvh,2.7rem)] w-auto max-w-[min(20rem,88vw)] object-contain lg:h-[clamp(2rem,6.2dvh,3.1rem)]"
            />
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
