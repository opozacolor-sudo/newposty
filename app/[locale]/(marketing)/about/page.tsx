import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg leading-8 text-neutral-600">{t("p1")}</p>
      <p className="mt-4 text-lg leading-8 text-neutral-600">{t("p2")}</p>
    </section>
  );
}
