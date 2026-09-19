import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });
  return {
    title: t("waitlistPageTitle"),
    description: t("waitlistPageSubtitle"),
  };
}

export default async function WaitlistPage() {
  const t = await getTranslations("Landing");

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#FF4713]">{t("kicker")}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {t("waitlistPageTitle")}
      </h1>
      <p className="mt-3 text-base leading-7 text-neutral-500 sm:text-lg">{t("waitlistPageSubtitle")}</p>
      <WaitlistForm />
    </section>
  );
}
