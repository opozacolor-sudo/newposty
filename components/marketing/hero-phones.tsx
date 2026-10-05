import Image from "next/image";

export function HeroPhones() {
  return (
    <div className="relative mt-5 min-h-0 w-full flex-1" aria-hidden>
      <Image
        src="/marketing/hero-phones.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 56rem, 94vw"
        className="object-contain object-bottom"
      />
    </div>
  );
}
