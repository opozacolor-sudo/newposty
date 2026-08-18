import Link from "next/link";
import { requireUser } from "@/lib/data";
import { platformLabel } from "@/lib/platforms";

function formatWhen(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function DashboardPage() {
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
    <main className="px-6 py-8">
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        {profile?.brand_name ? `${profile.brand_name} · ` : ""}
        A snapshot of connections and the queue.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Connected accounts", value: accounts?.length ?? 0 },
          { label: "Scheduled", value: upcoming.length },
          { label: "Published / sending", value: published.length },
        ].map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-line bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="mt-3 font-serif text-4xl">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl">Connected</h2>
          <Link href="/accounts" className="text-sm underline">
            Manage
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {(accounts ?? []).length === 0 ? (
            <li className="rounded-3xl border border-dashed border-line p-5 text-sm text-muted">
              No accounts yet. Connect Instagram, TikTok, and the rest from Accounts.
            </li>
          ) : (
            (accounts ?? []).map((account) => (
              <li key={account.id} className="rounded-3xl border border-line bg-card p-4">
                <p className="text-sm font-medium">{platformLabel(account.platform as string)}</p>
                <p className="text-sm text-muted">
                  {account.username ?? account.display_name ?? "Connected"}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Upcoming</h2>
        <ul className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <li className="rounded-3xl border border-dashed border-line p-5 text-sm text-muted">
              Nothing scheduled. Draft in chat and hit Schedule.
            </li>
          ) : (
            upcoming.map((post) => (
              <li key={post.id} className="rounded-3xl border border-line bg-card p-4">
                <p className="text-sm">{post.content}</p>
                <p className="mt-2 text-xs text-muted">
                  {formatWhen(post.scheduled_for as string | null)} · {post.status}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Recent</h2>
        <ul className="mt-4 space-y-3">
          {(posts ?? []).slice(0, 8).map((post) => (
            <li key={post.id} className="rounded-3xl border border-line bg-card p-4">
              <p className="text-sm">{post.content || "(media only)"}</p>
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
