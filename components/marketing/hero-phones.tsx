import Image from "next/image";
import { getTranslations } from "next-intl/server";

const CARDS = [
  { src: "/marketing/phone-card-1.png", nameKey: "screenNetworks" },
  { src: "/marketing/phone-card-2.png", nameKey: "screenContent" },
  { src: "/marketing/phone-card-3.png", nameKey: "screenAds" },
  { src: "/marketing/phone-card-4.png", nameKey: "screenChat" },
  { src: "/marketing/phone-card-5.png", nameKey: "screenLeads" },
] as const;

export async function HeroPhones() {
  const t = await getTranslations("Landing");

  return (
    <div className="mt-8 flex min-h-0 w-full flex-1 flex-col justify-end pb-1">
      <h2 className="mb-3 text-left text-[clamp(1.35rem,2.6vw,2rem)] font-semibold tracking-tight text-[#1d1d1f]">
        {t("screensTitle")}
      </h2>
      <ul className="grid grid-cols-5 items-start gap-x-8 gap-y-3 lg:gap-x-12">
        {CARDS.map((card) => (
          <li key={card.nameKey} className="group min-w-0">
            <Image
              src={card.src}
              alt=""
              width={194}
              height={207}
              priority
              className="block h-auto w-full origin-center transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.045]"
            />
            <p className="mt-2.5 text-left text-[11px] font-semibold leading-snug text-[#1d1d1f] sm:text-[13px]">
              {t(card.nameKey)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
