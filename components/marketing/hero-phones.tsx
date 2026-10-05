import Image from "next/image";
import { getTranslations } from "next-intl/server";

const CARDS = [
  { src: "/marketing/phone-card-1.png", nameKey: "screenNetworks" },
  { src: "/marketing/phone-card-2.png", nameKey: "screenAssistant" },
  { src: "/marketing/phone-card-3.png", nameKey: "screenPublish" },
  { src: "/marketing/phone-card-4.png", nameKey: "screenAnalytics" },
  { src: "/marketing/phone-card-5.png", nameKey: "screenAds" },
] as const;

export async function HeroPhones() {
  const t = await getTranslations("Landing");

  return (
    <ul className="mt-8 grid w-full flex-1 grid-cols-5 content-center items-start gap-3 sm:gap-5">
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
          <p className="mt-2.5 text-center text-[12px] font-normal leading-tight text-[#1d1d1f] sm:text-[15px]">
            {t(card.nameKey)}
          </p>
        </li>
      ))}
    </ul>
  );
}
