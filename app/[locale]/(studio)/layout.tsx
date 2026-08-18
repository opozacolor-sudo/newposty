import { getLocale, getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link, redirect } from "@/i18n/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Nav");
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    throw new Error("Unauthorized");
  }

  const links = [
    { href: "/chat" as const, label: t("chat") },
    { href: "/dashboard" as const, label: t("dashboard") },
    { href: "/accounts" as const, label: t("accounts") },
  ];

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <Link href="/chat" className="font-serif text-2xl italic">
          newposty
        </Link>
        <nav className="mt-8 flex gap-2 lg:flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted hover:bg-card hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex items-center justify-between gap-3">
          <LocaleSwitch />
          <form action="/api/logout" method="post" className="hidden lg:block">
            <p className="truncate text-xs text-muted">{user.email}</p>
            <button type="submit" className="mt-2 text-sm text-ink underline">
              {t("signOut")}
            </button>
          </form>
        </div>
      </aside>
      <div className="min-h-full">{children}</div>
    </div>
  );
}
