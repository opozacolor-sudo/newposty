import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/contact-form";

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-lg text-base leading-7 text-neutral-500">
        {t("subtitle")}
      </p>
      <ContactForm />
    </section>
  );
}
