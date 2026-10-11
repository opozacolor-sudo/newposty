import type { Metadata } from "next";
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
  return (
    <MarketingPageFrame wide>
      <DemoStepView locale={locale} slug={slug} variant="marketing" />
    </MarketingPageFrame>
  );
}
