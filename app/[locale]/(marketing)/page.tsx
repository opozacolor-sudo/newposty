import { getTranslations } from "next-intl/server";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { HowToScrollOnMount } from "@/components/marketing/how-to-nav";
import { SeeHowButton } from "@/components/marketing/see-how-button";
import { btnOutline, btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  return (
    <>
      <HowToScrollOnMount />
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-hidden px-4 py-10 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2 lg:gap-12 lg:py-0">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            {t("title")}
          </h1>
          <p className="mt-5 text-base leading-7 text-neutral-500 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup" className={`${btnSolid} px-5 py-3`}>
              {t("startFree")}
            </Link>
            <SeeHowButton className={`${btnOutline} px-5 py-3`}>
              {t("seeHow")}
            </SeeHowButton>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section
        id="how-to-use"
        className="scroll-mt-24 border-t border-neutral-100 bg-[#FAFAFA]"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-sm font-medium text-[#FF4713]">{t("howTitle")}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {t("howSubtitle")}
          </h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <li key={step.title} className="max-w-xs">
                <span className="text-sm font-medium text-[#FF4713]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
