import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { Link } from "@/i18n/navigation";
import { getMadeFor, isMadeForSlug, MADE_FOR } from "@/lib/made-for";
import { ADS_PLATFORMS, isConnectDisabled, PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/studio/platform-icon";

export function generateStaticParams() {
  return MADE_FOR.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getMadeFor(slug);
  if (!page) return {};
  const copy = locale === "ro" ? page.ro : page.en;
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function MadeForAudiencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isMadeForSlug(slug)) notFound();
  const page = getMadeFor(slug);
  if (!page) notFound();

  const copy = locale === "ro" ? page.ro : page.en;
  const t = await getTranslations("MadeFor");
  const others = MADE_FOR.filter((item) => item.slug !== page.slug);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#FF4713]">{copy.kicker}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-500 sm:text-lg">{copy.subtitle}</p>
          <a href="#waitlist" className="mt-6 inline-flex text-sm font-medium text-[#FF4713] hover:underline">
            {t("cta")}
          </a>
        </div>
        <img
          src={page.hero}
          alt=""
          className="aspect-[16/9] w-full rounded-3xl object-cover"
        />
      </header>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {copy.features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-5">
            <h2 className="text-base font-semibold text-neutral-950">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <img
          src={page.detail}
          alt=""
          className="aspect-[4/3] w-full rounded-3xl object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">{copy.batchTitle}</h2>
          <p className="mt-3 text-base leading-7 text-neutral-500">{copy.batchBody}</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{t("channels")}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <li
              key={platform.id}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-100 bg-white py-1 pl-1 pr-3"
            >
              <PlatformIcon platform={platform} connected={!isConnectDisabled(platform.id)} size="sm" />
              <span className="text-sm font-medium text-neutral-800">{platform.label}</span>
              {isConnectDisabled(platform.id) ? (
                <span className="text-[11px] text-neutral-400">{t("soon")}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-3xl bg-neutral-950 px-6 py-10 text-white sm:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF4713]">{t("ads")}</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{copy.adsTitle}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-300">{copy.adsBody}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {ADS_PLATFORMS.map((platform) => (
            <li
              key={platform.id}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3"
            >
              <PlatformIcon platform={platform} connected={!isConnectDisabled(platform.id)} size="sm" />
              <span className="text-sm font-medium">{platform.label}</span>
              {isConnectDisabled(platform.id) ? (
                <span className="text-[11px] text-neutral-400">{t("soon")}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">{t("howTitle")}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-neutral-100 p-5">
              <p className="text-sm font-medium text-[#FF4713]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-base font-semibold text-neutral-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">{t("faqTitle")}</h2>
        <div className="mt-6 divide-y divide-neutral-100 border-y border-neutral-100">
          {copy.faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-medium text-neutral-950">
                {item.q}
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{t("alsoTitle")}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item) => {
            const other = locale === "ro" ? item.ro : item.en;
            return (
              <li key={item.slug}>
                <Link
                  href={`/made-for/${item.slug}`}
                  className="block rounded-2xl border border-neutral-100 px-4 py-4 hover:border-[#FF4713]"
                >
                  <span className="block text-sm font-semibold text-neutral-950">{other.navTitle}</span>
                  <span className="mt-1 block text-sm leading-5 text-neutral-500">{other.navBody}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mx-auto mt-16 max-w-xl border-t border-neutral-100 pt-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-neutral-950">{t("ctaTitle")}</p>
        <WaitlistForm />
      </div>
    </article>
  );
}
