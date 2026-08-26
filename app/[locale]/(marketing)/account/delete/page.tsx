import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function DeleteAccountPage() {
  const t = await getTranslations("DeleteAccount");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-base leading-8 text-neutral-600">{t("body")}</p>
      <p className="mt-4 text-base leading-8 text-neutral-600">{t("how")}</p>
      <Link href="/contact" className="mt-8 inline-flex text-sm font-medium text-[#FF4713]">
        {t("contact")}
      </Link>
    </section>
  );
}
