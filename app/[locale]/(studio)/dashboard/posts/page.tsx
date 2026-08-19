import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/data";
import { Link } from "@/i18n/navigation";
import { platformLabel } from "@/lib/platforms";

function formatWhen(value: string | null, locale: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString(locale);
}

export default async function DashboardPostsPage() {
  const t = await getTranslations("Dashboard");
  const locale = await getLocale();
  const { supabase, user } = await requireUser();

  const [{ data: accounts }, { data: posts }, { data: profile }] = await Promise.all([
    supabase
      .from("social_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true),
    supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  const upcoming = (posts ?? []).filter(
    (post) => post.status === "scheduled" && post.scheduled_for,
  );
  const published = (posts ?? []).filter((post) =>
    ["published", "partial", "publishing"].includes(post.status as string),
  );

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted">
        {profile?.brand_name ? `${profile.brand_name} · ` : ""}
        {t("snapshot")}
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: t("connectedAccounts"), value: accounts?.length ?? 0 },
          { label: t("scheduled"), value: upcoming.length },
          { label: t("publishedSending"), value: published.length },
        ].map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-line bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{t("connected")}</h2>
          <Link href="/accounts/posts" className="text-sm text-[#FF4713] underline">
            {t("manage")}
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {(accounts ?? []).length === 0 ? (
            <li className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
              {t("noAccounts")}
            </li>
          ) : (
            (accounts ?? []).map((account) => (
              <li key={account.id} className="rounded-2xl border border-line bg-card p-4">
                <p className="text-sm font-medium">{platformLabel(account.platform as string)}</p>
                <p className="text-sm text-muted">
                  {account.username ?? account.display_name ?? t("connected")}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">{t("upcoming")}</h2>
        <ul className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
              {t("nothingScheduled")}
            </li>
          ) : (
            upcoming.map((post) => (
              <li key={post.id} className="rounded-2xl border border-line bg-card p-4">
                <p className="text-sm">{post.content}</p>
                <p className="mt-2 text-xs text-muted">
                  {formatWhen(post.scheduled_for as string | null, locale)} · {post.status}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">{t("recent")}</h2>
        <ul className="mt-4 space-y-3">
          {(posts ?? []).slice(0, 8).map((post) => (
            <li key={post.id} className="rounded-2xl border border-line bg-card p-4">
              <p className="text-sm">{post.content || t("mediaOnly")}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">
                {post.status}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
