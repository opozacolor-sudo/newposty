import { getTranslations } from "next-intl/server";
import { DemoReveal, DemoVideoFrame, DemoYouTube } from "@/components/marketing/demo-media";
import { btnClay, clayLink, clayTile, pageLead, pageTitle } from "@/components/marketing/styles";
import { SIGNUPS_OPEN } from "@/lib/flags";
import {
  DEMO_PAGES,
  DEMO_STUDIO_TRY,
  PUBLIC_DEMO_PATH,
  STUDIO_DEMO_PATH,
  demoCopy,
  getDemoPage,
  type DemoSlug,
} from "@/lib/demo";
import { Link } from "@/i18n/navigation";

export type DemoVariant = "marketing" | "studio";

function demoPath(variant: DemoVariant, slug?: DemoSlug) {
  const base = variant === "studio" ? STUDIO_DEMO_PATH : PUBLIC_DEMO_PATH;
  return slug ? `${base}/${slug}` : base;
}

export async function DemoHubView({
  locale,
  variant,
}: {
  locale: string;
  variant: DemoVariant;
}) {
  const t = await getTranslations("Demo");

  return (
    <>
      <header className="mx-auto max-w-2xl text-center">
        <h1 className={pageTitle}>{t("title")}</h1>
        <p className={pageLead}>{t("subtitle")}</p>
      </header>

      <ol className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_PAGES.map((page, index) => {
          const copy = demoCopy(page, locale);
          return (
            <li key={page.slug}>
              <Link href={demoPath(variant, page.slug)} className={`block h-full ${clayTile}`}>
                <p className="text-sm font-medium text-[#6b5348]">{String(index + 1).padStart(2, "0")}</p>
                <span className="mt-2 block text-base font-semibold text-[#1d1d1f]">{copy.navTitle}</span>
                <span className="mt-1 block text-sm leading-5 text-[#55514e]">{copy.navBody}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <DemoFooter variant={variant} />
    </>
  );
}

export async function DemoStepView({
  locale,
  slug,
  variant,
}: {
  locale: string;
  slug: DemoSlug;
  variant: DemoVariant;
}) {
  const page = getDemoPage(slug);
  if (!page) return null;
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
  const tryAction = DEMO_STUDIO_TRY[page.slug];

  return (
    <>
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
              {video.kind ? <p className="mb-2 text-sm font-medium text-[#6b5348]">{label}</p> : null}
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
        <Link href={demoPath(variant)} className={clayLink}>
          {t("back")}
        </Link>
        <div className="flex flex-wrap gap-4">
          {prev ? (
            <Link href={demoPath(variant, prev.slug)} className={clayLink}>
              ← {demoCopy(prev, locale).navTitle}
            </Link>
          ) : null}
          {next ? (
            <Link href={demoPath(variant, next.slug)} className={clayLink}>
              {demoCopy(next, locale).navTitle} →
            </Link>
          ) : null}
        </div>
      </nav>

      {variant === "studio" ? (
        <div className="mt-16 border-t border-white/20 py-12 text-center">
          <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("studioCtaTitle")}</p>
          <div className="mt-6">
            <Link href={tryAction.href} className={`${btnClay} px-6 py-3`}>
              {t(tryAction.labelKey)}
            </Link>
          </div>
        </div>
      ) : (
        <DemoFooter variant="marketing" />
      )}
    </>
  );
}

async function DemoFooter({ variant }: { variant: DemoVariant }) {
  const t = await getTranslations("Demo");
  if (variant === "studio") {
    return (
      <div className="mt-20 border-t border-white/20 py-16 text-center sm:mt-24">
        <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("studioCtaTitle")}</p>
        <div className="mt-6">
          <Link href="/connections" className={`${btnClay} px-6 py-3`}>
            {t("tryConnections")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 border-t border-white/20 py-16 text-center sm:mt-24">
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
  );
}
