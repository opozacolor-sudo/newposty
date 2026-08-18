import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-base leading-8 text-neutral-600">{t("body")}</p>
    </section>
  );
}
