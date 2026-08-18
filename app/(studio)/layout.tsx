import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
] as const;

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <Link href="/chat" className="font-serif text-2xl italic">
          newposty
        </Link>
        <nav className="mt-8 flex gap-2 lg:flex-col">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted hover:bg-card hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action="/api/logout" method="post" className="mt-8 hidden lg:block">
          <p className="truncate text-xs text-muted">{user.email}</p>
          <button type="submit" className="mt-2 text-sm text-ink underline">
            Sign out
          </button>
        </form>
      </aside>
      <div className="min-h-full">{children}</div>
    </div>
  );
}
