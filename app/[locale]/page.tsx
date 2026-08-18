import { useTranslations } from "next-intl";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("Landing");

  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-serif text-2xl italic tracking-tight">newposty</span>
        <nav className="flex items-center gap-3">
          <LocaleSwitch />
          <Link href="/login" className="text-sm text-muted hover:text-ink">
            {t("signIn")}
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper hover:bg-black"
          >
            {t("startWriting")}
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">{t("kicker")}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          {t("titleOnce")}
          <span className="italic text-accent">{t("titleEverywhere")}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-7 text-muted">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {t("createStudio")}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-line bg-card px-5 py-3 text-sm hover:border-ink/20"
          >
            {t("haveAccount")}
          </Link>
        </div>

        <ul className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { title: t("talkTitle"), body: t("talkBody") },
            { title: t("connectTitle"), body: t("connectBody") },
            { title: t("laterTitle"), body: t("laterBody") },
          ].map((item) => (
            <li key={item.title} className="rounded-3xl border border-line bg-card p-6">
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
