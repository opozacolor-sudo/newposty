import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Fraunces, Geist, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { HelpWidget } from "@/components/help/help-widget";
import { localeAlternates, SITE_ORIGIN } from "@/lib/locale-seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const pathname = (await headers()).get("x-pathname") ?? `/${locale}`;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, pathname),
    icons: {
      icon: [
        { url: "/posty-icon.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${fraunces.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <NextIntlClientProvider>
          {children}
          <HelpWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
