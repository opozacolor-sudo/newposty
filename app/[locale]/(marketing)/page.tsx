import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroPhones } from "@/components/marketing/hero-phones";
import { HomeViewportLock } from "@/components/marketing/home-viewport-lock";

export default async function HomePage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col pt-3">
      <HomeViewportLock />
      <div className="flex shrink-0 flex-col items-center text-center px-5">
        <h1 className="font-semibold tracking-tight text-[#1d1d1f] text-[clamp(2.2rem,6vw,3.25rem)] leading-none">
          posty.now
        </h1>
        <p className="mt-2 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-snug text-[#1d1d1f]">
          {t("heroLine")}
        </p>
        <Link
          href="/guide"
          className="mt-3 inline-flex h-9 items-center rounded-full bg-[#0071e3] px-4 text-[14px] font-normal text-white transition hover:bg-[#0077ed]"
        >
          {t("learnMore")}
        </Link>
      </div>
      <HeroPhones />
    </section>
  );
}
