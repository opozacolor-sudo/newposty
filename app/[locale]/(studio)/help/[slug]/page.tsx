import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DemoStepView } from "@/components/demo/demo-views";
import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { DEMO_SLUGS, demoCopy, getDemoPage, isDemoSlug } from "@/lib/demo";

export function generateStaticParams() {
  return DEMO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const page = getDemoPage(slug);
  if (!page) return {};
  const copy = demoCopy(page, locale);
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function StudioDemoStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  if (!isDemoSlug(slug)) notFound();
  return (
    <main className="h-full min-h-0 overflow-y-auto">
      <MarketingPageFrame wide>
        <DemoStepView locale={locale} slug={slug} variant="studio" />
      </MarketingPageFrame>
    </main>
  );
}
