import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg leading-8 text-neutral-600">{t("p1")}</p>
      <h2 className="mt-10 text-xl font-semibold tracking-tight text-neutral-950">
        {t("bulkTitle")}
      </h2>
      <p className="mt-3 text-lg leading-8 text-neutral-600">{t("bulkBody")}</p>
      <h2 className="mt-10 text-xl font-semibold tracking-tight text-neutral-950">
        {t("timeTitle")}
      </h2>
      <p className="mt-3 text-lg leading-8 text-neutral-600">{t("timeBody")}</p>
      <h2 className="mt-10 text-xl font-semibold tracking-tight text-neutral-950">
        {t("studioTitle")}
      </h2>
      <p className="mt-3 text-lg leading-8 text-neutral-600">{t("studioBody")}</p>
      <p className="mt-10 text-lg font-medium leading-8 text-neutral-950">{t("close")}</p>
    </section>
  );
}
