import { getLocale, getTranslations } from "next-intl/server";
import { PlatformStatsCards } from "@/components/studio/platform-stats-cards";
import { Link } from "@/i18n/navigation";
import { requireUser } from "@/lib/data";
import { isPlatformId } from "@/lib/platforms";

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

  const postingAccounts = (accounts ?? []).filter((account) =>
    isPlatformId(String(account.platform)),
  );
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
          { label: t("connectedAccounts"), value: postingAccounts.length },
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
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t("byPlatform")}</h2>
            <p className="mt-1 text-sm text-muted">{t("byPlatformHint")}</p>
          </div>
          <Link href="/accounts/posts" className="text-sm text-[#FF4713] underline">
            {t("manage")}
          </Link>
        </div>
        {(postingAccounts ?? []).length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
            {t("noAccounts")}
          </p>
        ) : (
          <div className="mt-4">
            <PlatformStatsCards
              accounts={postingAccounts.map((account) => ({
                id: account.id,
                platform: String(account.platform),
                username: account.username,
                display_name: account.display_name,
              }))}
            />
          </div>
        )}
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
