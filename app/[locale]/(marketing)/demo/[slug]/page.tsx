import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { DemoReveal, DemoVideoFrame, DemoYouTube } from "@/components/marketing/demo-media";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { btnClay, clayLink, clayTile, pageLead, pageTitle } from "@/components/marketing/styles";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { DEMO_PAGES, DEMO_SLUGS, demoCopy, getDemoPage, isDemoSlug } from "@/lib/demo";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return DEMO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getDemoPage(slug);
  if (!page) return {};
  const copy = demoCopy(page, locale);
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function DemoStepPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isDemoSlug(slug)) notFound();
  const page = getDemoPage(slug);
  if (!page) notFound();

  const copy = demoCopy(page, locale);
  const t = await getTranslations("Demo");
  const index = DEMO_PAGES.findIndex((item) => item.slug === page.slug);
  const prev = index > 0 ? DEMO_PAGES[index - 1] : null;
  const next = index < DEMO_PAGES.length - 1 ? DEMO_PAGES[index + 1] : null;
  const videos =
    page.videos.length > 0
      ? page.videos
      : page.slug === "create"
        ? [{ videoId: "", kind: "photo" as const }, { videoId: "", kind: "video" as const }]
        : [{ videoId: "" }];

  return (
    <MarketingPageFrame wide>
      <p className="text-sm font-medium text-[#6b5348]">{String(index + 1).padStart(2, "0")}</p>
      <header className="mt-2 max-w-2xl">
        <h1 className={pageTitle}>{copy.title}</h1>
        <p className={pageLead}>{copy.body}</p>
      </header>

      <div className={`mt-10 grid gap-6 ${videos.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}>
        {videos.map((video, videoIndex) => {
          const label =
            video.kind === "photo" ? t("videoPhoto") : video.kind === "video" ? t("videoVideo") : copy.title;
          return (
            <DemoReveal key={`${page.slug}-${videoIndex}`}>
              {video.kind ? (
                <p className="mb-2 text-sm font-medium text-[#6b5348]">{label}</p>
              ) : null}
              {video.videoId ? (
                <DemoYouTube videoId={video.videoId} title={label} />
              ) : (
                <DemoVideoFrame label={t("videoSoon")} />
              )}
            </DemoReveal>
          );
        })}
      </div>

      <section className="mt-12 max-w-2xl">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#5c5652]">{t("sayTitle")}</h2>
        <ul className="mt-4 space-y-3">
          {copy.say.map((line) => (
            <li key={line} className={clayTile}>
              <p className="text-sm leading-6 text-[#1d1d1f]">“{line}”</p>
            </li>
          ))}
        </ul>
        {copy.note ? <p className="mt-4 text-sm leading-6 text-[#55514e]">{copy.note}</p> : null}
      </section>

      <nav className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-8">
        <Link href="/demo" className={clayLink}>
          {t("back")}
        </Link>
        <div className="flex flex-wrap gap-4">
          {prev ? (
            <Link href={`/demo/${prev.slug}`} className={clayLink}>
              ← {demoCopy(prev, locale).navTitle}
            </Link>
          ) : null}
          {next ? (
            <Link href={`/demo/${next.slug}`} className={clayLink}>
              {demoCopy(next, locale).navTitle} →
            </Link>
          ) : null}
        </div>
      </nav>

      <div className="mt-16 border-t border-white/20 py-12 text-center">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("ctaTitle")}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={SIGNUPS_OPEN ? "/signup" : "/waitlist"} className={`${btnClay} px-6 py-3`}>
            {t("ctaButton")}
          </Link>
          <Link href="/guide" className={clayLink}>
            {t("readGuide")}
          </Link>
        </div>
      </div>
    </MarketingPageFrame>
  );
}
