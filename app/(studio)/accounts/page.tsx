import Link from "next/link";
import { requireUser } from "@/lib/data";
import { PLATFORMS, platformLabel } from "@/lib/platforms";

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; platform?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const params = await searchParams;
  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("connected_at", { ascending: false });

  const byPlatform = new Map<string, typeof accounts>();
  for (const account of accounts ?? []) {
    const current = byPlatform.get(account.platform as string) ?? [];
    current.push(account);
    byPlatform.set(account.platform as string, current);
  }

  return (
    <main className="px-6 py-8">
      <h1 className="font-serif text-4xl">Accounts</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Connect through Zernio’s hosted OAuth. Facebook Pages, LinkedIn orgs,
        Pinterest boards, and Google locations use Zernio’s picker after login.
      </p>

      {params.connected ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-good">
          {params.platform
            ? `${platformLabel(params.platform)} connected.`
            : "Account connected."}{" "}
          You can publish from chat.
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-accent">
          {params.error}
        </p>
      ) : null}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const connected = byPlatform.get(platform.id) ?? [];
          return (
            <li key={platform.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl">{platform.label}</h2>
                  <p className="mt-1 text-sm text-muted">{platform.hint}</p>
                </div>
                <Link
                  href={`/api/connect?platform=${platform.id}`}
                  className="rounded-full bg-ink px-3 py-2 text-xs text-paper"
                >
                  {connected.length > 0 ? "Connect another" : "Connect"}
                </Link>
              </div>
              {connected.length > 0 ? (
                <ul className="mt-4 space-y-1 text-sm">
                  {connected.map((account) => (
                    <li key={account.id} className="text-muted">
                      {account.username ?? account.display_name ?? "Connected"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">Not connected</p>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
