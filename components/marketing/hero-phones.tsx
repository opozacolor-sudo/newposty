import Image from "next/image";
import { PhoneHomeScreen } from "@/components/marketing/phone-home-screen";

export function HeroPhones() {
  return (
    <div className="relative mt-5 flex min-h-0 w-full flex-1 items-end justify-center">
      <div className="relative h-full max-w-full" style={{ aspectRatio: "2688 / 1520" }}>
        <Image
          src="/marketing/hero-phones.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 56rem, 94vw"
          className="object-contain object-bottom"
        />
        <div
          className="absolute overflow-hidden"
          style={{
            left: "25.15%",
            top: "11.6%",
            width: "25.7%",
            height: "73.8%",
            borderRadius: "12% / 6.5%",
          }}
        >
          <PhoneHomeScreen />
        </div>
      </div>
    </div>
  );
}
