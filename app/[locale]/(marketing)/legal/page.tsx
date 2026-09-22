import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COMPANY, legalPages } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ro" ? "Documente legale" : "Legal";
  return { title, description: COMPANY.name };
}

export default async function LegalIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("LegalIndex");
  const pages = legalPages(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 text-base leading-8 text-neutral-600">{t("intro")}</p>
      <ul className="mt-10 divide-y divide-neutral-100 border-y border-neutral-100">
        {pages.map((page) => (
          <li key={page.id}>
            <Link href={page.href} className="block py-5">
              <span className="block text-lg font-semibold text-neutral-950">{page.title}</span>
              <span className="mt-1 block text-sm leading-6 text-neutral-500">{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
